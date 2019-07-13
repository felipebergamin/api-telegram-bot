# Telegram Bot API for Node.js

Node.js module for [Telegram Bot API](https://core.telegram.org/bots/api).

Talk with [@botfather](https://telegram.me/BotFather) on Telegram to create your bot.

This module is updated with Telegram API version **4.2**. Except with Telegram Passport.

# API reference

[Click Here](http://apitelegrambot.tech/v6.0.2)

### Older Versions

- [v4.0.2](http://apitelegrambot.tech/v4.0.2/)
- [v5.0.x](http://apitelegrambot.tech/v5.0.0)
- [v5.1.x](http://apitelegrambot.tech/v5.1.0)
- [v5.2.x](http://apitelegrambot.tech/v5.2.0)

### Examples

There's a `examples` directory on GitHub. Take a look ;)

Before run any example code, please install deps with `npm i` and run `npm run build` to transpile TS code to JS in dist folder.

## News

- Removed experimental feature `SmartMenu`
- Implemented menus builded with js generators
- Changes Polling
  - Moved .startPolling() from Bot instance to Polling

### Install
```sh
npm install api-telegram-bot
```
### Start coding

```js
const { Bot, Polling } = require('api-telegram-bot');
// or using commonjs imports
// const { Bot } = require("api-telegram-bot");

const TOKEN = "BOT_TOKEN";
const bot = new Bot(TOKEN);
// polling constructor accepts some options as second parameter, see docs
const polling = new Polling(bot);

// subscribe to all message types (texts, photos, videos, and others)
bot.messages().subscribe(data => {
  // data is a object with 2 props:
  //   data.update - is the update received,
  //   data.actions - actions object with some helper functions
  // log to see what it is:
  console.log(data);
});

// subscribe only to text messages
bot.messages('text').subscribe(
  // my opinion: use object destructuring allows a more beautiful code
  ({ update, actions }) => {

    /*
     * actions is an object with some functions to manipulate received message:
     *    banChatMember: (until: number) => Promise
     *    deleteMessage: () => Promise
     *    reply: (text: string, optionals?) => Promise
     * 
     * note: deleteMessage and banChatMember doesn't works on private chats
     */
    actions.reply(update.message.text);

    setTimeout(() => {
      bot.polling.stopPolling() // stopPolling() returns a promise fulfilled when polling ends (v5.2 or newer) (see docs for details)
        .then(() => console.log('polling stopped'));
    }, 30000)
  }
);

// NOTE: message actions are provided only for message updates (text, photo, ...)
bot.messages('edited_messages').subscribe(data => {
  // no actions here
  console.log(data);
});
```

## Enable debug log
Start your application with DEBUG env variable containing 'api-telegram-bot' value.
[Reference to debug package](https://www.npmjs.com/package/debug)

```
$ DEBUG=api-telegram-bot npm start
```

To see debug logs from webhook or polling:

```
$ DEBUG=api-telegram-bot:polling npm start
```
``` 
$ DEBUG=api-telegram-bot:webhook npm start
```

# Reply Markup Builders

## [Reply Keyboard Markup](https://core.telegram.org/bots/api#replykeyboardmarkup)

```js
const { KeyboardBuilder } = require('api-telegram-bot');

const TOKEN = 'BOT_TOKEN';
const CONTACT_ID = 'CONTACT_ID';
const bot = new Bot(TOKEN);

const { keyboard } = KeyboardBuilder()
  .button({ text: "Yes" })
  .button({ text: "No" })
  .newRow()
  .button('Cancel');

bot.sendMessage(CONTACT_ID, "Confirm?", { reply_markup: { keyboard, resize_keyboard: true } });
```

![Reply Keyboard Builder Result](https://image.ibb.co/h2g9N6/Screenshot_20171215_102656.png)

## [Inline Keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup)

```ts
const { KeyboardBuilder, Bot } = require('api-telegram-bot');

const TOKEN = 'BOT_TOKEN';
const CONTACT_ID = 'YOUR_TELEGRAM_ID';

const bot = new Bot(TOKEN);

const inline_keyboard = KeyboardBuilder()
  .newRow()
    .button({ text: "Yes", callback_data: "YES" })
    .button({ text: "No", callback_data: "NO" })
  .newRow()
    .button({ text: "Cancel", callback_data: "CANCEL" })
  .keyboard;

bot.sendMessage(CONTACT_ID, "Confirm?", { reply_markup: { inline_keyboard } });
```

See the message sent by code above:

![Inline Keyboard Builder Result](https://image.ibb.co/kQOH9m/Screenshot_20171215_095919.png)
