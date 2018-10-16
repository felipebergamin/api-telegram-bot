const { log } = require('util');
const { createServer } = require('http');

const { Bot } = require('../dist');

const BOT_TOKEN = 'REPLACE_WITH_BOT_TOKEN';
const bot = new Bot(BOT_TOKEN);

bot.setWebhook('WEBHOOK_ADDRESS'); // must be https

// always call webhook before subscribe to updates
// if you try to subscrive before, observables will be undefined
createServer(bot.getWebhook())
  .listen(3000, () => log('server listening on port 3000'));

bot.text$.subscribe(text => {
  log(`Received text message from @${text.update.message.from.username} (${text.update.message.from.first_name})`)
});

bot.photo$.subscribe(photo => {
  log(`Received photo message from @${photo.update.message.from.username} (${photo.update.message.from.first_name})`)
});
