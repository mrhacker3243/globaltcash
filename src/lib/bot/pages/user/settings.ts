import { sendTelegram } from "../../utils";

export async function showSettingsPage(chatId: number, user: any) {
  const msg = `⚙️ *Settings*\n\nName: ${user.name}\nEmail: ${user.email}\nLanguage: ${user.lang}`;
  
  await sendTelegram(chatId, msg, {
    inline_keyboard: [[{ text: "🔙 Back", callback_data: "show_dash" }]]
  });
}