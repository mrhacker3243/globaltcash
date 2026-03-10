import { db } from "@/lib/db";
import { sendTelegram } from "./utils";
import { showUserDashboard } from "./pages/dashboard"; // User View
import { showAdminDashboard } from "./pages/admin_dashboard"; // Admin View
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

  // 1. Database Priority Check
  const user = await db.user.findUnique({ 
    where: { telegramId: String(chatId) } 
  });

  // 2. Start & Dashboard Redirect Logic
  if (text === "/start" || data === "show_dash") {
    if (user) {
      // Role-based separation
      if (user.role === "ADMIN") {
        return await showAdminDashboard(chatId, user);
      } else {
        return await showUserDashboard(chatId, user);
      }
    } else if (text === "/start") {
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
    // Admin personal choice: If admin wants to see user dashboard view
    if (data === "show_user_dash") return await showUserDashboard(chatId, user);

    switch (data) {
      // User Pages
      case "page_deposit": await showFinancePage(chatId, user, 'deposit'); break;
      case "page_withdraw": await showFinancePage(chatId, user, 'withdraw'); break;
      case "page_settings": await showSettingsPage(chatId, user); break;
      case "page_team": await showTeamPage(chatId, user); break;
      
      // Admin specific callback handlers
      case "admin_deposits":
        if (user.role === "ADMIN") await sendTelegram(chatId, "🔍 Fetching all pending deposits from database...");
        break;
      case "admin_users":
        if (user.role === "ADMIN") await sendTelegram(chatId, "👥 Loading user management system...");
        break;
      case "admin_stats":
        if (user.role === "ADMIN") await sendTelegram(chatId, "📊 Calculating platform total investment & volume...");
        break;
    }
    return;
  }

  // 4. Login Flow (Only for non-registered users)
  
  if (data.startsWith("setlang_")) {
    const selectedLang = data.split("_")[1];
    userState[chatId] = { step: "waiting_for_email", lang: selectedLang };
    await sendTelegram(chatId, "📧 Please send your registered *Email Address*:");
    return;
  }

  if (text && userState[chatId]) {
    const state = userState[chatId];

    if (state.step === "waiting_for_email") {
      userState[chatId].email = text.trim().toLowerCase();
      userState[chatId].step = "waiting_for_password";
      await sendTelegram(chatId, "🔑 Correct! Now enter your *Password*:");
      return;
    }

    if (state.step === "waiting_for_password") {
      const email = state.email!;
      const loginUser = await db.user.findUnique({ where: { email } });

      if (!loginUser) {
        await sendTelegram(chatId, "❌ User not found. Type /start to retry.");
        delete userState[chatId];
        return;
      }

      const isValid = await bcrypt.compare(text.trim(), loginUser.password);

      if (isValid) {
        const updatedUser = await db.user.update({
          where: { email },
          data: { telegramId: String(chatId) }
        });

        delete userState[chatId];
        await sendTelegram(chatId, "✅ Login Successful!");
        
        // Redirect based on role right after login
        if (updatedUser.role === "ADMIN") {
            return await showAdminDashboard(chatId, updatedUser);
        } else {
            return await showUserDashboard(chatId, updatedUser);
        }
      } else {
        await sendTelegram(chatId, "❌ Incorrect Password. Type /start to try again.");
        delete userState[chatId];
        return;
      }
    }
  }
}