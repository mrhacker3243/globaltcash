import { sendTelegram } from "../../utils";

export async function showTeamPage(chatId: number, user: any) {
  const msg = `👥 *Your Team*\n\nTotal Referrals: ${user.referralCount || 0}\nActive Referrals: 0`;
  
  await sendTelegram(chatId, msg, {
    inline_keyboard: [[{ text: "🔙 Back", callback_data: "show_dash" }]]
  });
}