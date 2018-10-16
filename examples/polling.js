const { log } = require('util');
const { Bot } = require('../dist');

const BOT_TOKEN = 'REPLACE_WITH_BOT_TOKEN';
const bot = new Bot(BOT_TOKEN);

// always call startPolling() before subscribe to updates
bot.startPolling();

bot.text$.subscribe(text => {
  log(`Received text message from @${text.update.message.from.username} (${text.update.message.from.first_name})`)
});

bot.photo$.subscribe(photo => {
  log(`Received photo message from @${photo.update.message.from.username} (${photo.update.message.from.first_name})`)
});
