import { db } from "@/lib/db";
import { sendTelegram } from "./utils";
import { userState } from "./states";
import bcrypt from "bcryptjs";

// Modular Paths
import { showUserDashboard } from "./pages/user/dashboard";
import { showFinancePage } from "./pages/user/finance";
import { showSettingsPage } from "./pages/user/settings";
import { showTeamPage } from "./pages/user/team";
import { showAdminDashboard } from "./pages/admin/dashboard";
import { showPendingDeposits, viewPendingDeposit } from "./pages/admin/deposits";

// New Modular Paths for Plans & Withdrawals
import { showPlans, initiatePlanBuy, processInvestment } from "./pages/user/plans";
import { showWithdrawPage, initiateWithdraw, processWithdrawRequest } from "./pages/user/withdrawals";

export async function handleUpdate(body: any) {
  const msg = body.message;
  const cb = body.callback_query;
  const chatId = msg ? msg.chat.id : cb?.message?.chat?.id;
  const text = msg?.text || "";
  const data = cb?.data || "";
  const photo = msg?.photo;

  if (!chatId) return;

  const user = await db.user.findUnique({ where: { telegramId: String(chatId) } });

  // 1. DASHBOARD & AUTH MENU
  if (text === "/start" || data === "show_dash" || data === "show_user_dash") {
    if (user) {
      return user.role === "ADMIN" ? await showAdminDashboard(chatId, user) : await showUserDashboard(chatId, user);
    } else {
      const authBtns = {
        inline_keyboard: [
          [{ text: "🔐 Login", callback_data: "auth_login" }, { text: "📝 Register", callback_data: "auth_register" }]
        ]
      };
      return await sendTelegram(chatId, "Welcome to *Global Trust Cash*! Please login or register to continue:", authBtns);
    }
  }

  // --- AUTH FLOWS (LOGIN & REGISTRATION) ---
  if (data === "auth_login") {
    (userState as any)[chatId] = { step: "waiting_for_email" };
    return await sendTelegram(chatId, "📧 Please enter your *Email*:");
  }

  if (data === "auth_register") {
    (userState as any)[chatId] = { step: "reg_name" };
    return await sendTelegram(chatId, "👤 Registration: Enter your *Full Name*:");
  }

  // --- INPUT HANDLING FOR AUTH ---
  if (text && userState[chatId] && !user) {
    const state = userState[chatId] as any;

    if (state.step === "waiting_for_email") {
      state.email = text.trim().toLowerCase();
      state.step = "waiting_for_password";
      return await sendTelegram(chatId, "🔑 Enter your *Password*:");
    }
    if (state.step === "waiting_for_password") {
      const loginUser = await db.user.findUnique({ where: { email: state.email } });
      if (loginUser && await bcrypt.compare(text.trim(), loginUser.password)) {
        await db.user.update({ where: { id: loginUser.id }, data: { telegramId: String(chatId) } });
        delete userState[chatId];
        return await showUserDashboard(chatId, loginUser);
      }
      return await sendTelegram(chatId, "❌ Invalid credentials. Try /start again.");
    }

    if (state.step === "reg_name") {
      state.regName = text.trim();
      state.step = "reg_email";
      return await sendTelegram(chatId, `Nice to meet you ${state.regName}! Now enter your *Email*:`);
    }
    if (state.step === "reg_email") {
      const email = text.trim().toLowerCase();
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) return await sendTelegram(chatId, "❌ Email already exists. Use another:");
      state.regEmail = email;
      state.step = "reg_pass";
      return await sendTelegram(chatId, "🔐 Create a *Password* (min 6 characters):");
    }
    if (state.step === "reg_pass") {
      if (text.length < 6) return await sendTelegram(chatId, "⚠️ Password too short.");
      const hashedPassword = await bcrypt.hash(text.trim(), 10);
      const newUser = await db.user.create({
        data: { name: state.regName, email: state.regEmail, password: hashedPassword, telegramId: String(chatId), balance: 0, role: "USER" }
      });
      delete userState[chatId];
      return await showUserDashboard(chatId, newUser);
    }
  }

  // --- LOGGED IN USER ACTIONS ---
  if (user) {
    // Switch for Page Navigation
    switch (data) {
      case "page_deposit": return await showFinancePage(chatId, user, 'deposit');
      case "page_withdraw": return await showWithdrawPage(chatId, user);
      case "page_plans": return await showPlans(chatId, user);
      case "page_settings": return await showSettingsPage(chatId, user);
      case "page_team": return await showTeamPage(chatId, user);
      case "admin_page_deposits": if (user.role === "ADMIN") return await showPendingDeposits(chatId); break;
    }

    // Callback Data Handling
    if (data.startsWith("buy_plan_")) return await initiatePlanBuy(chatId, user, data.replace("buy_plan_", ""));
    if (data.startsWith("wit_meth_")) return await initiateWithdraw(chatId, user, data.replace("wit_meth_", ""));

    // Admin Actions (Deposit Approval/Rejection)
    if (user.role === "ADMIN") {
      if (data.startsWith("view_dep_")) return await viewPendingDeposit(chatId, data.replace("view_dep_", ""));
      if (data.startsWith("approve_dep_")) {
        // ... Admin deposit approval logic (jaise pehle tha)
      }
    }

    // User Deposit Method Selection
    if (data.startsWith("dep_meth_")) {
      const method = data.split("_")[2];
      (userState as any)[chatId] = { step: "waiting_for_dep_amount", method };
      const settings = await db.systemSetting.findUnique({ where: { id: "global" } });
      let instruction = method === "usdt" ? `💳 *USDT Address:*\n\`${settings?.adminWalletAddress}\`` : `🏦 *Details:*\nNumber: \`${method === 'easypaisa' ? settings?.easyPaisaNumber : settings?.jazzCashNumber}\``;
      return await sendTelegram(chatId, `${instruction}\n\n💰 *Enter Amount:*`);
    }

    // --- SHARED INPUT HANDLING (TEXT) ---
    if (text && userState[chatId]) {
      const state = userState[chatId] as any;
      
      // Plans Investment
      if (state.step === "waiting_for_invest_amount") return await processInvestment(chatId, user, parseFloat(text));
      
      // Withdrawal Process
      if (state.step.startsWith("waiting_for_wit_")) return await processWithdrawRequest(chatId, user, text);
      
      // Deposit Process
      if (state.step === "waiting_for_dep_amount") {
        state.amount = parseFloat(text);
        state.step = "waiting_for_dep_slip";
        return await sendTelegram(chatId, "📸 *Upload Payment Slip:*");
      }
    }

    // Photo Handling (Deposit Slip)
    if (photo && (userState[chatId] as any)?.step === "waiting_for_dep_slip") {
      const state = userState[chatId] as any;
      await db.deposit.create({
        data: { userId: user.id, amount: state.amount, gateway: state.method.toUpperCase(), slipImage: photo[photo.length - 1].file_id, status: "PENDING" }
      });
      delete userState[chatId];
      return await sendTelegram(chatId, "✅ *Slip submitted!* Verification pending.");
    }
  }
}