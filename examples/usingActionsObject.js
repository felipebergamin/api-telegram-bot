const { log } = require('util');
const { Bot, Polling } = require('../dist');

const BOT_TOKEN = 'REPLACE_WITH_YOUR_TOKEN';
const bot = new Bot(BOT_TOKEN);
const polling = new Polling(bot);

polling.startPolling();

bot.text$.subscribe(text => {
  log(`Received text message from @${text.update.message.from.username} (${text.update.message.from.first_name})`)
  text.actions.reply(`Received: ${text.update.message.text}`);
});

// or using destructuring
bot.photo$.subscribe(
  ({ update, actions }) => {
    log(`Received photo message from @${update.message.from.username} (${update.message.from.first_name})`);
    actions.reply(`Hey, ${update.message.from.first_name}, nice photo!`);
  }
);
