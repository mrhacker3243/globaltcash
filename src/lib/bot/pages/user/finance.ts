import { db } from "@/lib/db";
import { sendTelegram } from "../../utils";

export async function showFinancePage(chatId: number, user: any, type: 'deposit' | 'withdraw') {
  if (type === 'deposit') {
    const msg = `💳 *Add Funds (Deposit)*\n\n` +
                `💰 Your Balance: *${user.balance.toFixed(2)} PKR*\n\n` +
                `👇 Select payment method to get details:`;

    const buttons = {
      inline_keyboard: [
        [{ text: "🏦 EasyPaisa", callback_data: "dep_meth_easypaisa" }, { text: "🏦 JazzCash", callback_data: "dep_meth_jazzcash" }],
        [{ text: "🌐 USDT (TRC20)", callback_data: "dep_meth_usdt" }],
        [{ text: "🔙 Back to Dashboard", callback_data: "show_dash" }]
      ]
    };
    return await sendTelegram(chatId, msg, buttons);
  }
}

export async function showMethodDetails(chatId: number, method: string) {
  const settings = await db.systemSetting.findUnique({ where: { id: "global" } });
  let details = "";
  let icon = "";

  if (method === "easypaisa") {
    icon = "🏦";
    details = `*EasyPaisa Details*\n\nNumber: \`${settings?.easyPaisaNumber}\`\nName: *${settings?.easyPaisaName}*`;
  } else if (method === "jazzcash") {
    icon = "🏦";
    details = `*JazzCash Details*\n\nNumber: \`${settings?.jazzCashNumber}\`\nName: *${settings?.jazzCashName}*`;
  } else if (method === "usdt") {
    icon = "🌐";
    details = `*USDT (TRC20) Address*\n\nAddress: \`${settings?.adminWalletAddress}\`\n\n*Note:* Only TRC20 network supported.`;
  }

  const msg = `${icon} ${details}\n\n` +
              `⚠️ *Instructions:*\n` +
              `1. Send amount to above details.\n` +
              `2. Take a screenshot of the receipt.\n` +
              `3. Enter the amount (PKR) sent below:`;

  await sendTelegram(chatId, msg, {
    inline_keyboard: [[{ text: "❌ Cancel", callback_data: "page_deposit" }]]
  });
}