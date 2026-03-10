import { sendTelegram } from "../utils";
import { translations } from "../translations";

export async function showDashboard(chatId: number, user: any) {
  const t = translations[user.lang || 'en'];
  const refLink = `https://globaltcash.up.railway.app/register?ref=${user.id}`;
  
  // Role Check
  const isAdmin = user.role === "ADMIN";

  let welcomeMsg = "";
  let buttons: any = { inline_keyboard: [] };

  if (isAdmin) {
    // Admin Dashboard View
    welcomeMsg = `👨‍✈️ *Admin Dashboard*\n\n` +
                 `Welcome back, Master *${user.name}*!\n` +
                 `System is running smoothly.`;
    
    buttons.inline_keyboard = [
      [{ text: "💰 Pending Deposits", callback_data: "admin_deposits" }],
      [{ text: "💸 Pending Withdraws", callback_data: "admin_withdraws" }],
      [{ text: "👥 All Users", callback_data: "admin_users" }],
      [{ text: "🔙 Switch to User View", callback_data: "show_user_dash" }]
    ];
  } else {
    // Normal User Dashboard View
    welcomeMsg = `👋 *${t.welcome_back} ${user.name}!*\n\n` +
                 `💰 *Balance:* ${user.balance || 0} PKR\n` +
                 `👥 *Referrals:* ${user.referralCount || 0}\n` +
                 `🏆 *Rank:* ${user.rankLevel || 'Starter'}\n\n` +
                 `📢 *Referral Link (Click to Copy):*\n\`${refLink}\``;

    buttons.inline_keyboard = [
      [{ text: "💳 Deposit", callback_data: "page_deposit" }, { text: "💸 Withdraw", callback_data: "page_withdraw" }],
      [{ text: "📊 Team", callback_data: "page_team" }, { text: "⚙️ Settings", callback_data: "page_settings" }]
    ];
  }

  await sendTelegram(chatId, welcomeMsg, buttons);
}