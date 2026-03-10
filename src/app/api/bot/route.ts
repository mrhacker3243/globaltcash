import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Temporary state store (In-memory) - Production mein Redis behtar hai
const userState: Record<number, { step: string; email?: string }> = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;
    const callbackQuery = body.callback_query;

    const chatId = message ? message.chat.id : callbackQuery.message.chat.id;
    const text = message?.text || "";
    const data = callbackQuery?.data || "";

    // 1. Initial Buttons (/start)
    if (text === "/start") {
      delete userState[chatId];
      const welcomeMsg = "💰 *Welcome to Global Trust Cash*\n\nPlease select an option below:";
      const buttons = {
        inline_keyboard: [
          [{ text: "🔐 Login Account", callback_data: "ask_email" }, { text: "📝 Register Now", url: "https://globaltcash.up.railway.app/register" }],
          [{ text: "🌐 Visit Official Website", url: "https://globaltcash.up.railway.app/" }]
        ]
      };
      await sendTelegram(chatId, welcomeMsg, buttons);
      return NextResponse.json({ success: true });
    }

    // 2. Handle Button Clicks
    if (data === "ask_email") {
      userState[chatId] = { step: "waiting_for_email" };
      await sendTelegram(chatId, "📧 Please send your *Email Address*:");
    }

    if (data === "show_dashboard") {
      const user = await db.user.findUnique({ where: { telegramId: chatId.toString() } });
      if (user) {
        const dashMsg = `🏠 *User Dashboard*\n\n` +
                        `👤 Name: ${user.name}\n` +
                        `💵 Balance: ${user.balance} PKR\n` +
                        `👥 Referrals: ${user.referralCount}\n` +
                        `🏆 Rank: ${user.rankLevel}\n\n` +
                        `🔗 *Your Referral Link:*\nhttps://globaltcash.up.railway.app/register?ref=${user.id}`;
        await sendTelegram(chatId, dashMsg);
      }
    }

    // 3. Handle Text Input (Email & Password steps)
    if (text && !text.startsWith("/")) {
      const state = userState[chatId];

      if (state?.step === "waiting_for_email") {
        userState[chatId] = { step: "waiting_for_password", email: text };
        await sendTelegram(chatId, "🔑 Great! Now send your *Password*:");
      } 
      
      else if (state?.step === "waiting_for_password") {
        const email = state.email!;
        const password = text;

        const user = await db.user.findUnique({ where: { email } });

        if (user && user.password === password) {
          await db.user.update({
            where: { email },
            data: { telegramId: chatId.toString() }
          });
          delete userState[chatId];
          
          const successMsg = `✅ *Login Successful!*\nWelcome back ${user.name}.`;
          const dashButton = {
            inline_keyboard: [[{ text: "📊 Open Dashboard", callback_data: "show_dashboard" }]]
          };
          await sendTelegram(chatId, successMsg, dashButton);
        } else {
          await sendTelegram(chatId, "❌ Invalid email or password. Click /start to try again.");
          delete userState[chatId];
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
    const body: any = { chat_id: chatId, text, parse_mode: "Markdown" };
    if (replyMarkup) body.reply_markup = replyMarkup;
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) { console.error(err); }
}