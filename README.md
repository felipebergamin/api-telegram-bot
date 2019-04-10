# Telegram Bot API for Node.js

Node.js module for [Telegram Bot API](https://core.telegram.org/bots/api).

Talk with [@botfather](https://telegram.me/BotFather) on Telegram to create your bot.

This module is updated with Telegram API version **4.1**. Except with Telegram Passport.

# API reference

[Click Here (v5.2)](http://apitelegrambot.tech/v5.2.0)

### Older Versions

- [v4.0.2](http://apitelegrambot.tech/v4.0.2/)
- [v5.0.x](http://apitelegrambot.tech/v5.0.0)
- [v5.1.x](http://apitelegrambot.tech/v5.1.0)

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
import { Bot, Polling } from "api-telegram-bot";
// or using commonjs imports
// const { Bot } = require("api-telegram-bot");

const TOKEN = "BOT_TOKEN";
const bot = new Bot(TOKEN);
// polling constructor accepts some options as second parameter, see docs
const polling = new Polling(bot);

// subscribe to all message types (texts, photos, videos, and others)
bot.message$.subscribe(data => {
  // data is a object with 2 props:
  //   data.update - is the update received,
  //   data.actions - actions object with some helper functions
  // log to see what it is:
  console.log(data);
});

// subscribe only to text messages
bot.text$.subscribe(
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
bot.editedMessage$.subscribe(data => {
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
const { ReplyKeyboardBuilder, Bot } = require('api-telegram-bot');

const TOKEN = "BOT_TOKEN";
const CONTACT_ID = 'YOUR_TELEGRAM_ID';

const bot = new Bot(TOKEN);
const kbBuilder = new ReplyKeyboardBuilder();

const reply_markup = kbBuilder
  .appendRow()
    .addButton({ text: "Yes" })
    .addButton({ text: "No" })
  .appendRow()
    .addButton({ text: "Cancel" });

bot.sendMessage(CONTACT_ID, "Confirm?", { reply_markup });
```

![Reply Keyboard Builder Result](https://image.ibb.co/h2g9N6/Screenshot_20171215_102656.png)

## [Inline Keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup)

```ts
const { InlineKeyboardBuilder, Bot } = require('api-telegram-bot');

const TOKEN = "BOT_TOKEN";
const CONTACT_ID = 'YOUR_TELEGRAM_ID';

const bot = new Bot(TOKEN);
const kbBuilder = new InlineKeyboardBuilder();

const reply_markup = kbBuilder
  .appendRow()
    .addButton({ text: "Yes", callback_data: "YES" })
    .addButton({ text: "No", callback_data: "NO" })
  .appendRow()
    .addButton({ text: "Cancel", callback_data: "CANCEL" });

bot.sendMessage(CONTACT_ID, "Confirm?", { reply_markup });
```

See the message sent by code above:

![Inline Keyboard Builder Result](https://image.ibb.co/kQOH9m/Screenshot_20171215_095919.png)

### distributeButtonsInRows

```js
const { InlineKeyboardBuilder, InlineKeyboardButton, Bot } = require('api-telegram-bot');

const BOT_TOKEN = 'BOT_TOKEN';
const CONTACT_ID = 'YOUR_TELEGRAM_ID';

const bot = new Bot(BOT_TOKEN);
const kbBuilder = new InlineKeyboardBuilder();
const buttons = [
  { text: '1', callback_data: 'BTN_1' },
  { text: '2', callback_data: 'BTN_2' },
  { text: '3', callback_data: 'BTN_3' },
  { text: '4', callback_data: 'BTN_4' },
];

// distribute 2 buttons for each row
const reply_markup = kbBuilder.distributeButtonsInRows(buttons, 2);

bot.sendMessage(CONTACT_ID, "Choose a number", { reply_markup });
```

![distribute buttons result](https://image.ibb.co/mXPFUm/Screenshot_20171215_103502.png)

# What still need to be done

- Write tests
- Implement Telegram Passport support
