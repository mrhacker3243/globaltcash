import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Railway Variables se token uthayega
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Agar Telegram se message nahi hai to return kar do
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: "no_message" });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.toLowerCase();
    const firstName = body.message.from.first_name || "User";

    // 1. Start Command
    if (text === "/start") {
      const welcomeMsg = `Assalam-o-Alaikum ${firstName}!\n\nWelcome to *Global Trust Cash* Bot. 💰\n\nCommands:\n/stats - Check Platform Stats\n/site - Get Website Link`;
      await sendTelegram(chatId, welcomeMsg);
    } 

    // 2. Stats Command (Database se real data)
    else if (text === "/stats") {
      const [userCount, pendingDeposits, totalDeposits] = await Promise.all([
        prisma.user.count(),
        prisma.deposit.count({ where: { status: "PENDING" } }),
        prisma.deposit.aggregate({
            _sum: { amount: true },
            where: { status: "COMPLETED" }
        })
      ]);

      const statsMsg = `📊 *Global Trust Cash - Live Stats*\n\n` +
                       `👥 Total Users: ${userCount}\n` +
                       `⏳ Pending Deposits: ${pendingDeposits}\n` +
                       `💰 Total Investment: ${totalDeposits._sum.amount || 0} PKR\n\n` +
                       `Check more on: https://globaltcash.up.railway.app/admin`;
      
      await sendTelegram(chatId, statsMsg);
    }

    // 3. Website Link Command
    else if (text === "/site") {
      await sendTelegram(chatId, "🌐 Hamari Official Website: https://globaltcash.up.railway.app/");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Route Error:", error);
    // Silent fail for Telegram webhooks
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

// Helper Function to send messages
async function sendTelegram(chatId: number, text: string) {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}