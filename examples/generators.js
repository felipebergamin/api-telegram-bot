const { Bot, Polling, GeneratorActions } = require('../dist');
const BOT_TOKEN = '668481099:AAH-dnu_NmaDBvP0z1VJ95DLIq-TVX0gANg';
const CONTACT = '58683621';

const { answerQuery, inlineMenu, switchFn, textMessage } = GeneratorActions;

const bot = new Bot(BOT_TOKEN);
const polling = new Polling(bot);
polling.startPolling();

function* secondFn() {
  const { text: answer } = yield textMessage('So, what do you like to drink?');
  return textMessage(`${answer}? Nice...`);
}

function* test() {
  const { text: name } = yield textMessage('Hi! What\'s your name?');
  const { data: likeCoffee } = yield inlineMenu({
    inline_keyboard: [
      [
        { text: 'Yes', callback_data: 'YES' },
        { text: 'No', callback_data: 'NO' },
      ],
    ],
    text: `${name}, no you like coffee?`,
  });

  if (likeCoffee === 'NO') {
    return switchFn(secondFn());
  }

  return [
    answerQuery({ text: likeCoffee }),
    // deleteMessage(),
    textMessage('yeah, me too! :)'),
  ];
}

bot.startGenerator(CONTACT, test());
