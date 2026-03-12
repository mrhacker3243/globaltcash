import { handleStart } from "./startHandler";
import { handleUserCallbacks } from "./userHandler";
import { handleAdminCallbacks } from "./adminHandler";
import { handleFinanceCallbacks } from "./financeHandler";
import { handleTextInput } from "./textHandler";
import { handlePhoto } from "./photoHandler";

import { db } from "@/lib/db";

export async function handleUpdate(body: any) {

  const msg = body.message;
  const cb = body.callback_query;

  const chatId = msg ? msg.chat.id : cb?.message?.chat?.id;
  if (!chatId) return;

  const text = msg?.text || "";
  const data = cb?.data || "";
  const photo = msg?.photo;

  const user = await db.user.findUnique({
    where: { telegramId: String(chatId) }
  });

  // START
  if (text.startsWith("/start") || data === "show_dash") {
    return handleStart(chatId);
  }

  // PHOTO
  if (photo) {
    return handlePhoto(chatId, photo);
  }

  // CALLBACKS
  if (data) {
    await handleAdminCallbacks(chatId, data);
    await handleUserCallbacks(chatId, data);
    await handleFinanceCallbacks(chatId, data, user);
  }

  // TEXT INPUT
  if (text) {
    return handleTextInput(chatId, text);
  }
}