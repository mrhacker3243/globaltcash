import { sendTelegram } from "../utils";

export async function showAdminDashboard(chatId: number, user: any) {
  const adminMsg = `👨‍✈️ *Admin Control Center*\n\n` +
                   `Welcome, Master *${user.name}*!\n` +
                   `System Status: ✅ Online\n` +
                   `Role: ${user.role}`;

  const buttons = {
    inline_keyboard: [
      [{ text: "💰 Pending Deposits", callback_data: "admin_deposits" }, { text: "💸 Pending Withdraws", callback_data: "admin_withdraws" }],
      [{ text: "👥 Manage Users", callback_data: "admin_users" }, { text: "📊 Platform Stats", callback_data: "admin_stats" }],
      [{ text: "📢 Broadcast Message", callback_data: "admin_broadcast" }],
      [{ text: "🔄 Switch to User View", callback_data: "show_user_dash" }] // Aap apna personal user dashboard bhi dekh saken
    ]
  };

  await sendTelegram(chatId, adminMsg, buttons);
}