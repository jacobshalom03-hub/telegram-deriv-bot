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
