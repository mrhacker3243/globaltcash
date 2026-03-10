import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID; // Optional: Apna Chat ID env mein daal dein

// State storage
const userState: Record<number, { step: string; email?: string; lang: string }> = {};

const translations: any = {
  en: {
    welcome: "Welcome to *Global Trust Cash*. Choose an option:",
    login: "🔐 Login", register: "📝 Register", site: "🌐 Website",
    askEmail: "📧 Please send your *Email Address*:",
    askPass: "🔑 Now send your *Password*:",
    success: "✅ Login Successful!",
    dashboard: "🏠 Dashboard", balance: "Balance", ref: "Referral Link",
    error: "❌ Invalid Email or Password.",
    not_found: "❌ User not found."
  },
  ur: {
    welcome: "*Global Trust Cash* میں خوش آمدید۔ نیچے دیے گئے بٹن استعمال کریں:",
    login: "🔐 لاگ ان", register: "📝 رجسٹریشن", site: "🌐 ویب سائٹ",
    askEmail: "📧 براہ کرم اپنا *ای میل* لکھیں:",
    askPass: "🔑 اب اپنا *پاس ورڈ* لکھیں:",
    success: "✅ لاگ ان کامیاب رہا!",
    dashboard: "🏠 ڈیش بورڈ", balance: "بیلنس", ref: "ریفرل لنک",
    error: "❌ ای میل یا پاس ورڈ غلط ہے۔",
    not_found: "❌ صارف نہیں ملا۔"
  },
  hi: {
    welcome: "*Global Trust Cash* में आपका स्वागत है। कृपया एक विकल्प चुनें:",
    login: "🔐 लॉगिन", register: "📝 रजिस्टर", site: "🌐 वेबसाइट",
    askEmail: "📧 कृपया अपना *ईमेल* भेजें:",
    askPass: "🔑 अब अपना *पासवर्ड* भेजें:",
    success: "✅ लॉगिन सफल रहा!",
    dashboard: "🏠 डैशबोर्ड", balance: "बैलेंस", ref: "रेफरल लिंक",
    error: "❌ गलत ईमेल या पासवर्ड।",
    not_found: "❌ उपयोगकर्ता नहीं मिला।"
  },
  ar: {
    welcome: "أهلاً بك في *Global Trust Cash*. اختر خياراً:",
    login: "🔐 تسجيل الدخول", register: "📝 تسجيل", site: "🌐 الموقع",
    askEmail: "📧 يرجى إرسال *البريد الإلكتروني*:",
    askPass: "🔑 الآن أرسل *كلمة المرور*:",
    success: "✅ تم تسجيل الدخول بنجاح!",
    dashboard: "🏠 لوحة التحكم", balance: "الرصيد", ref: "رابط الإحالة",
    error: "❌ البريد الإلكتروني أو كلمة المرور غير صالحة.",
    not_found: "❌ لم يتم العثور على المستخدم."
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const msg = body.message;
    const cb = body.callback_query;

    const chatId = msg ? msg.chat.id : cb.message.chat.id;
    const text = msg?.text || "";
    const data = cb?.data || "";

    // 1. Start & Language Selection
    if (text === "/start") {
      delete userState[chatId];
      const langButtons = {
        inline_keyboard: [
          [{ text: "English 🇺🇸", callback_data: "setlang_en" }, { text: "اردو 🇵🇰", callback_data: "setlang_ur" }],
          [{ text: "हिन्दी 🇮🇳", callback_data: "setlang_hi" }, { text: "العربية 🇸🇦", callback_data: "setlang_ar" }]
        ]
      };
      await sendTelegram(chatId, "Select Language / زبان منتخب کریں:", langButtons);
      return NextResponse.json({ success: true });
    }

    // 2. Handle Language Set
    if (data.startsWith("setlang_")) {
      const selectedLang = data.split("_")[1];
      userState[chatId] = { step: "idle", lang: selectedLang };
      const t = translations[selectedLang];

      const mainMenu = {
        inline_keyboard: [
          [{ text: t.login, callback_data: "ask_email" }, { text: t.register, url: "https://globaltcash.up.railway.app/register" }],
          [{ text: t.site, url: "https://globaltcash.up.railway.app/" }]
        ]
      };
      await sendTelegram(chatId, t.welcome, mainMenu);
      return NextResponse.json({ success: true });
    }

    const currentLang = userState[chatId]?.lang || "en";
    const t = translations[currentLang];

    // 3. Login Trigger
    if (data === "ask_email") {
      userState[chatId].step = "waiting_for_email";
      await sendTelegram(chatId, t.askEmail);
    }

    // 4. Text Input Handling (Email -> Password -> Verify)
    if (msg && text && !text.startsWith("/")) {
      const state = userState[chatId];

      if (state?.step === "waiting_for_email") {
        userState[chatId].step = "waiting_for_password";
        userState[chatId].email = text.trim().toLowerCase();
        await sendTelegram(chatId, t.askPass);
      } 
      
      else if (state?.step === "waiting_for_password") {
        const email = state.email!;
        const pass = text.trim();
        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
          await sendTelegram(chatId, t.not_found);
          userState[chatId].step = "idle";
        } else {
          // Hash Comparison using Bcrypt
          const isValid = await bcrypt.compare(pass, user.password);

          if (isValid) {
            await db.user.update({
              where: { email },
              data: { telegramId: chatId.toString() }
            });
            userState[chatId].step = "idle";
            const dashBtn = { inline_keyboard: [[{ text: t.dashboard, callback_data: "show_dash" }]] };
            await sendTelegram(chatId, t.success, dashBtn);

            // Admin Alert (Optional)
            if (ADMIN_CHAT_ID) {
              await sendTelegram(Number(ADMIN_CHAT_ID), `🔔 *Admin Alert*\nUser Logged In: ${user.email}\nLang: ${currentLang}`);
            }
          } else {
            await sendTelegram(chatId, t.error);
            userState[chatId].step = "idle";
          }
        }
      }
    }

    // 5. Dashboard Action
    if (data === "show_dash") {
      const user = await db.user.findUnique({ where: { telegramId: chatId.toString() } });
      if (user) {
        const dashMsg = `🏠 *${t.dashboard}*\n\n` +
                        `👤 Name: ${user.name || "N/A"}\n` +
                        `💵 ${t.balance}: ${user.balance || 0} PKR\n` +
                        `👥 Referrals: ${user.referralCount || 0}\n\n` +
                        `🔗 *${t.ref}:*\nhttps://globaltcash.up.railway.app/register?ref=${user.id}`;
        await sendTelegram(chatId, dashMsg);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Logic Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

async function sendTelegram(chatId: number, text: string, replyMarkup: any = null) {
  try {
    const body: any = { chat_id: chatId, text, parse_mode: "Markdown" };
    if (replyMarkup) body.reply_markup = replyMarkup;
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) { console.error("TG Fetch Error:", err); }
}