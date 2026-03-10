import { sendTelegram } from "../../utils";

export async function showSettingsPage(chatId: number, user: any) {
  const msg = `⚙️ *Settings*\n\n👤 *Name:* ${user.name}\n📧 *Email:* ${user.email}\n\nAap apna password reset kar sakte hain ya account logout kar sakte hain.`;
  const buttons = {
    inline_keyboard: [
      [{ text: "🔑 Forgot Password?", callback_data: "auth_forgot_password" }],
      [{ text: "🔴 Logout Account", callback_data: "auth_logout" }],
      [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
    ]
  };
  await sendTelegram(chatId, msg, buttons);
}