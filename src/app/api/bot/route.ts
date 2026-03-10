import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if it's a message or a button click (callback_query)
    const message = body.message;
    const callbackQuery = body.callback_query;

    const chatId = message ? message.chat.id : callbackQuery.message.chat.id;
    const text = message?.text || "";
    const data = callbackQuery?.data || "";

    // 1. Handling Button Clicks (Callback Queries)
    if (data === "check_balance") {
      const user = await db.user.findUnique({ where: { telegramId: chatId.toString() } });
      if (!user) {
        await sendTelegram(chatId, "⚠️ Aap logged in nahi hain. Pehle /login karein.");
      } else {
        await sendTelegram(chatId, `💰 *Your Balance*\n\nAvailable: ${user.balance} PKR\nReferral: ${user.referralEarnings} PKR`);
      }
      return NextResponse.json({ success: true });
    }

    // 2. Start Command with Buttons
    if (text === "/start") {
      const welcomeMsg = "Assalam-o-Alaikum! *Global Trust Cash* mein khush-amdeed. Niche diye gaye buttons use karein:";
      const buttons = {
        inline_keyboard: [
          [{ text: "📊 Platform Stats", callback_data: "view_stats" }],
          [{ text: "💰 Check Balance", callback_data: "check_balance" }],
          [{ text: "🌐 Visit Website", url: "https://globaltcash.up.railway.app/" }]
        ]
      };
      await sendTelegram(chatId, welcomeMsg, buttons);
    }

    // 3. Login Logic (Email + Password)
    else if (text.startsWith("/login")) {
      const parts = text.split(" ");
      const email = parts[1];
      const password = parts[2];

      if (!email || !password) {
        await sendTelegram(chatId, "❌ Sahi tariqa: `/login email password` \n\nExample: `/login user@gmail.com 123456` ");
      } else {
        const user = await db.user.findUnique({ where: { email } });
        if (user && user.password === password) {
          await db.user.update({
            where: { email },
            data: { telegramId: chatId.toString() }
          });
          await sendTelegram(chatId, `✅ Welcome back, *${user.name}*! Aapka account link ho gaya hai.`);
        } else {
          await sendTelegram(chatId, "❌ Galat email ya password.");
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

async function sendTelegram(chatId: number, text: string, replyMarkup: any = null) {
  try {
    const body: any = {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) body.reply_markup = replyMarkup;

    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}