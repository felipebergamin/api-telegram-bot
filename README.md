# Telegram Bot API for Node.js

Node.js module for [Telegram Bot API](https://core.telegram.org/bots/api).

Talk with [@botfather](https://telegram.me/BotFather) on Telegram to create your bot.

This module is updated with Telegram API version **3.5**.

# API reference

[Click here](https://felipebergamin.github.io/api-telegram-bot)

## News on v4

Module codebase was migrated to TypeScript and all declaration files are distributed with package.

### Install
```sh
npm install api-telegram-bot
```
### Start coding with TypeScript
```ts
import http = require("http");
import { Message, MessageActions, TelegramBotClient, Webhook } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";
const bot = new TelegramBotClient(TOKEN);
const webhook = new Webhook(bot);

/*
 * actions is an object with some shortcuts to manipulate received message:
 *    banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>
 *    deleteMessage?: () => Promise<TelegramResponse<boolean>>;
 *    reply: (text: string, optionals?) => Promise<TelegramResponse<Message>>;
 * 
 * deleteMessage and banChatMember are not provided if message was received on private chats
 */
webhook.on("text", (message: Message, actions: MessageActions) => {
  actions.reply(`You send: ${message.text}`);
});

// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", (message: Message) => {
  // message actions not provided here
});

http.createServer(webhook.getWebhook())
  .listen(3000, () => console.log("listening"));

```

Sending files:
```js
import fs = require("fs");
import { TelegramBotClient } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";
const bot = new TelegramBotClient(TOKEN);

const file = fs.createReadStream("/PATH/TO/AWESOME/PHOTO");
bot.sendPhoto(send_to, file);
```

### Events
Webhook emits events according to received [update](https://core.telegram.org/bots/api#update).

For every `message` event, webhook also emits another event according to message type received.

Webhook actually supports follow update types:
* message
  * text
  * audio
  * document
  * game
  * photo
  * sticker
  * video
  * voice
  * video_note
  * contact
  * location
  * venue
  * new_chat_members
  * left_chat_member
  * new_chat_title
  * new_chat_photo
  * delete_chat_photo
  * group_chat_created
  * supergroup_chat_created
  * channel_chat_created
  * pinned_message
  * invoice
  * successful_payment
* edited_message
* channel_post
* edited_channel_post,
* inline_query
* chosen_inline_result
* callback_query
* shipping_query
* pre_checkout_query

### Enable debug log
Start your application with DEBUG env variable containing 'api-telegram-bot' value.
[Reference to debug package](https://www.npmjs.com/package/debug)

```
$ DEBUG=api-telegram-bot npm start
```

### Contributing

Thank you! Feel free to send pull requests and suggestions. I'll really appreciate it.

[Call me on Telegram.](https://t.me/felipebergamin)

# Bugs

If you found a bug, open an issue on GitHub. If you know the solution, please, submit a pull request.

# Reply Markup Builders

## [Reply Keyboard Markup](https://core.telegram.org/bots/api#replykeyboardmarkup)

```js
import { ReplyKeyboardBuilder, TelegramBotClient } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";

const bot = new TelegramBotClient(TOKEN);
const kbBuilder = new ReplyKeyboardBuilder();

const reply_markup = kbBuilder
  .appendRow()
    .addButton({ text: "Yes" })
    .addButton({ text: "No" })
  .appendRow()
    .addButton({ text: "Cancel" });

bot.sendMessage(tid, "Confirm?", { reply_markup });
```

![Reply Keyboard Builder Result](https://image.ibb.co/h2g9N6/Screenshot_20171215_102656.png)

## [Inline Keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup)

```ts
import { InlineKeyboardBuilder, TelegramBotClient } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";

const bot = new TelegramBotClient(TOKEN);
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
import { InlineKeyboardBuilder, InlineKeyboardButton, TelegramBotClient } from "api-telegram-bot";

const TOKEN = "BOT_TOKEN";

const bot = new TelegramBotClient(TOKEN);
const kbBuilder = new InlineKeyboardBuilder();
const buttons: InlineKeyboardButton[] = [
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