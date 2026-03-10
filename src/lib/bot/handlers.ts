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

  // 1. Dashboard Redirects & Auth Menu
  if (text === "/start" || data === "show_dash") {
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

  // --- REGISTRATION & LOGIN FLOWS ---
  if (data === "auth_login") {
    (userState as any)[chatId] = { step: "waiting_for_email" };
    return await sendTelegram(chatId, "📧 Please enter your *Email*:");
  }

  if (data === "auth_register") {
    (userState as any)[chatId] = { step: "reg_name" };
    return await sendTelegram(chatId, "👤 Registration: Enter your *Full Name*:");
  }

  // --- INPUT HANDLING FOR AUTH ---
  if (text && userState[chatId]) {
    const state = userState[chatId] as any;

    // Login Steps
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

    // Registration Steps
    if (state.step === "reg_name") {
      state.regName = text.trim();
      state.step = "reg_email";
      return await sendTelegram(chatId, `Nice to meet you ${state.regName}! Now enter your *Email*:`);
    }
    if (state.step === "reg_email") {
      const email = text.trim().toLowerCase();
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) return await sendTelegram(chatId, "❌ This email already exists. Enter a different one:");
      state.regEmail = email;
      state.step = "reg_pass";
      return await sendTelegram(chatId, "🔐 Create a *Password* (min 6 characters):");
    }
    if (state.step === "reg_pass") {
      if (text.length < 6) return await sendTelegram(chatId, "⚠️ Password too short. Try again:");
      const hashedPassword = await bcrypt.hash(text.trim(), 10);
      const newUser = await db.user.create({
        data: {
          name: state.regName,
          email: state.regEmail,
          password: hashedPassword,
          telegramId: String(chatId),
          balance: 0,
          role: "USER"
        }
      });
      delete userState[chatId];
      return await showUserDashboard(chatId, newUser);
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

    // --- ADMIN ACTIONS ---
    if (user.role === "ADMIN") {
      if (data.startsWith("view_dep_")) return await viewPendingDeposit(chatId, data.replace("view_dep_", ""));

      if (data.startsWith("approve_dep_")) {
        const depId = data.replace("approve_dep_", "");
        try {
          const notificationData = await db.$transaction(async (tx) => {
            const dep = await tx.deposit.findUnique({ where: { id: depId }, include: { user: true } });
            if (!dep || dep.status !== "PENDING") throw new Error("Processed");

            await tx.deposit.update({ where: { id: depId }, data: { status: "APPROVED" } });

            const updatedUser = await tx.user.update({
              where: { id: dep.userId },
              data: { balance: { increment: dep.amount }, totalDeposit: { increment: dep.amount } }
            });

            return { telegramId: updatedUser.telegramId, depositedAmount: dep.amount, userName: updatedUser.name };
          });

          await sendTelegram(chatId, `✅ Approved! *${notificationData.depositedAmount} PKR* added to ${notificationData.userName}.`);
          if (notificationData.telegramId) {
            await sendTelegram(Number(notificationData.telegramId), `🎉 *Deposit Approved!*\n\nApka *${notificationData.depositedAmount} PKR* ka deposit verify ho gaya hy. ✨`);
          }
          return await showPendingDeposits(chatId);
        } catch (err) {
          return await sendTelegram(chatId, "❌ Error processing approval.");
        }
      }

      if (data.startsWith("reject_dep_")) {
        const depId = data.replace("reject_dep_", "");
        const dep = await db.deposit.update({ where: { id: depId }, data: { status: "REJECTED" }, include: { user: true } });
        await sendTelegram(chatId, "❌ Deposit Rejected.");
        if (dep.user.telegramId) {
            await sendTelegram(Number(dep.user.telegramId), `❌ *Deposit Rejected!*\n\nApka *${dep.amount} PKR* ka deposit reject kar diya gaya hy.`);
        }
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
        instruction = `💳 *USDT Address:*\n\`${settings?.adminWalletAddress}\``;
      }
      return await sendTelegram(chatId, `${instruction}\n\n💰 *Enter Amount to Deposit:*`);
    }

    if (text && (userState[chatId] as any)?.step === "waiting_for_dep_amount") {
      const state = userState[chatId] as any;
      state.amount = parseFloat(text);
      state.step = "waiting_for_dep_slip";
      return await sendTelegram(chatId, "📸 *Upload Screenshot / Payment Slip:*");
    }

    if (photo && (userState[chatId] as any)?.step === "waiting_for_dep_slip") {
      const state = userState[chatId] as any;
      try {
        await db.deposit.create({
          data: { userId: user.id, amount: state.amount, gateway: state.method.toUpperCase(), slipImage: photo[photo.length - 1].file_id, status: "PENDING" }
        });
        delete userState[chatId];
        return await sendTelegram(chatId, "✅ *Slip submitted!*\nVerification pending.");
      } catch (err) {
        return await sendTelegram(chatId, "❌ Database Error.");
      }
    }
  }
}