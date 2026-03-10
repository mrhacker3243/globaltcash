import { NextResponse } from "next/server";
// Aapki file ka naam db.ts hai, isliye yahan change kiya hai
import { prisma } from "../../lib/db"; 

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: "no_message" });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.toLowerCase();
    const firstName = body.message.from.first_name || "User";

    if (text === "/start") {
      const welcomeMsg = `Assalam-o-Alaikum ${firstName}!\n\nWelcome to *Global Trust Cash* Bot. 💰\n\nCommands:\n/stats - Check Platform Stats\n/site - Get Website Link`;
      await sendTelegram(chatId, welcomeMsg);
    } 

    else if (text === "/stats") {
      // Data fetching using your db.ts client
      const [userCount, pendingDeposits] = await Promise.all([
        prisma.user.count(),
        prisma.deposit.count({ where: { status: "PENDING" } })
      ]);

      const statsMsg = `📊 *Global Trust Cash - Live Stats*\n\n` +
                       `👥 Total Users: ${userCount}\n` +
                       `⏳ Pending Deposits: ${pendingDeposits}\n\n` +
                       `🌐 Website: https://globaltcash.up.railway.app/`;
      
      await sendTelegram(chatId, statsMsg);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Route Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

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
}import { NextResponse } from "next/server";
// Aapki file ka naam db.ts hai, isliye yahan change kiya hai
import { prisma } from "../../lib/db"; 

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: "no_message" });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.toLowerCase();
    const firstName = body.message.from.first_name || "User";

    if (text === "/start") {
      const welcomeMsg = `Assalam-o-Alaikum ${firstName}!\n\nWelcome to *Global Trust Cash* Bot. 💰\n\nCommands:\n/stats - Check Platform Stats\n/site - Get Website Link`;
      await sendTelegram(chatId, welcomeMsg);
    } 

    else if (text === "/stats") {
      // Data fetching using your db.ts client
      const [userCount, pendingDeposits] = await Promise.all([
        prisma.user.count(),
        prisma.deposit.count({ where: { status: "PENDING" } })
      ]);

      const statsMsg = `📊 *Global Trust Cash - Live Stats*\n\n` +
                       `👥 Total Users: ${userCount}\n` +
                       `⏳ Pending Deposits: ${pendingDeposits}\n\n` +
                       `🌐 Website: https://globaltcash.up.railway.app/`;
      
      await sendTelegram(chatId, statsMsg);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Route Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

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