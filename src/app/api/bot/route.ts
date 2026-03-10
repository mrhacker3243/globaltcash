import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// State and Language storage
const userState: Record<number, { step: string; email?: string; lang: string }> = {};

const translations: any = {
  en: {
    welcome: "Welcome to *Global Trust Cash*. Choose an option:",
    login: "🔐 Login", register: "📝 Register", site: "🌐 Website",
    askEmail: "📧 Please send your *Email Address*:",
    askPass: "🔑 Now send your *Password*:",
    success: "✅ Login Successful!",
    dashboard: "🏠 Dashboard", balance: "Balance", ref: "Referral Link"
  },
  ur: {
    welcome: "*Global Trust Cash* میں خوش آمدید۔ نیچے دیے گئے بٹن استعمال کریں:",
    login: "🔐 لاگ ان", register: "📝 رجسٹریشن", site: "🌐 ویب سائٹ",
    askEmail: "📧 براہ کرم اپنا *ای میل* لکھیں:",
    askPass: "🔑 اب اپنا *پاس ورڈ* لکھیں:",
    success: "✅ لاگ ان کامیاب رہا!",
    dashboard: "🏠 ڈیش بورڈ", balance: "بیلنس", ref: "ریفرل لنک"
  },
  hi: {
    welcome: "*Global Trust Cash* में आपका स्वागत है। कृपया एक विकल्प चुनें:",
    login: "🔐 लॉगिन", register: "📝 रजिस्टर", site: "🌐 वेबसाइट",
    askEmail: "📧 कृपया अपना *ईमेल* भेजें:",
    askPass: "🔑 अब अपना *पासवर्ड* भेजें:",
    success: "✅ लॉगिन सफल रहा!",
    dashboard: "🏠 डैशबोर्ड", balance: "बैलेंस", ref: "रेफरल लिंक"
  },
  ar: {
    welcome: "أهلاً بك في *Global Trust Cash*. اختر خياراً:",
    login: "🔐 تسجيل الدخول", register: "📝 تسجيل", site: "🌐 الموقع",
    askEmail: "📧 يرجى إرسال *البريد الإلكتروني*:",
    askPass: "🔑 الآن أرسل *كلمة المرور*:",
    success: "✅ تم تسجيل الدخول بنجاح!",
    dashboard: "🏠 لوحة التحكم", balance: "الرصيد", ref: "رابط الإحالة"
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

    // 1. Language Selection on Start
    if (text === "/start") {
      const langButtons = {
        inline_keyboard: [
          [{ text: "English 🇺🇸", callback_data: "setlang_en" }, { text: "اردو 🇵🇰", callback_data: "setlang_ur" }],
          [{ text: "हिन्दी 🇮🇳", callback_data: "setlang_hi" }, { text: "العربية 🇸🇦", callback_data: "setlang_ar" }]
        ]
      };
      await sendTelegram(chatId, "Please select your language / زبان منتخب کریں:", langButtons);
      return NextResponse.json({ success: true });
    }

    // 2. Set Language and Show Main Menu
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
    }

    // 3. Login Flow with Language Support
    const currentLang = userState[chatId]?.lang || "en";
    const t = translations[currentLang];

    if (data === "ask_email") {
      userState[chatId] = { ...userState[chatId], step: "waiting_for_email" };
      await sendTelegram(chatId, t.askEmail);
    }

    if (text && userState[chatId]?.step === "waiting_for_email") {
      userState[chatId] = { ...userState[chatId], step: "waiting_for_password", email: text };
      await sendTelegram(chatId, t.askPass);
    } 
    
    else if (text && userState[chatId]?.step === "waiting_for_password") {
      const user = await db.user.findUnique({ where: { email: userState[chatId].email } });
      if (user && user.password === text) {
        await db.user.update({ where: { email: user.email }, data: { telegramId: chatId.toString() } });
        userState[chatId].step = "idle";
        
        const dashButton = { inline_keyboard: [[{ text: t.dashboard, callback_data: "show_dash" }]] };
        await sendTelegram(chatId, t.success, dashButton);
      } else {
        await sendTelegram(chatId, "❌ Error / غلطی");
        userState[chatId].step = "idle";
      }
    }

    // 4. Dashboard with Language
    if (data === "show_dash") {
      const user = await db.user.findUnique({ where: { telegramId: chatId.toString() } });
      if (user) {
        const dashMsg = `🏠 *${t.dashboard}*\n\n💰 ${t.balance}: ${user.balance} PKR\n🔗 ${t.ref}:\nhttps://globaltcash.up.railway.app/register?ref=${user.id}`;
        await sendTelegram(chatId, dashMsg);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

async function sendTelegram(chatId: number, text: string, replyMarkup: any = null) {
  const body: any = { chat_id: chatId, text, parse_mode: "Markdown" };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}