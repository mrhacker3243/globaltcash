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

export async function handleUpdate(body: any) {
  const msg = body.message;
  const cb = body.callback_query;
  const chatId = msg ? msg.chat.id : cb?.message?.chat?.id;
  const text = msg?.text || "";
  const data = cb?.data || "";
  const photo = msg?.photo;

  if (!chatId) return;

  const user = await db.user.findUnique({ where: { telegramId: String(chatId) } });

  // 1. Dashboard Redirects
  if (text === "/start" || data === "show_dash") {
    if (user) {
      return user.role === "ADMIN" ? await showAdminDashboard(chatId, user) : await showUserDashboard(chatId, user);
    } else if (text === "/start") {
      const langBtns = {
        inline_keyboard: [[{ text: "English 🇺🇸", callback_data: "setlang_en" }, { text: "اردو 🇵🇰", callback_data: "setlang_ur" }]]
      };
      return await sendTelegram(chatId, "Welcome to GTC! Select language to Login:", langBtns);
    }
  }

  if (user) {
    if (data === "show_user_dash") return await showUserDashboard(chatId, user);

    switch (data) {
      case "page_deposit": return await showFinancePage(chatId, user, 'deposit');
      case "page_withdraw": return await showFinancePage(chatId, user, 'withdraw');
      case "page_settings": return await showSettingsPage(chatId, user);
      case "page_team": return await showTeamPage(chatId, user);
      case "admin_page_deposits": if (user.role === "ADMIN") return await showPendingDeposits(chatId); break;
    }

    // --- ADMIN ACTIONS (FIXED FOR ENUMS & BALANCE) ---
    if (user.role === "ADMIN") {
      if (data.startsWith("view_dep_")) return await viewPendingDeposit(chatId, data.replace("view_dep_", ""));

      if (data.startsWith("approve_dep_")) {
        const depId = data.replace("approve_dep_", "");
        try {
          const result = await db.$transaction(async (tx) => {
            const dep = await tx.deposit.findUnique({ where: { id: depId }, include: { user: true } });
            if (!dep || dep.status !== "PENDING") throw new Error("Processed");

            // Update status to APPROVED (from your DepositStatus enum)
            await tx.deposit.update({ 
              where: { id: depId }, 
              data: { status: "APPROVED" } 
            });

            // Update User Balance & Total Deposit
            return await tx.user.update({
              where: { id: dep.userId },
              data: { 
                balance: { increment: dep.amount },
                totalDeposit: { increment: dep.amount }
              }
            });
          });

          await sendTelegram(chatId, `✅ Approved! Balance added to ${result.name}.`);
          if (result.telegramId) {
            await sendTelegram(Number(result.telegramId), `🎉 Your deposit of *${result.balance} PKR* has been *Approved*!`);
          }
          return await showPendingDeposits(chatId);
        } catch (err) {
          return await sendTelegram(chatId, "❌ Already processed or error occurred.");
        }
      }

      if (data.startsWith("reject_dep_")) {
        const depId = data.replace("reject_dep_", "");
        await db.deposit.update({ where: { id: depId }, data: { status: "REJECTED" } });
        await sendTelegram(chatId, "❌ Deposit Rejected.");
        return await showPendingDeposits(chatId);
      }
    }

    // --- USER DEPOSIT FLOW ---
    if (data.startsWith("dep_meth_")) {
      const method = data.split("_")[2];
      (userState as any)[chatId] = { step: "waiting_for_dep_amount", method };

      const settings = await db.systemSetting.findUnique({ where: { id: "global" } });

      let instruction = "";
      if (method === "easypaisa") {
        instruction = `🏦 *EasyPaisa Details:*\nNumber: \`${settings?.easyPaisaNumber}\`\nName: *${settings?.easyPaisaName}*`;
      } else if (method === "jazzcash") {
        instruction = `🏦 *JazzCash Details:*\nNumber: \`${settings?.jazzCashNumber}\`\nName: *${settings?.jazzCashName}*`;
      } else if (method === "usdt") {
        instruction = `💳 *USDT (TRC20) Address:*\n\`${settings?.adminWalletAddress}\`\nNetwork: *TRON (TRC20)*`;
      }

      return await sendTelegram(chatId, `${instruction}\n\n💰 *Enter Amount to Deposit:*`);
    }

    // --- INPUT HANDLING ---
    if (text && userState[chatId]) {
      const state = userState[chatId] as any;
      if (state.step === "waiting_for_dep_amount") {
        state.amount = parseFloat(text);
        state.step = "waiting_for_dep_slip";
        return await sendTelegram(chatId, "📸 *Upload Screenshot / Payment Slip:*");
      }
    }

    // --- PHOTO UPLOAD ---
    if (photo && (userState[chatId] as any)?.step === "waiting_for_dep_slip") {
      const state = userState[chatId] as any;
      try {
        await db.deposit.create({
          data: {
            userId: user.id,
            amount: state.amount,
            gateway: state.method.toUpperCase(),
            slipImage: photo[photo.length - 1].file_id, // Match schema 'slipImage'
            status: "PENDING",
          }
        });
        delete userState[chatId];
        return await sendTelegram(chatId, "✅ *Slip submitted!*\nVerification pending.");
      } catch (err) {
        return await sendTelegram(chatId, "❌ Database Error.");
      }
    }
  }

  // --- LOGIN FLOW ---
  if (data.startsWith("setlang_")) {
    (userState as any)[chatId] = { step: "waiting_for_email", lang: data.split("_")[1] };
    return await sendTelegram(chatId, "📧 Send Email:");
  }

  if (text && userState[chatId]) {
    const state = userState[chatId] as any;
    if (state.step === "waiting_for_email") {
      state.email = text.trim().toLowerCase();
      state.step = "waiting_for_password";
      return await sendTelegram(chatId, "🔑 Enter Password:");
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
}