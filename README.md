# Telegram Bot API for Node.js

Node.js module for [Telegram Bot API](https://core.telegram.org/bots/api).

Talk with [@botfather](https://telegram.me/BotFather) on Telegram to create your bot.

# API reference

Please refer to the official Telegram Bot API documentation for details on the methods and types available.

[Click Here](https://core.telegram.org/bots/api)

### Examples

There's an [examples](https://github.com/felipebergamin/api-telegram-bot/tree/master/examples) directory on GitHub. Take a look ;)

Before run any example code, please install deps with `yarn` and build the library running `yarn build`.

### Install

```sh
npm install api-telegram-bot
```

### How to use

```js
const { Bot, Polling } = require('api-telegram-bot');

const TOKEN = 'BOT_TOKEN';
const bot = new Bot({ bot_token: TOKEN });
const polling = new Polling(bot);

// subscribe to all message types (texts, photos, videos, and others)
bot.messages().subscribe((data) => {
  // data is a object with 2 props:
  //   data.update - is the update received,
  //   data.actions - actions object with some helper functions
  // log to see what it is:
  console.log(data);
});

// subscribe only to text messages
bot.messages('text').subscribe(({ update, actions }) => {
  /*
   * `update` is the update object received from Telegram
   * `actions` is an object with some functions to manipulate received message:
   *    banChatMember: (until: number) => Promise
   *    deleteMessage: () => Promise
   *    reply: (text: string, optionals?) => Promise
   *
   * note: deleteMessage and banChatMember doesn't works on private chats
   */
  actions.reply(`You said: ${update.message?.text}`);

  setTimeout(() => {
    polling.stopPolling();
  }, 30000);
});

// NOTE: message actions are provided only for message updates (text, photo, ...)
bot.updates('edited_message').subscribe((data) => {
  // no actions here
  console.log(data);
});
```

## Using with webhook

See the `examples/webhook.js` file on GitHub [examples directory](https://github.com/felipebergamin/api-telegram-bot/tree/master/examples).

### Providing a custom http client

You can provide a custom http client factory to the bot constructor. The client must implements the following interface:

```ts
export type HttpClientArgs = {
  baseURL: string;
};

export interface HttpBotClient {
  post: <B = unknown, R = any>(
    method: string,
    // data is a plain object with the api method parameters (the second parameter passed to bot.call())
    data: B,
  ) => Promise<{ data: R }>;
}

const createHttpClient = ({ baseURL }: HttpClientArgs): HttpBotClient => {
  return {
    post(method, data) {
      // your code to make the request
      return fetch(...);
    },
  };
};

const bot = new Bot({
  bot_token: '',
  createHttpClient,
});
```

## Reply Markup Builders

Helpers to create reply markups for Telegram Bot API.

### [Reply Keyboard Markup](https://core.telegram.org/bots/api#replykeyboardmarkup)

```js
const { KeyboardBuilder } = require('api-telegram-bot');

const TOKEN = 'BOT_TOKEN';
const chat_id = 'CONTACT_ID';
const bot = new Bot({ bot_token: TOKEN });

const { keyboard } = KeyboardBuilder()
  .button({ text: "Yes" })
  .button({ text: "No" })
  .newRow()
  .button('Cancel');

bot.call('sendMessage', {
  chat_id,
  reply_markup: { keyboard, resize_keyboard: true },
  text: 'Confirm?'
});
```

![Reply Keyboard Builder Result](https://image.ibb.co/h2g9N6/Screenshot_20171215_102656.png)

## [Inline Keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup)

```ts
const { KeyboardBuilder, Bot } = require('api-telegram-bot');

const TOKEN = 'BOT_TOKEN';
const chat_id = 'YOUR_TELEGRAM_ID';

const bot = new Bot({ bot_token: TOKEN });

const { keyboard: inline_keyboard } = KeyboardBuilder()
  .newRow()
  .button({ text: 'Yes', callback_data: 'YES' })
  .button({ text: 'No', callback_data: 'NO' })
  .newRow()
  .button({ text: 'Cancel', callback_data: 'CANCEL' });

bot.call('sendMessage', {
  chat_id,
  reply_markup: { inline_keyboard },
  text: 'Confirm?',
});
```

See the message sent by code above:

![Inline Keyboard Builder Result](https://image.ibb.co/kQOH9m/Screenshot_20171215_095919.png)

## Todo

- [ ] Add more unit tests
- [ ] Improve the web scrapper
- [ ] Refactor the Webhook and Polling classes
- [ ] Add more test cases to `scripts\test.ts`
