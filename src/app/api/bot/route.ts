import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

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

    // 1. Start Command
    if (text === "/start") {
      const welcomeMsg = `Assalam-o-Alaikum ${firstName}!\n\nWelcome to *Global Trust Cash* Bot. 💰\n\nCommands:\n/login <email> - Link your account\n/balance - Check your balance\n/stats - Platform Stats\n/site - Website Link`;
      await sendTelegram(chatId, welcomeMsg);
    } 

    // 2. Platform Stats
    else if (text === "/stats") {
      const [userCount, pendingDeposits] = await Promise.all([
        db.user.count(),
        db.deposit.count({ where: { status: "PENDING" } })
      ]);

      const statsMsg = `📊 *Global Trust Cash - Live Stats*\n\n` +
                       `👥 Total Users: ${userCount}\n` +
                       `⏳ Pending Deposits: ${pendingDeposits}\n\n` +
                       `🌐 Website: https://globaltcash.up.railway.app/`;
      
      await sendTelegram(chatId, statsMsg);
    }

    // 3. Login Logic
    else if (text.startsWith("/login")) {
      const email = text.split(" ")[1];

      if (!email) {
        await sendTelegram(chatId, "❌ Please provide your email.\nExample: `/login user@email.com` ");
      } else {
        const user = await db.user.findUnique({ where: { email: email } });

        if (!user) {
          await sendTelegram(chatId, "❌ Is email se koi account nahi mila.");
        } else {
          await db.user.update({
            where: { email: email },
            data: { telegramId: chatId.toString() }
          });
          await sendTelegram(chatId, `✅ Welcome, *${user.name || "Investor"}*!\n\nAapka account link ho gaya hai. Ab aap /balance check kar sakte hain.`);
        }
      }
    }

    // 4. Personal Balance
    else if (text === "/balance") {
      const user = await db.user.findUnique({ 
        where: { telegramId: chatId.toString() } 
      });

      if (!user) {
        await sendTelegram(chatId, "⚠️ Pehle login karein: `/login your@email.com` ");
      } else {
        await sendTelegram(chatId, `💰 *Your Balance*\n\nAvailable: ${user.balance || 0} PKR\nTotal Earnings: ${user.totalEarnings || 0} PKR`);
      }
    }

    // 5. Website Link
    else if (text === "/site") {
      await sendTelegram(chatId, "🌐 Official Website: https://globaltcash.up.railway.app/");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Route Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

async function sendTelegram(chatId: number, text: string) {
  try {
    if (!TELEGRAM_TOKEN) return;
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