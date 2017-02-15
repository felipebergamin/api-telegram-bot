# Using reply_markup classes

## [Reply Keyboard Markup](https://core.telegram.org/bots/api#replykeyboardmarkup)

```js
const TelegramBotClient = require('api-telegram-bot');

const token = 'your token here';
const bot = new TelegramBotClient(token);

const reply_markup = new bot.ReplyKeyboardMarkup();

reply_markup
    .appendRow()
        .addButton({text: 'Op 1'});

// or use button class
const KeyboardButton = bot.ReplyKeyboardMarkup.KeyboardButton;
const button2 = new KeyboardButton().setText('Op 2');

reply_markup.addButton(button2);
        
bot.sendMessage(YOUR_TELEGRAM_ID, 'Hi', {reply_markup});
```

## [Inline Keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup)

```js
const TelegramBotClient = require('api-telegram-bot');

const token = 'your token here';
const bot = new TelegramBotClient(token);

const reply_markup = new bot.InlineKeyboardMarkup();

reply_markup
    .appendRow()
        .addButton({text: 'GitHub', url: 'https://github.com/'});

// or use button class
const KeyboardButton = bot.InlineKeyboardMarkup.InlineKeyboardButton;
const button2 = new KeyboardButton()
    .setText('Git')
    .setUrl('https://git-scm.com/');

// you can add more rows
// new buttons always be added on last row
reply_markup
    .appendRow()
        .addButton(button2);
        
bot.sendMessage(YOUR_TELEGRAM_ID, 'Hi', {reply_markup});
```

### If you think this can be helpful:

```js
const TelegramBotClient = require('api-telegram-bot');

const token = 'your token here';
const bot = new TelegramBotClient(token);

const reply_markup = new bot.InlineKeyboardMarkup();

const buttons = [
    {text: 'Google', url: 'https://www.google.com'},
    {text: 'Git', url: 'https://git-scm.com'},
    {text: 'GitHub', url: 'https://github.com'},
    {text: 'Node', url: 'https://nodejs.org'}
];

// distribute buttons in rows, max of 2 buttons per row
reply_markup.distributeButtonsInRows(buttons, 2);
        
bot.sendMessage(YOUR_TELEGRAM_ID, 'Hi', {reply_markup});
```

## [Reply Markup Remove](https://core.telegram.org/bots/api#replykeyboardremove)

```js
const TelegramBotClient = require('api-telegram-bot');

const token = 'your token here';
const bot = new TelegramBotClient(token);

const reply_markup = new bot.ReplyKeyboardRemove;

bot.sendMessage(YOUR_TELEGRAM_ID, 'Hi', {reply_markup});
```

## [Force Reply](https://core.telegram.org/bots/api#forcereply)

```js
const TelegramBotClient = require('api-telegram-bot');

const token = 'your token here';
const bot = new TelegramBotClient(token);

const reply_markup = bot.ForceReply;
        
bot.sendMessage(YOUR_TELEGRAM_ID, 'Hi', {reply_markup});
```