const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is not set.");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

app.get("/", (req, res) => {
  res.send("Telegram Deriv Bot is running.");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

bot.start((ctx) => {
  ctx.reply(
    "🤖 Welcome to the Deriv Trading Bot!\n\n" +
    "The bot is connected successfully.\n\n" +
    "Use /status to check the bot."
  );
});

bot.command("status", (ctx) => {
  ctx.reply("✅ Telegram bot is online.");
});
bot.command("help", (ctx) => {
  ctx.reply(
    "🤖 Deriv Trading Bot\n\n" +
    "Available commands:\n" +
    "/start - Start the bot\n" +
    "/status - Check bot status\n" +
    "/help - Show this menu\n" +
    "/trade - Trading menu"
  );
});

bot.command("trade", async (ctx) => {
  const DERIV_TOKEN = process.env.DERIV_TOKEN;
  const DERIV_APP_ID = process.env.DERIV_APP_ID;

  if (!DERIV_TOKEN || !DERIV_APP_ID) {
    return ctx.reply("⚠️ Deriv connection is not configured yet.");
  }

  try {
    const axios = require("axios");

    await axios.get(
      "https://api.derivws.com/trading/v1/options/accounts",
      {
        headers: {
          "Deriv-App-ID": DERIV_APP_ID,
          "Authorization": `Bearer ${DERIV_TOKEN}`
        }
      }
    );

    await ctx.reply("✅ Deriv is connected successfully.");
  } catch (error) {
    console.error(
      "Deriv connection error:",
      error.response?.data || error.message
    );

    await ctx.reply(
      "❌ Could not connect to Deriv. Check the Deriv App ID and token settings."
    );
  }
});
bot.catch((err) => {
  console.error("Telegram bot error:", err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

bot.launch()
  .then(() => console.log("Telegram bot started."))
  .catch((err) => console.error("Failed to start Telegram bot:", err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
