import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";

export async function showTeamPage(chatId: number, user: any) {
  const referrals = await db.user.count({ where: { referrerId: user.id } });
  const msg = `👥 *My Team*\n\n` +
              `📢 Total Referrals: *${referrals}*\n` +
              `🔗 Link: \`https://t.me/GlobalTrustCashBot?start=${user.id}\`\n\n` +
              `Forward this link to invite friends!`;

  await sendTelegram(chatId, msg, { inline_keyboard: [[{ text: "🔙 Back", callback_data: "show_dash" }]] });
}