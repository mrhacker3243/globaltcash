import { sendTelegram } from "../../utils";
import { translations } from "../../translations";

export async function showUserDashboard(chatId: number, user: any) {
  const t = translations[user.lang || 'en'] || translations['en'];
  
  // Telegram Link - Direct clean link construction
  const botUsername = "GlobalTrustCashBot"; // Apne bot ka username confirm kar len
  const refLink = `https://t.me/${botUsername}?start=${user.id}`;
  
  // Share link text construction
  const shareText = "Join Global Trust Cash! 💰 Get daily profit on your investment. Start now!";
  const shareUrl = `https://t.me/share/url?url=${refLink}&text=${encodeURIComponent(shareText)}`;

  const welcomeMsg = `👋 *${t.welcome_back || 'Welcome back'}, ${user.name}!*\n\n` +
                     `💰 *Balance:* ${user.balance.toFixed(2)} PKR\n` +
                     `🏆 *Rank:* ${user.rankLevel || 'Starter'}\n\n` +
                     `📢 *Your Referral Link:*\n\`${refLink}\`\n\n` +
                     `💡 *Tip:* Is link ko copy karke doston ko send karein. Jab woh join karenge, woh aapki team mein shamil ho jayenge!`;

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
      [
        { text: "🚀 Share with Friends", url: shareUrl }
      ]
    ]
  };

  await sendTelegram(chatId, welcomeMsg, buttons);
}