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
  .listen(8080, () => log('server listening on port 3000'));

bot.messages('text').subscribe(({ actions, update }) => {
  log(`Received text message from @${update.message?.from?.username} (${update.message?.from?.first_name})`);
  log(`Message: ${update.message?.text}`)
  actions.reply(`Hi! :)`);
});

bot.messages('photo').subscribe(({ update, actions }) => {
  log(`Received photo message from @${update.message?.from?.username} (${update.message?.from?.first_name})`)
  actions.reply('Nice photo!');
});
