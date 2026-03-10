import { sendTelegram } from "../../utils";
import { translations } from "../../translations";

export async function showUserDashboard(chatId: number, user: any) {
  const t = translations[user.lang || 'en'] || translations['en'];
  
  // Telegram Link for easy forwarding and referral attachment
  const refLink = `https://t.me/GlobalTrustCashBot?start=${user.id}`;
  
  const welcomeMsg = `👋 *${t.welcome_back || 'Welcome back'}, ${user.name}!*\n\n` +
                     `💰 *Balance:* ${user.balance || 0} PKR\n` +
                     `🏆 *Rank:* ${user.rankLevel || 'Starter'}\n\n` +
                     `📢 *Your Referral Link:*\n\`${refLink}\`\n\n` +
                     `💡 *Tip:* Is link ko apne doston ko forward karein. Jab woh join karenge, woh aapki team mein shamil ho jayenge!`;

  const buttons = {
    inline_keyboard: [
      [{ text: "📈 Investment Plans", callback_data: "page_plans" }],
      [
        { text: "💳 Deposit", callback_data: "page_deposit" }, 
        { text: "💸 Withdraw", callback_data: "page_withdraw" }
      ],
      [
        { text: "📊 My Team", callback_data: "page_team" }, 
        { text: "⚙️ Settings", callback_data: "page_settings" }
      ],
      // Share button for easy forwarding
      [{ text: "🚀 Share with Friends", url: `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("Join Global Trust Cash and start earning daily profit!")}` }]
    ]
  };

  await sendTelegram(chatId, welcomeMsg, buttons);
}