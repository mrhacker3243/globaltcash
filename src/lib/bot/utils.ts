export async function sendTelegram(chatId: number, text: string, replyMarkup?: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: replyMarkup,
      parse_mode: "Markdown",
    }),
  });
}

export async function sendTelegramPhoto(chatId: number, photo: string, caption?: string, replyMarkup?: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendPhoto`;

  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photo,
      caption: caption,
      reply_markup: replyMarkup,
      parse_mode: "Markdown",
    }),
  });
}