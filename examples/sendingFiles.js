const { createReadStream } = require('fs');
const { Bot } = require('../dist');

const TOKEN = "BOT_TOKEN";
const bot = new Bot(TOKEN);

const file = createReadStream("/PATH/TO/AWESOME/PHOTO");
bot.sendPhoto(send_to, file);
