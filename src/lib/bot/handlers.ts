import { db } from "@/lib/db";
import { sendTelegram } from "./utils";
import { showDashboard } from "./pages/dashboard";
import { showFinancePage } from "./pages/finance";
import { showSettingsPage } from "./pages/settings";
import { showTeamPage } from "./pages/team";
import { userState } from "./states";
import bcrypt from "bcryptjs";

export async function handleUpdate(body: any) {
  const msg = body.message;
  const cb = body.callback_query;
  
  const chatId = msg ? msg.chat.id : cb?.message?.chat?.id;
  const text = msg?.text || "";
  const data = cb?.data || ""; 

  if (!chatId) return;

  // 1. Database Priority Check (Sabse pehle DB check)
  const user = await db.user.findUnique({ 
    where: { telegramId: String(chatId) } 
  });

  // 2. Start Command Logic
  if (text === "/start") {
    if (user) {
      // Role check dashboard ke andar handle hoga
      return await showDashboard(chatId, user);
    } else {
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
    if (data === "show_dash") return await showDashboard(chatId, user);

    switch (data) {
      case "page_deposit": await showFinancePage(chatId, user, 'deposit'); break;
      case "page_withdraw": await showFinancePage(chatId, user, 'withdraw'); break;
      case "page_settings": await showSettingsPage(chatId, user); break;
      case "page_team": await showTeamPage(chatId, user); break;
      
      // Admin specific callback handlers
      case "admin_deposits":
        if (user.role === "ADMIN") await sendTelegram(chatId, "Fetching pending deposits...");
        break;
      case "admin_users":
        if (user.role === "ADMIN") await sendTelegram(chatId, "Fetching all users...");
        break;
    }
    return;
  }

  // 4. Login Flow (Step-by-Step)
  
  // Step A: Handle Language Selection -> Ask Email
  if (data.startsWith("setlang_")) {
    const selectedLang = data.split("_")[1];
    userState[chatId] = { step: "waiting_for_email", lang: selectedLang };
    await sendTelegram(chatId, "📧 Please send your registered *Email Address*:");
    return;
  }

  // Step B: Handle Text Inputs (Email & Password)
  if (text && userState[chatId]) {
    const state = userState[chatId];

    // Email milne ke baad Password maango
    if (state.step === "waiting_for_email") {
      userState[chatId].email = text.trim().toLowerCase();
      userState[chatId].step = "waiting_for_password";
      await sendTelegram(chatId, "🔑 Correct! Now enter your *Password*:");
      return;
    }

    // Password milne par Verification karo
    if (state.step === "waiting_for_password") {
      const email = state.email!;
      const loginUser = await db.user.findUnique({ where: { email } });

      if (!loginUser) {
        await sendTelegram(chatId, "❌ User not found with this email. Type /start to retry.");
        delete userState[chatId];
        return;
      }

      // Bcrypt comparison
      const isValid = await bcrypt.compare(text.trim(), loginUser.password);

      if (isValid) {
        // Link Telegram ID to DB permanently
        const updatedUser = await db.user.update({
          where: { email },
          data: { telegramId: String(chatId) }
        });

        delete userState[chatId];
        await sendTelegram(chatId, "✅ Login Successful!");
        
        // Final check: redirect based on role
        return await showDashboard(chatId, updatedUser);
      } else {
        await sendTelegram(chatId, "❌ Incorrect Password. Please try /start again.");
        delete userState[chatId];
        return;
      }
    }
  }
}