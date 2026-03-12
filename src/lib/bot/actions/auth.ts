import { db } from "@/lib/db";
import { sendTelegram } from "../utils";

/**
 * Handles the logout process by unlinking the telegramId from the user record.
 * @param chatId - The Telegram chat ID (received as string or number)
 * @param userId - The database UUID/CUID of the user
 */
export async function handleLogout(chatId: string | number, userId: string) {
  try {
    // 1. Unlink Telegram ID in Database
    await db.user.update({
      where: { id: userId },
      data: { telegramId: null }
    });

    // 2. Send Confirmation (Converting chatId to Number to satisfy TypeScript)
    return await sendTelegram(
      Number(chatId), 
      "👋 *Logout Successful!*\n\nAapka Telegram account website se unlink kar diya gaya hy. Dobara use karne ke liye `/start` bhejien."
    );
  } catch (error) {
    console.error("Logout Error:", error);
    return await sendTelegram(
      Number(chatId), 
      "⚠️ *Error:* Logout process mein masla aaya hy. Please try again later."
    );
  }
}