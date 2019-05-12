const { Bot, Polling } = require('../dist');

const { BOT_TOKEN } = process.env;
const bot = new Bot(BOT_TOKEN);
const polling = new Polling(bot);

polling.startPolling();

bot.messages('text').subscribe(
  ({ actions, update }) => {
    console.log(`Received text message from @${update.message.from.username} (${update.message.from.first_name})`)
    actions.reply(`Received: ${update.message.text}`);
  }
);

// or using destructuring
bot.messages('photo').subscribe(
  ({ update, actions }) => {
    console.log(`Received photo message from @${update.message.from.username} (${update.message.from.first_name})`);
    actions.reply(`Hey, ${update.message.from.first_name}, nice photo!`);
  }
);
