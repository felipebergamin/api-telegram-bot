const { Bot, Polling } = require('../dist');

const BOT_TOKEN = '';

const bot = new Bot({ bot_token: BOT_TOKEN });
const polling = new Polling(bot);
polling.startPolling();

bot.messages('text').subscribe((text) => {
  console.log(
    `Received text message from @${text.update.message?.from?.username} (${text.update.message?.from?.first_name})`,
  );
});

bot.messages('photo').subscribe((photo) => {
  console.log(
    `Received photo message from @${photo.update.message?.from?.username} (${photo.update.message?.from?.first_name})`,
  );
});
