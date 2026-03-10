import { db } from "@/lib/db";
import { sendTelegram } from "./utils";
import { showDashboard } from "./pages/dashboard";
import { showFinancePage } from "./pages/finance";
import { showSettingsPage } from "./pages/settings";
import { showTeamPage } from "./pages/team";
import { userState } from "./states";

export async function handleUpdate(body: any) {
  const msg = body.message;
  const cb = body.callback_query;
  
  const chatId = msg ? msg.chat.id : cb?.message?.chat?.id;
  const text = msg?.text || "";
  const data = cb?.data || ""; 

  if (!chatId) return;

  // 1. Database Priority Check (Sabse pehle DB se pucho)
  const user = await db.user.findUnique({ 
    where: { telegramId: String(chatId) } 
  });

  // 2. Start Command Logic
  if (text === "/start") {
    if (user) {
      // Agar ID DB mein hai, to seedha dashboard aur function stop
      return await showDashboard(chatId, user);
    } else {
      // Agar user DB mein nahi hai, sirf tab hi Login/Language dikhao
      const langBtns = {
        inline_keyboard: [
          [{ text: "English 🇺🇸", callback_data: "setlang_en" }, { text: "اردو 🇵🇰", callback_data: "setlang_ur" }],
          [{ text: "हिन्दी 🇮🇳", callback_data: "setlang_hi" }, { text: "العربية 🇸🇦", callback_data: "setlang_ar" }]
        ]
      };
      await sendTelegram(chatId, "Welcome to Global Trust Cash! Please select your language to Login:", langBtns);
      return;
    }
  }

  // 3. Navigation Logic for Logged-In Users
  if (user) {
    if (data === "show_dash") {
      return await showDashboard(chatId, user);
    }

    switch (data) {
      case "page_deposit":
        await showFinancePage(chatId, user, 'deposit');
        break;
      case "page_withdraw":
        await showFinancePage(chatId, user, 'withdraw');
        break;
      case "page_settings":
        await showSettingsPage(chatId, user);
        break;
      case "page_team":
        await showTeamPage(chatId, user);
        break;
    }
    return; // User mil gaya to login steps par jane ki zaroorat nahi
  }

  // 4. Login Flow for New Users (Only if user not in DB)
  if (data.startsWith("setlang_")) {
    const selectedLang = data.split("_")[1];
    userState[chatId] = { step: "waiting_for_email", lang: selectedLang };
    await sendTelegram(chatId, "📧 Please send your *Email Address* to login:");
  }
}