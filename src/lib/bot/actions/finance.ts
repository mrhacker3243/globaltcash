import { db } from "@/lib/db";
import { sendTelegram } from "../utils";
import { userState } from "../states";
import { showMethodDetails } from "../pages/user/finance";
import { initiatePlanBuy } from "../pages/user/plans";
import { initiateWithdraw } from "../pages/user/withdrawals";

export async function handleFinanceActions(chatId: any, user: any, data: string) {

  const numChatId = Number(chatId);

  if (data.startsWith("buy_plan_")) {
    return await initiatePlanBuy(numChatId, user, data.replace("buy_plan_", ""));
  }

  if (data.startsWith("wit_meth_")) {
    return await initiateWithdraw(numChatId, user, data.replace("wit_meth_", ""));
  }

  if (data.startsWith("dep_meth_")) {

    const method = data.split("_")[2];

    userState[chatId] = {
      step: "waiting_for_dep_amount",
      method: method
    };

    return await showMethodDetails(numChatId, method);
  }

  return null;
}

export async function processDepositSlip(chatId: any, user: any, photoId: string) {

  const state = userState[chatId];
  const numChatId = Number(chatId);

  if (!state || !state.amount || !state.method) {
    return await sendTelegram(
      numChatId,
      "⚠️ *Session Expired*\n\nDeposit dobara start karein."
    );
  }

  try {

    await db.deposit.create({
      data: {
        userId: user.id,
        amount: Number(state.amount),
        gateway: state.method,
        slipImage: photoId,
        planName: "Manual Deposit",
        status: "PENDING"
      }
    });

    delete userState[chatId];

    return await sendTelegram(
      numChatId,
      `✅ *Deposit Request Received!*\n\n` +
      `💰 Amount: Rs ${state.amount}\n` +
      `🏦 Method: ${state.method}\n\n` +
      `Admin verify karke approve karega.`
    );

  } catch (error: any) {

    console.error("DEPOSIT ERROR:", error);

    return await sendTelegram(
      numChatId,
      `❌ Database Error\n\n${error.message}`
    );
  }
}