import { sendTelegram } from "../utils";
import { translations } from "../translations";

export async function showFinancePage(chatId: number, user: any, type: 'deposit' | 'withdraw') {
  const t = translations[user.lang || 'en'];
  
  let message = "";
  let buttons: any = [];

  if (type === 'deposit') {
    message = `💳 *Deposit Funds*\n\nSelect your payment method:`;
    buttons = {
      inline_keyboard: [
        [{ text: "JazzCash", callback_data: "pay_jazzcash" }, { text: "EasyPaisa", callback_data: "pay_easypaisa" }],
        [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
      ]
    };
  } else {
    message = `💸 *Withdraw Funds*\n\nYour Balance: ${user.balance} PKR\nMin Withdraw: 500 PKR`;
    buttons = {
      inline_keyboard: [
        [{ text: "Request Withdrawal", callback_data: "req_withdraw" }],
        [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
      ]
    };
  }

  await sendTelegram(chatId, message, buttons);
}