import { createReadStream } from 'fs';
import { join } from 'path';

import { Bot, KeyboardBuilder } from './src';

const token = '5592517927:AAGo7sgaM4p2TrpTfrOrb80YzVw907DfnJM';
const ID = '58683621';

const bot = new Bot(token);

const fn = async () => {
  try {
    await bot.call('sendMessage', {
      chat_id: ID,
      text: 'Hello World',
    });
    await bot.call('sendChatAction', {
      action: 'upload_photo',
      chat_id: ID,
    });
    await bot.call('sendPhoto', {
      chat_id: ID,
      text: 'See this',
      photo: createReadStream(join(__dirname, './image.png')),
    });
    // await bot.call('editMessageText', {
    //   text: 'Hello World! (edited)',
    //   chat_id: sentMessage.result.chat.id,
    //   message_id: sentMessage.result.message_id,
    // });
    // await bot.call('sendMessage', {
    //   chat_id: ID,
    //   text: 'Hello World',
    // });
    await bot.call('sendMessage', {
      chat_id: ID,
      text: 'Testing keyboards',
      reply_markup: {
        inline_keyboard: KeyboardBuilder()
          .button({ text: 'Yes', callback_data: 'YES' })
          .button({ text: 'No', callback_data: 'NO' }).keyboard,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    // console.log(err);
    // if (err instanceof Error) {
    //   console.log(err.message);
    // } else console.log(err);
  }
};

fn();
