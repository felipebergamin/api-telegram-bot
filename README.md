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

## News on v5.2

- stopPolling() returns a Promise fulfilled when last long polling fetch ends

## News on v5.1

- Implements `onCallbackQuery` param, like `onReceiveReply` it's a function defined by you when sending an inline_keyboard, this function will be called when user press any button of sent keyboard (see `examples/onCallbackQuery.js` file)
- Add `data` optional param to send methods. This param can be anything defined by you and will be passed as 3th parameter to `onReceiveReply` and `onCallbackQuery` functions. You can use this to "remember" something between user messages.

**See examples/onReplyCallback.js on GitHub to see how to use `onCallbackQuery` and `onReceiveReply`**

## News on v5

- *Smart Menus:* An experimental resource was added on v5. It attempt to allow easier interactions with InlineKeyboards, building nested menus and a easy way to handle user's response.
- Implements `onReceiveReply` optional param to messages send, it's a function that will be called when user reply the message (tapping message on client and selecting 'Reply')
- Implements polling support
- `onRegex` was temporarily removed from code
- `TelegramBotClient` class renamed to `Bot`
- Updates is delivered by rxjs Observables, so you can combine, filter, map, and more
  - You can change from webhook to polling on the fly without re-subscribing to observables

### Install
```sh
npm install api-telegram-bot
```
### Start coding

```js
import { Bot } from "api-telegram-bot";
// or using commonjs imports
// const { Bot } = require("api-telegram-bot");

const TOKEN = "BOT_TOKEN";
const bot = new Bot(TOKEN);
bot.startPolling();

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
     *    banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>
     *    deleteMessage?: () => Promise<TelegramResponse<boolean>>;
     *    reply: (text: string, optionals?) => Promise<TelegramResponse<Message>>;
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

// NOTE: message actions are provided only for regex callbacks and types of message events
bot.editedMessage$.subscribe(data => console.log(data));
```

Sending files:
```js
import { createReadStream } from "fs";
import { Bot } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";
const bot = new Bot(TOKEN);

const file = fs.createReadStream("/PATH/TO/AWESOME/PHOTO");
bot.sendPhoto(send_to, file);
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

# Bugs

If you found a bug, open an issue on GitHub. If you want to help and know the solution, please, submit a pull request.

# Reply Markup Builders

## [Reply Keyboard Markup](https://core.telegram.org/bots/api#replykeyboardmarkup)

```js
import { ReplyKeyboardBuilder, Bot } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";

const bot = new Bot(TOKEN);
const kbBuilder = new ReplyKeyboardBuilder();

const reply_markup = kbBuilder
  .appendRow()
    .addButton({ text: "Yes" })
    .addButton({ text: "No" })
  .appendRow()
    .addButton({ text: "Cancel" });

bot.sendMessage("CONTACT_ID", "Confirm?", { reply_markup });
```

![Reply Keyboard Builder Result](https://image.ibb.co/h2g9N6/Screenshot_20171215_102656.png)

## [Inline Keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup)

```ts
import { InlineKeyboardBuilder, Bot } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";

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
import { InlineKeyboardBuilder, InlineKeyboardButton, Bot } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";

const bot = new Bot(TOKEN);
const kbBuilder = new InlineKeyboardBuilder();
const buttons = [
  { text: "1", callback_data: "BTN_1" },
  { text: "2", callback_data: "BTN_2" },
  { text: "3", callback_data: "BTN_3" },
  { text: "4", callback_data: "BTN_4" },
];

// distribute 2 buttons for each row
const reply_markup = kbBuilder.distributeButtonsInRows(buttons, 2);

bot.sendMessage(CONTACT_ID, "Choose number", { reply_markup });
```

![distribute buttons result](https://image.ibb.co/mXPFUm/Screenshot_20171215_103502.png)

# Smart Menus

Feature added on v5 to build inline keyboards and handle callbacks easier. *This is an experimental feature, please use by your risk and let me know if you experience some problem*

See `examples` directory on GitHub repo to see more examples with comments.

```js
const { log } = require('util');

const { Bot, SmartMenu } = require('api-telegram-bot');

const BOT_TOKEN = 'REPLACE_WITH_YOUR_TOKEN';
const CONTACT_ID = 'REPLACE_WITH_YOUR_ID';

const bot = new Bot(BOT_TOKEN);
bot.startPolling();

const rootMenu = new SmartMenu("Hi! :)");
rootMenu.addButton('Hi! ;)', (cbkQuery, endMenu) => {
  log(`Hi from ${cbkQuery.from.first_name}`);

  bot.answerCallbackQuery(cbkQuery.id, { text: 'Wow, you replied me! <3' });

  endMenu('Thanks ;)');
  bot.polling.stopPolling();
});

bot.sendSmartMenu(CONTACT_ID, rootMenu);
```

# What still need to be done

- Write tests
- Implement Telegram Passport support
