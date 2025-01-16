const { createServer } = require('http');
const { Bot } = require('../dist');

const BOT_TOKEN = '';
const bot = new Bot({ bot_token: BOT_TOKEN });
const { log } = console;

bot.call('setWebhook', {
  url: 'WEBHOOK_HTTPS_URL',
});

// always call webhook before subscribe to updates
// if you try to subscribe before, observables will be undefined
createServer(bot.getWebhook())
  .listen(3000, () => log('server listening on port 3000'));

bot.messages('text').subscribe(text => {
  log(`Received text message from @${text.update.message?.from?.username} (${text.update.message?.from?.first_name})`)
});

bot.messages('photo').subscribe(photo => {
  log(`Received photo message from @${photo.update.message?.from?.username} (${photo.update.message?.from?.first_name})`)
});
