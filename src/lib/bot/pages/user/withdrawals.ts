import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";
import { userState } from "../../states";

export async function showWithdrawPage(chatId: number, user: any) {
  const msg = `📥 *Withdraw Funds*\n💰 Balance: *${user.balance.toFixed(2)} PKR*\n\nSelect method:`;
  const buttons = {
    inline_keyboard: [
      [{ text: "🏦 EasyPaisa", callback_data: "wit_meth_easypaisa" }, { text: "🏦 JazzCash", callback_data: "wit_meth_jazzcash" }],
      [{ text: "🔙 Back", callback_data: "show_dash" }]
    ]
  };
  await sendTelegram(chatId, msg, buttons);
}

export async function initiateWithdraw(chatId: number, user: any, method: string) {
  (userState as any)[chatId] = { step: "waiting_for_wit_amount", method };
  await sendTelegram(chatId, `🏦 *Withdraw via ${method.toUpperCase()}*\nEnter amount (Min 500):`);
}

export async function processWithdrawRequest(chatId: number, user: any, text: string) {
  const state = (userState as any)[chatId];

  if (state.step === "waiting_for_wit_amount") {
    const amount = parseFloat(text);
    if (isNaN(amount) || amount < 500 || amount > user.balance) {
      return await sendTelegram(chatId, "⚠️ Invalid amount or insufficient balance.");
    }
    state.amount = amount;
    state.step = "waiting_for_wit_address";
    return await sendTelegram(chatId, `✅ Amount: ${amount} PKR\n\nNow enter your *${state.method.toUpperCase()}* Account Number and Name:`);
  }

  if (state.step === "waiting_for_wit_address") {
    // Exact schema match: only amount, address, userId, status
    await db.withdrawal.create({ 
      data: { 
        userId: user.id, 
        amount: state.amount, 
        // Method info ko address string ke andar concat kar diya hy
        address: `${state.method.toUpperCase()} - ${text}`, 
        status: "PENDING" 
      } 
    });

    delete (userState as any)[chatId];
    await sendTelegram(chatId, "✅ *Withdrawal Request Sent!* Admin will process it soon.");
  }
}