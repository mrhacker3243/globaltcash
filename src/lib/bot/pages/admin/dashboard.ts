import { sendTelegram } from "../../utils";

export async function showAdminDashboard(chatId: number, user: any) {
  const msg = `👨‍✈️ *GTC ADMIN PANEL*\n\n` +
              `Welcome, *${user.name}*\n` +
              `System Status: ✅ Active\n` +
              `Your Role: ${user.role}`;

  const buttons = {
    inline_keyboard: [
      [{ text: "📥 Pending Deposits", callback_data: "admin_page_deposits" }],
      [{ text: "📤 Pending Withdraws", callback_data: "admin_page_withdraws" }],
      [{ text: "👥 User Management", callback_data: "admin_page_users" }],
      [{ text: "🔄 Switch to User View", callback_data: "show_user_dash" }]
    ]
  };

  await sendTelegram(chatId, msg, buttons);
}