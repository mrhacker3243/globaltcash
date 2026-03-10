import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";
import { userState } from "../../states";

export async function showPlans(chatId: number, user: any) {
  const plans = await db.plan.findMany({ where: { active: true } });
  if (plans.length === 0) return await sendTelegram(chatId, "🚫 *No active plans.*");

  const buttons = plans.map((plan) => [
    { text: `📈 ${plan.name} (${plan.minAmount}-${plan.maxAmount} PKR)`, callback_data: `buy_plan_${plan.id}` }
  ]);
  buttons.push([{ text: "🔙 Back", callback_data: "show_dash" }]);

  await sendTelegram(chatId, "🏦 *Select an Investment Plan:*", { inline_keyboard: buttons });
}

export async function initiatePlanBuy(chatId: number, user: any, planId: string) {
  const plan = await db.plan.findUnique({ where: { id: planId } });
  if (!plan) return await sendTelegram(chatId, "❌ Plan not found.");

  // Fixed: dailyRoi ko roi se replace kiya
  (userState as any)[chatId] = { 
    step: "waiting_for_invest_amount", 
    planId: plan.id, 
    min: plan.minAmount, 
    max: plan.maxAmount, 
    roi: plan.roi, 
    planName: plan.name 
  };

  await sendTelegram(chatId, `💰 *Invest in ${plan.name}*\nDaily Profit: *${plan.roi}%*\nMin: *${plan.minAmount} PKR*\n\n👉 Enter investment amount (PKR):`);
}

export async function processInvestment(chatId: number, user: any, amount: number) {
  const state = (userState as any)[chatId];
  
  if (isNaN(amount) || amount < state.min || amount > state.max) {
    return await sendTelegram(chatId, `⚠️ Invalid amount. Min: ${state.min}, Max: ${state.max}`);
  }
  
  if (user.balance < amount) return await sendTelegram(chatId, "❌ Insufficient balance. Please deposit first.");

  try {
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { balance: { decrement: amount } } }),
      db.deposit.create({
        data: { 
          userId: user.id, 
          amount, 
          roi: state.roi, 
          planName: state.planName, 
          gateway: "Wallet", 
          status: "ACTIVE" 
        }
      })
    ]);

    delete (userState as any)[chatId];
    await sendTelegram(chatId, "🎉 *Investment Successful!*\nYour daily profit has been activated.", { 
      inline_keyboard: [[{ text: "📊 Dashboard", callback_data: "show_dash" }]] 
    });
  } catch (error) {
    await sendTelegram(chatId, "❌ Transaction failed. Please try again.");
  }
}