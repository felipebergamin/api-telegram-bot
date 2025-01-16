const { createReadStream } = require('fs');
const { join } = require('path');
const { Bot } = require('../dist');

const BOT_TOKEN = '';
const CONTACT_ID = '';

const bot = new Bot({ bot_token: BOT_TOKEN });
const file = createReadStream(join(__dirname, 'image.png'));

bot.call('sendPhoto', {
  chat_id: CONTACT_ID,
  photo: file,
});
