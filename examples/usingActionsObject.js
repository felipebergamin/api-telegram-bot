const { Bot, Polling } = require('../dist');

const BOT_TOKEN = '';
const bot = new Bot({ bot_token: BOT_TOKEN });
const polling = new Polling(bot);

polling.startPolling();

bot.messages('text').subscribe(({ actions, update }) => {
  console.log(
    `Received text message from @${update.message?.from?.username} (${update.message?.from?.first_name})`,
  );
  actions.reply({ text: `Received: ${update.message?.text}` });
});

// or using destructuring
bot.messages('photo').subscribe(({ update, actions }) => {
  console.log(
    `Received photo message from @${update.message?.from?.username} (${update.message?.from?.first_name})`,
  );
  actions.reply({
    text: `Hey, ${update.message?.from?.first_name}, nice photo!`,
  });
});
