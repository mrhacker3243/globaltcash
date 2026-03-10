import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.message || !body.message.text) return NextResponse.json({ status: "no" });

    const chatId = body.message.chat.id;
    const text = body.message.text; // Commands case-sensitive ho sakti hain password ki wajah se
    const firstName = body.message.from.first_name || "User";

    // Pehle check karein ke user logged in hai ya nahi aur uska role kya hai
    const currentUser = await db.user.findUnique({
      where: { telegramId: chatId.toString() }
    });

    // 1. Start Command
    if (text.toLowerCase() === "/start") {
      const welcome = `Assalam-o-Alaikum ${firstName}!\n\nWelcome to *Global Trust Cash*.\n\n` +
                      `🔐 *Login:* /login email password\n` +
                      `💰 *Balance:* /balance\n` +
                      `📊 *Stats:* /stats`;
      await sendTelegram(chatId, welcome);
    }

    // 2. Login Logic (Email + Password)
    else if (text.toLowerCase().startsWith("/login")) {
      const parts = text.split(" ");
      const email = parts[1];
      const password = parts[2];

      if (!email || !password) {
        await sendTelegram(chatId, "❌ Format: `/login email password` \nExample: `/login test@gmail.com 123456` ");
        return NextResponse.json({ success: true });
      }

      const user = await db.user.findUnique({ where: { email: email } });

      if (!user || user.password !== password) { // Plain text password check (jaise aapne schema mein rakha hai)
        await sendTelegram(chatId, "❌ Galat email ya password. Dubara koshish karein.");
      } else {
        await db.user.update({
          where: { email: email },
          data: { telegramId: chatId.toString() }
        });
        await sendTelegram(chatId, `✅ Welcome *${user.name || "User"}*!\n\nAapka account link ho gaya hai.`);
      }
    }

    // 3. Admin Wise Reply & User Tree
    else if (text.toLowerCase() === "/stats") {
      const [userCount, pendingDeposits, totalVol] = await Promise.all([
        db.user.count(),
        db.deposit.count({ where: { status: "PENDING" } }),
        db.deposit.aggregate({ _sum: { amount: true } })
      ]);

      let statsMsg = `📊 *Platform Stats*\n\n👥 Users: ${userCount}\n🌐 Site: globaltcash.up.railway.app`;
      
      // Agar Admin hai to extra info dikhao
      if (currentUser?.role === "ADMIN") {
        statsMsg += `\n\n🔑 *Admin Panel*\n⏳ Pending: ${pendingDeposits}\n💰 Total Vol: ${totalVol._sum.amount || 0} PKR`;
      }
      
      await sendTelegram(chatId, statsMsg);
    }

    // 4. Balance Check (Fixing the build error)
    else if (text.toLowerCase() === "/balance") {
      if (!currentUser) {
        await sendTelegram(chatId, "⚠️ Pehle login karein: `/login email password` ");
      } else {
        // totalEarnings ki jagah referralEarnings use kiya hai jo schema mein hai
        const msg = `💰 *Account Balance*\n\n` +
                    `💵 Available: ${currentUser.balance || 0} PKR\n` +
                    `👥 Referral: ${currentUser.referralEarnings || 0} PKR\n` +
                    `🏆 Rank: ${currentUser.rankLevel || "Starter"}`;
        await sendTelegram(chatId, msg);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}

async function sendTelegram(chatId: number, text: string) {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" }),
    });
  } catch (err) { console.error(err); }
}