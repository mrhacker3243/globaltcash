import { db } from "@/lib/db";
import { sendTelegram } from "./utils";
import { userState } from "./states";
import bcrypt from "bcryptjs";

// Modular Paths
import { showUserDashboard } from "./pages/user/dashboard";
import { showFinancePage, showMethodDetails } from "./pages/user/finance";
import { showSettingsPage } from "./pages/user/settings";
import { showTeamPage } from "./pages/user/team";
import { showAdminDashboard } from "./pages/admin/dashboard";
// Added handleDepositApproval import here
import { showPendingDeposits, viewPendingDeposit, handleDepositApproval } from "./pages/admin/deposits";

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

  // 1. START COMMAND & REFERRAL CAPTURE
  if (text.startsWith("/start") || data === "show_dash" || data === "show_user_dash") {
    const startPayload = text.split(" ")[1];

    if (user) {
      return user.role === "ADMIN" ? await showAdminDashboard(chatId, user) : await showUserDashboard(chatId, user);
    } else {
      (userState as any)[chatId] = { referrerId: startPayload || null };
      const authBtns = {
        inline_keyboard: [
          [{ text: "🔐 Login", callback_data: "auth_login" }, { text: "📝 Register", callback_data: "auth_register" }]
        ]
      };
      return await sendTelegram(chatId, "Welcome to *Global Trust Cash*! Please login or register to continue:", authBtns);
    }
  }

  // --- AUTH FLOWS ---
  if (data === "auth_login") {
    (userState as any)[chatId] = { step: "waiting_for_email" };
    return await sendTelegram(chatId, "📧 Please enter your *Email*:");
  }

  if (data === "auth_register") {
    const currentState = (userState as any)[chatId] || {};
    (userState as any)[chatId] = { ...currentState, step: "reg_name" };
    return await sendTelegram(chatId, "👤 Registration: Enter your *Full Name*:");
  }

  if (data === "auth_logout") {
    delete (userState as any)[chatId];
    if (user) await db.user.update({ where: { id: user.id }, data: { telegramId: null } });
    return await sendTelegram(chatId, "🔴 Logged out! Use /start to login again.");
  }

  // --- INPUT HANDLING FOR AUTH (Non-logged in users) ---
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
      return await sendTelegram(chatId, "❌ Invalid credentials.");
    }
  }

  // --- LOGGED IN USER ACTIONS ---
  if (user) {
    // Buttons Handling
    if (data) {
        // Shared & User Pages
        switch (data) {
            case "page_deposit": return await showFinancePage(chatId, user, 'deposit');
            case "page_withdraw": return await showWithdrawPage(chatId, user);
            case "page_plans": return await showPlans(chatId, user);
            case "page_settings": return await showSettingsPage(chatId, user);
            case "page_team": return await showTeamPage(chatId, user);
            // ADMIN DASHBOARD BUTTONS
            case "admin_pending_deposits": return await showPendingDeposits(chatId);
        }

        if (data.startsWith("buy_plan_")) return await initiatePlanBuy(chatId, user, data.replace("buy_plan_", ""));
        if (data.startsWith("wit_meth_")) return await initiateWithdraw(chatId, user, data.replace("wit_meth_", ""));
        
        if (data.startsWith("dep_meth_")) {
            const method = data.split("_")[2];
            (userState as any)[chatId] = { step: "waiting_for_dep_amount", method };
            return await showMethodDetails(chatId, method);
        }

        // --- ADMIN SPECIFIC CALLBACKS ---
        if (user.role === "ADMIN") {
            if (data.startsWith("view_dep_")) return await viewPendingDeposit(chatId, data.replace("view_dep_", ""));
            if (data.startsWith("approve_dep_")) return await handleDepositApproval(chatId, data.replace("approve_dep_", ""), "APPROVED");
            if (data.startsWith("reject_dep_")) return await handleDepositApproval(chatId, data.replace("reject_dep_", ""), "REJECTED");
        }
    }

    // Text Input Handling
    if (text && userState[chatId]) {
      const state = userState[chatId] as any;
      
      if (state.step === "waiting_for_dep_amount") {
        const amount = parseFloat(text);
        if (isNaN(amount) || amount <= 0) return await sendTelegram(chatId, "⚠️ Enter a valid amount.");
        state.amount = amount;
        state.step = "waiting_for_dep_slip";
        return await sendTelegram(chatId, "📸 *Upload Payment Slip (Screenshot):*");
      }

      if (state.step === "waiting_for_invest_amount") {
        return await processInvestment(chatId, user, parseFloat(text));
      }

      if (state.step?.startsWith("waiting_for_wit_")) {
        return await processWithdrawRequest(chatId, user, text);
      }
    }

    // Photo Handling
    if (photo && (userState[chatId] as any)?.step === "waiting_for_dep_slip") {
      const state = userState[chatId] as any;
      await db.deposit.create({
        data: { 
          userId: user.id, 
          amount: state.amount, 
          gateway: state.method?.toUpperCase() || "UNKNOWN", 
          slipImage: photo[photo.length - 1].file_id, 
          status: "PENDING" 
        }
      });
      delete userState[chatId];
      return await sendTelegram(chatId, "✅ *Slip submitted!* Admin will verify it soon.");
    }
  }
}