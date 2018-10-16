const { log } = require('util');

const { Bot, SmartMenu } = require('../dist');

const BOT_TOKEN = 'REPLACE_WITH_YOUR_TOKEN';
const CONTACT_ID = 'REPLACE_WITH_YOUR_ID';
const bot = new Bot(BOT_TOKEN);

// always call startPolling() before subscribe to updates
bot.startPolling();

const rootMenu = new SmartMenu("Hi! :)");
rootMenu.addButton('Hi! ;)', (cbkQuery, killMenu) => {
  // firt parameter is the update received
  log(`Hi from ${cbkQuery.from.first_name}`);

  bot.answerCallbackQuery(cbkQuery.id, { text: 'Wow, you replied me! <3' });

  // the second parameter is a function
  // this function receive a string and edit menu message,
  // removing markup and setting text as received by param
  // this function also removes menu reference from bot, helping to 
  killMenu('Thanks ;)');
});

bot.sendSmartMenu(CONTACT_ID, rootMenu);

// observables only execute when you subscribe it
// if you don't subscribe to a chain,
// the bot will not start polling / webhook for these updates
bot.callbackQuery$.subscribe();
