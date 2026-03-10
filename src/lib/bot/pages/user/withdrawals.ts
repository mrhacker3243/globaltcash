import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";
import { userState } from "../../states";
import { Status } from "@prisma/client"; // Aapke schema ka Enum

// 1. Withdraw Main Page
export async function showWithdrawPage(chatId: number, user: any) {
  // Database mein field na hone ki wajah se humne yahan manually 500 set kiya hy
  const minWit = 500; 

  const msg = `💳 *Withdrawal*\n\n` +
              `💰 Available Balance: *${user.balance} PKR*\n` +
              `📥 Minimum Limit: *${minWit} PKR*\n\n` +
              `Select payment method:`;

  const buttons = {
    inline_keyboard: [
      [
        { text: "📱 EasyPaisa", callback_data: "wit_meth_easypaisa" },
        { text: "📱 JazzCash", callback_data: "wit_meth_jazzcash" }
      ],
      [{ text: "🔙 Back", callback_data: "show_dash" }]
    ]
  };

  await sendTelegram(chatId, msg, buttons);
}

// 2. Method select hone ke baad amount mangna
export async function initiateWithdraw(chatId: number, user: any, method: string) {
  const minWit = 500; // Manual limit
  
  if (user.balance < minWit) {
    return await sendTelegram(chatId, `❌ Your balance is less than the minimum withdraw limit of ${minWit} PKR.`);
  }

  (userState as any)[chatId] = { step: "waiting_for_wit_amount", method };
  await sendTelegram(chatId, `💰 *Enter amount to withdraw:*`);
}

// 3. Amount aur details handle karna
export async function processWithdrawRequest(chatId: number, user: any, text: string) {
  const state = (userState as any)[chatId];
  
  if (state.step === "waiting_for_wit_amount") {
    const amount = parseFloat(text);
    if (isNaN(amount) || amount > user.balance || amount <= 0) {
      return await sendTelegram(chatId, "⚠️ Invalid amount. Enter within your balance:");
    }
    state.amount = amount;
    state.step = "waiting_for_wit_details";
    return await sendTelegram(chatId, `📝 Enter your *${state.method}* Account No & Title:`);
  }

  if (state.step === "waiting_for_wit_details") {
    try {
      await db.$transaction(async (tx) => {
        // Balance deduct karna
        await tx.user.update({
          where: { id: user.id },
          data: { balance: { decrement: state.amount } }
        });

        // Withdrawal record banana (Aapke schema ke mutabiq fields)
        await tx.withdrawal.create({
          data: {
            userId: user.id,
            amount: state.amount,
            address: text, // Aapke schema mein 'address' field hy details ke liye
            status: Status.PENDING
          }
        });
      });

      delete userState[chatId];
      await sendTelegram(chatId, "✅ *Withdraw Request Sent!*\nAdmin will process it soon.");
      
    } catch (err) {
      console.error(err);
      await sendTelegram(chatId, "❌ Database error during withdrawal.");
    }
  }
}