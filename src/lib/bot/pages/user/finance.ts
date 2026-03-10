import { sendTelegram } from "../../utils";

export async function showFinancePage(chatId: number, user: any, type: 'deposit' | 'withdraw') {
  const msg = type === 'deposit' 
    ? "💳 *Deposit Section*\nPlease select your payment method:" 
    : "💸 *Withdraw Section*\nEnter the amount to withdraw:";
    
  await sendTelegram(chatId, msg, {
    inline_keyboard: [[{ text: "🔙 Back", callback_data: "show_dash" }]]
  });
}