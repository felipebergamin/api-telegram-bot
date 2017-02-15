# Telegram Bot API for Node.js

Node.js module for [Telegram Bot API](https://core.telegram.org/bots/api).

Talk with [@botfather](https://telegram.me/BotFather) on Telegram to create a bot for you.

This module implements all methods described in bot API **2.3.1**.


Install:
```sh
npm install api-telegram-bot
```
Start coding:
```js
const TelegramBotClient = require('api-telegram-bot');
const token = 'your toke here';
const port = process.env.PORT;
const path = '/';

const bot = new TelegramBotClient (token);

bot.createWebhook({path, port});

bot.on('text', (message, reply)=>{
    reply(message.text);
});

bot.on('photo', (photo, reply)=>{
    reply('wonderful');
});
```

If you need to set your routes on Express:
```js
const TelegramBotClient = require('api-telegram-bot');
const bodyparser = require('body-parser');
const express = require('express');

const expressApp = express();
// when you create your own express app, you must to set bodyparser middleware, otherwise webhook will not work
expressApp.use(bodyparser.json());

expressApp.get('/myroute', (req, res)=>{
    res.end('hi :)');
});

const token = 'your token here';
const port = process.env.PORT;
const path = '/';
        
const bot = new TelegramBotClient (token);

bot.createWebhook({ expressApp, path, port });

// callback will be called for every text message that matches with regex
bot.onRegex(/\/start/, (message, reply)=>{
    reply('hello');
});
```

Sending files:
```js
const TelegramBotClient = require('api-telegram-bot');
const fs = require('fs');
const token = 'your token here';

const bot = new TelegramBotClient (token);
const file = fs.createReadStream(__dirname + '/file.txt');
bot.sendDocument(to_chat_id, file);
```

### Events
For every message received, an event will be emitted according to [message type](https://core.telegram.org/bots/api#message) received: `text`, `audio`, `document`, `photo`, `sticker`, `video`, `voice`, `contact`, `location`, `new_chat_participant`, `left_chat_participant`, `new_chat_title`, `new_chat_photo`, `delete_chat_photo`, `group_chat_created`.
Also emits a `message` event for all messages of any kind.

More events:
- `callback_query` [see details](https://core.telegram.org/bots/api#callbackquery).
- `inline_query` [see details](https://core.telegram.org/bots/api#inlinequery)
- `chosen_inline_result` [see details](https://core.telegram.org/bots/api#choseninlineresult)
- `channel_post` [see details](https://core.telegram.org/bots/api#message).
- `edited_message` [see details](https://core.telegram.org/bots/api#message)
- `edited_channel_post` [see details](https://core.telegram.org/bots/api#message)

### Contributing

Thank you! Feel free to collaborate as best you can. I'll really appreciate it.

[Call me on Telegram.](https://t.me/felipe_tracker)


# API reference

[Click here](https://github.com/felipebergamin/api-telegram-bot/blob/master/docs/api.md)

# Reply Markup Classes

[See here](https://github.com/felipebergamin/api-telegram-bot/blob/master/docs/reply_markup_examples.md)