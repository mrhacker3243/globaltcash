import { sendTelegram } from "../utils";

export async function showSettingsPage(chatId: number, user: any) {
  const settingsMsg = `⚙️ *Account Settings*\n\n` +
                      `👤 Name: ${user.name}\n` +
                      `📧 Email: ${user.email}\n` +
                      `🔑 Role: ${user.role}\n` +
                      `🌍 Language: ${user.lang || 'English'}`;

  const buttons = {
    inline_keyboard: [
      [{ text: "Change Language", callback_data: "page_lang_change" }],
      [{ text: "Update Wallet", callback_data: "page_wallet" }],
      [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
    ]
  };

  await sendTelegram(chatId, settingsMsg, buttons);
}