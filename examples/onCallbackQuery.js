const BOT_TOKEN = '';
const CONTACT_ID = '';

const { Bot, InlineKeyboardBuilder } = require('../dist');
const bot = new Bot(BOT_TOKEN);
bot.startPolling();

/*
 * please note: when a received message match with a onReceiveReply function,
 * this message will not be delivered by observables
 */
bot.text$.subscribe(({ update, actions }) => {
  actions.reply(`You send:\n\n${update.message.text}`);
});

/*
 * callback_query actions:
 *
 * banChatMember: (until: number) => Promise<TelegramResponse<boolean>>
 * deleteMessage: () => Promise<TelegramResponse<boolean>>
 * answerQuery: (opt?: AnswerCallbackQueryOptionals) => Promise<TelegramResponse<boolean>>
 * editMessageText: (text: string, opt?: EditMessageTextOptionals) => Promise<TelegramResponse<Message | boolean>>
 * editMessageReplyMarkup: (reply_markup: ReplyMarkup) => Promise<TelegramResponse<Message | boolean>>
 * 
 * see CallbackQueryActions on docs to get details about possible params
 */
const endConversation = (cbkQuery, actions, data) => {
  const text = cbkQuery.data === 'YES' ? `Yeah, ${data.name}! Me too!` : 'Ooh, sad life... =(';
  actions.answerQuery({ text, show_alert: false });
  // actions.deleteMessage();
  actions.editMessageText(text);
};

const askAboutCoffee = (message, actions) => {
  const kb = new InlineKeyboardBuilder()
  const { inline_keyboard } = kb
    .addButton({ text: 'Yes', callback_data: 'YES' })
    .addButton({ text: 'No', callback_data: 'NO' });

  actions.reply(
    `Tell me, ${message.text}, do you like coffee?`,
    {
      reply_markup: { inline_keyboard },
      onCallbackQuery: endConversation,
      data: {
        // the function endConversation will receive this object as 3th param
        name: message.text,
      },
    },
  );
};

bot.sendMessage(
  CONTACT_ID,
  'What\'s your name, please?',
  {
    onReceiveReply: askAboutCoffee,
    reply_markup: { force_reply: true },
  },
);
