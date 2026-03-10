import { sendTelegram } from "../utils";
import { translations } from "../translations";

export async function showDashboard(chatId: number, user: any) {
  const t = translations[user.lang || 'en'];
  const refLink = `https://globaltcash.up.railway.app/register?ref=${user.id}`;
  
  const welcomeMsg = `👋 *${t.welcome_back} ${user.name || 'User'}!*\n\n` +
                     `💰 *Balance:* ${user.balance || 0} PKR\n` +
                     `👥 *Referrals:* ${user.referralCount || 0}\n` +
                     `🏆 *Rank:* ${user.rankLevel || 'Starter'}\n\n` +
                     `📢 *Your Referral Link (Click to Copy):*\n\`${refLink}\``;

  const buttons = {
    inline_keyboard: [
      [{ text: "💳 Deposit", callback_data: "page_deposit" }, { text: "💸 Withdraw", callback_data: "page_withdraw" }],
      [{ text: "📊 Team", callback_data: "page_team" }, { text: "⚙️ Settings", callback_data: "page_settings" }],
      [{ text: "🌐 Visit Site", url: "https://globaltcash.up.railway.app/" }]
    ]
  };

  await sendTelegram(chatId, welcomeMsg, buttons);
}