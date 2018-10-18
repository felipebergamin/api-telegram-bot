const { log } = require('util');

const { Bot, SmartMenu } = require('../dist');

const BOT_TOKEN = "REPLACE_WITH_YOUR_TOKEN";
const CONTACT_ID = "REPLACE_WITH_YOUR_TELEGRAM_ID";

const bot = new Bot(BOT_TOKEN);
bot.startPolling();

const rootMenu = new SmartMenu("Hi! :)");
const childMenu = new SmartMenu("Choose:", true, "Back");

rootMenu.addButton('Hi! ;)', (cbkQuery) => {
  log(`Hi from ${cbkQuery.from.first_name}`);

  // just return a instance of SmartMenu to update current message and create a sub-menu
  return childMenu;
});

childMenu.addButton('Bye!', (cbQuery, killMenu) => {
  log(`Bye from ${cbQuery.from.first_name}`);
  killMenu('Bye! See u!');
  bot.polling.stopPolling();
});

bot.sendSmartMenu(CONTACT_ID, rootMenu);
