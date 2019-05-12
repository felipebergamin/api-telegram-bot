const { createReadStream } = require('fs');
const { join } = require('path');
const { Bot } = require('../dist');

const { BOT_TOKEN, CONTACT_ID } = process.env;
const bot = new Bot(BOT_TOKEN);
const file = createReadStream(join(__dirname, 'image.png'));

bot.sendPhoto(CONTACT_ID, file);
