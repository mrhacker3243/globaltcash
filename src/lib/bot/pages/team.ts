import { sendTelegram } from "../utils";

export async function showTeamPage(chatId: number, user: any) {
  const teamMsg = `👥 *My Team Stats*\n\n` +
                  `Direct Referrals: ${user.referralCount || 0}\n` +
                  `Total Team Volume: ${user.totalDeposit || 0} PKR\n` +
                  `Current Rank: ${user.rankLevel || 'Starter'}`;

  const buttons = {
    inline_keyboard: [
      [{ text: "View Downline", callback_data: "page_downline" }],
      [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
    ]
  };

  await sendTelegram(chatId, teamMsg, buttons);
}