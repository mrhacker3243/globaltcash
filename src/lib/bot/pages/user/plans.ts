import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";
import { userState } from "../../states";
import { DepositStatus } from "@prisma/client"; // Enum import kiya hy

// 1. Saare Plans dikhane ke liye
export async function showPlans(chatId: number, user: any) {
  const plans = await db.plan.findMany({ 
    where: { active: true } 
  });

  if (plans.length === 0) {
    return await sendTelegram(chatId, "🚫 *No active plans available right now.*");
  }

  const balanceMsg = `🏦 *Investment Plans*\n\n` +
                     `💰 Your Balance: *${user.balance} PKR*\n` +
                     `✨ Select a plan to start earning:`;

  const planButtons = {
    inline_keyboard: plans.map((plan: any) => [
      { text: `📈 ${plan.name} (${plan.minAmount}-${plan.maxAmount} PKR)`, callback_data: `buy_plan_${plan.id}` }
    ])
  };
  planButtons.inline_keyboard.push([{ text: "🔙 Back", callback_data: "show_dash" }]);

  await sendTelegram(chatId, balanceMsg, planButtons);
}

// 2. Plan select hone par amount mangna
export async function initiatePlanBuy(chatId: number, user: any, planId: string) {
  const plan = await db.plan.findUnique({ where: { id: planId } });
  if (!plan) return await sendTelegram(chatId, "❌ Plan not found.");

  (userState as any)[chatId] = { 
    step: "waiting_for_invest_amount", 
    planId: plan.id, 
    planName: plan.name,
    roi: plan.roi,
    min: plan.minAmount, 
    max: plan.maxAmount 
  };

  const msg = `📊 *Selected Plan:* ${plan.name}\n` +
              `💰 *Your Balance:* ${user.balance} PKR\n` +
              `📥 *Limit:* ${plan.minAmount} - ${plan.maxAmount} PKR\n\n` +
              `⌨️ *Investment amount enter karen:*`;

  await sendTelegram(chatId, msg, {
    inline_keyboard: [[{ text: "❌ Cancel", callback_data: "page_plans" }]]
  });
}

// 3. Final Process: Deposit table mein entry create karna
export async function processInvestment(chatId: number, user: any, amount: number) {
  const state = (userState as any)[chatId];

  if (isNaN(amount) || amount < state.min || amount > state.max) {
    return await sendTelegram(chatId, `⚠️ Invalid! Enter amount between ${state.min} and ${state.max} PKR:`);
  }

  if (amount > user.balance) {
    return await sendTelegram(chatId, `❌ *Insufficient Balance!*`, {
      inline_keyboard: [[{ text: "💳 Deposit Now", callback_data: "page_deposit" }]]
    });
  }

  try {
    await db.$transaction(async (tx) => {
      // 1. User balance kam karna
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } }
      });

      // 2. Deposit table mein investment record save karna (Aapke schema ke mutabiq)
      await tx.deposit.create({
        data: {
          userId: user.id,
          amount: amount,
          roi: state.roi,
          planName: state.planName,
          gateway: "Internal Wallet",
          status: DepositStatus.ACTIVE, // Yahan 'ACTIVE' enum use ho raha hy
        }
      });
    });

    delete userState[chatId];
    await sendTelegram(chatId, `🎉 *Investment Successful!*\n\nPlan: *${state.planName}*\nAmount: *${amount} PKR*\n\nApka profit start ho chuka hy!`, {
      inline_keyboard: [[{ text: "📊 View Dashboard", callback_data: "show_dash" }]]
    });
  } catch (err) {
    console.error(err);
    await sendTelegram(chatId, "❌ System Error: Investment process nahi ho saki.");
  }
}