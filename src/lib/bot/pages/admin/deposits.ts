import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";

export async function showPendingDeposits(chatId: number) {
  // 1. Database se Pending Deposits uthao
  const pendingDeposits = await db.deposit.findMany({
    where: { status: "PENDING" },
    include: { user: true }, // User ki details bhi sath mil jayengi
    take: 10 // Ek waqt mein sirf 10 dikhao
  });

  if (pendingDeposits.length === 0) {
    return await sendTelegram(chatId, "📭 *No pending deposits found.*", {
      inline_keyboard: [[{ text: "🔙 Back to Admin", callback_data: "show_dash" }]]
    });
  }

  let msg = `📥 *Pending Deposits List*\n\n`;

  const buttons = {
    inline_keyboard: pendingDeposits.map((dep) => [
      { 
        text: `💰 ${dep.amount} PKR - ${dep.user.name}`, 
        callback_data: `view_dep_${dep.id}` 
      }
    ])
  };

  // Back button add karein
  buttons.inline_keyboard.push([{ text: "🔙 Back to Admin", callback_data: "show_dash" }]);

  await sendTelegram(chatId, msg, buttons);
}