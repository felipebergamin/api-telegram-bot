const { Bot, Polling, InlineKeyboardBuilder } = require('../dist');
const BOT_TOKEN = 'BOT_TOKEN';
const CONTACT = 'CONTACT_ID';

const bot = new Bot(BOT_TOKEN);
const polling = new Polling(bot);

const keyboard = () => new InlineKeyboardBuilder();

// menu level 2
async function* foodsMenu(actions) {
  [result] = yield actions.editMessageReplyMarkup({
    inline_keyboard: keyboard()
      .addButton({ text: 'Rice', callback_data: 'RICE' })
      .appendRow()
      .addButton({ text: 'Bean', callback_data: 'BEAN' })
      .appendRow()
      .addButton({ text: 'Eggs', callback_data: 'EGGS' })
      .inline_keyboard,
  });

  // returns some data to rootMenu
  return result.data;
}

// menu level 2
async function* drinksMenu(actions) {
  [result, actions] = yield actions.editMessageReplyMarkup({
    inline_keyboard: keyboard()
      .addButton({ text: 'Water', callback_data: 'WATER' })
      .appendRow()
      .addButton({ text: 'Coffee', callback_data: 'COFFEE' })
      .inline_keyboard
  });

  // returns some data to rootMenu
  return result.data;
}

// First level menu
async function* rootMenu(botInstance) {
  let foodOrDrink;
  let option;

  const { inline_keyboard } = keyboard()
    .addButton({ text: 'Food', callback_data: 'FOOD' })
    .addButton({ text: 'Drink', callback_data: 'DRINK' });
  const reply_markup = { inline_keyboard };

  // generator receives an array with received callback_query update,
  // and actions object, in that order
  // (see CallbackQueryActions on docs)
  // [ callback_query, actions ]
  let [cbkQuery, actions] = yield await botInstance.sendMessage(CONTACT, 'Choose one', { reply_markup });

  actions.answerQuery({ text: 'Ok...' });
  foodOrDrink = cbkQuery.data;

  switch (cbkQuery.data) {
    case 'FOOD':
      option = yield* foodsMenu(actions);
      break;
    case 'DRINK':
      option = yield* drinksMenu(actions);
      break;
  }

  actions.editMessageText(`You choose ${foodOrDrink} / ${option}`);
  // terminate generator function
  // when generator ends (done === true), it's removed from array
  return;
}

bot.callbackQuery$.subscribe(cbkQuery => {
  // callback_query update will not be delivered by observable
  // if it has an associated generator or a callback function to handle it
  console.log(`received callbackQuery ${cbkQuery.callback_query.id}`);
});

bot.sendMenu(rootMenu(bot));
polling.startPolling();
