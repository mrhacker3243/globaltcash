import { sendTelegram } from "../../utils";

export async function showFinancePage(chatId: number, user: any, type: 'deposit' | 'withdraw') {
  if (type === 'deposit') {
    const msg = `💳 *Deposit Funds*\n\n` +
                `💰 *Balance:* ${user.balance || 0} PKR\n\n` +
                `1. Select your payment method.\n` +
                `2. Send the amount to the provided account.\n` +
                `3. Upload the screenshot/slip for verification.`;

    const buttons = {
      inline_keyboard: [
        [{ text: "📱 EasyPaisa", callback_data: "dep_meth_easypaisa" }, { text: "📲 JazzCash", callback_data: "dep_meth_jazzcash" }],
        [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
      ]
    };
    return await sendTelegram(chatId, msg, buttons);
  }

  // --- Withdraw Logic Updated ---
  if (type === 'withdraw') {
    const msg = `💸 *Withdraw Funds*\n\n` +
                `💰 *Available Balance:* ${user.balance || 0} PKR\n` +
                `⚠️ *Min Withdraw:* 500 PKR\n\n` +
                `Click the button below to start your withdrawal request:`;

    const buttons = {
      inline_keyboard: [
        [{ text: "🚀 Start Withdrawal", callback_data: "start_withdraw_process" }],
        [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
      ]
    };
    return await sendTelegram(chatId, msg, buttons);
  }
}