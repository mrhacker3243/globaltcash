import { db } from "@/lib/db";
import { sendTelegram } from "./utils";
import { userState } from "./states";
import bcrypt from "bcryptjs";

// Naye Modular Paths (User folder)
import { showUserDashboard } from "./pages/user/dashboard";
import { showFinancePage } from "./pages/user/finance";
import { showSettingsPage } from "./pages/user/settings";
import { showTeamPage } from "./pages/user/team";

// Naye Modular Paths (Admin folder)
import { showAdminDashboard } from "./pages/admin/dashboard";
import { showPendingDeposits } from "./pages/admin/deposits"; // <--- Add this

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
    if (data === "show_user_dash") return await showUserDashboard(chatId, user);

    switch (data) {
      // User Pages
      case "page_deposit": await showFinancePage(chatId, user, 'deposit'); break;
      case "page_withdraw": await showFinancePage(chatId, user, 'withdraw'); break;
      case "page_settings": await showSettingsPage(chatId, user); break;
      case "page_team": await showTeamPage(chatId, user); break;
      
      // Admin specific callback handlers
      case "admin_page_deposits":
        if (user.role === "ADMIN") {
          return await showPendingDeposits(chatId); // <--- Ab ye functional hai
        }
        break;
      case "admin_page_users":
        if (user.role === "ADMIN") await sendTelegram(chatId, "👥 Loading user management...");
        break;
    }
    return;
  }

  // 4. Login Flow (Same as before)
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
        return updatedUser.role === "ADMIN" 
          ? await showAdminDashboard(chatId, updatedUser) 
          : await showUserDashboard(chatId, updatedUser);
      } else {
        await sendTelegram(chatId, "❌ Incorrect Password. Type /start to try again.");
        delete userState[chatId];
        return;
      }
    }
  }
}