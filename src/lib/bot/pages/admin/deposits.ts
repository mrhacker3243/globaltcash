import { db } from "@/lib/db";
import { sendTelegram, sendTelegramPhoto } from "../../utils";

export async function showPendingDeposits(chatId: number) {
  const pendingDeposits = await db.deposit.findMany({
    where: { status: "PENDING" }, // Matches DepositStatus Enum
    include: { user: true },
    take: 10
  });

  if (pendingDeposits.length === 0) {
    return await sendTelegram(chatId, "📭 *No pending deposits found.*", {
      inline_keyboard: [[{ text: "🔙 Back to Admin", callback_data: "show_dash" }]]
    });
  }

  const buttons = {
    inline_keyboard: pendingDeposits.map((dep: any) => [
      { text: `💰 ${dep.amount} PKR - ${dep.user.name || 'User'}`, callback_data: `view_dep_${dep.id}` }
    ])
  };
  buttons.inline_keyboard.push([{ text: "🔙 Back to Admin", callback_data: "show_dash" }]);

  await sendTelegram(chatId, "📥 *Pending Deposits List:*", buttons);
}

export async function viewPendingDeposit(chatId: number, depositId: string) {
  const dep = await db.deposit.findUnique({
    where: { id: depositId },
    include: { user: true }
  });

  if (!dep) return await sendTelegram(chatId, "❌ Deposit not found.");

  const msg = `🧐 *Review Deposit*\n\n` +
              `👤 User: ${dep.user.name || 'N/A'}\n` +
              `💰 Amount: ${dep.amount} PKR\n` +
              `💳 Gateway: ${dep.gateway || 'N/A'}\n` +
              `📅 Date: ${dep.createdAt.toLocaleString()}`;

  const buttons = {
    inline_keyboard: [
      [
        { text: "✅ Approve", callback_data: `approve_dep_${dep.id}` },
        { text: "❌ Reject", callback_data: `reject_dep_${dep.id}` }
      ],
      [{ text: "🔙 Back to List", callback_data: "admin_page_deposits" }]
    ]
  };

  // Check if slipImage exists (Telegram File ID)
  if (dep.slipImage) {
    await sendTelegramPhoto(chatId, dep.slipImage, msg, buttons);
  } else {
    await sendTelegram(chatId, msg + "\n\n⚠️ No slip image found.", buttons);
  }
}