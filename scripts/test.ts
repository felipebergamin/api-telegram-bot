/* eslint-disable no-console */
import { createReadStream } from 'fs';
import { join } from 'path';

import { setTimeout } from 'timers/promises';
import { Bot, KeyboardBuilder, Polling } from '../src';

const token = process.env.BOT_TOKEN;
const chat_id = process.env.CHAT_ID;

if (!token) throw new Error('BOT_TOKEN is required');
if (!chat_id) throw new Error('CHAT_ID is required');

const bot = new Bot(token);

const fn = async () => {
  try {
    const polling = new Polling(bot);
    polling.startPolling();

    bot.messages('text').subscribe(({ actions, update }) => {
      console.log('received', update.message?.text);
      actions.reply({ text: `You said: ${update.message?.text}` });
    });

    bot.updates('callback_query').subscribe((update) => {
      if (!update.callback_query?.message) return;
      console.log(
        'received callback_query with data',
        update.callback_query?.data,
      );
      bot.call('editMessageText', {
        message_id: update.callback_query.message.message_id,
        chat_id: update.callback_query.message.chat.id,
        text: `You clicked on ${update.callback_query?.data}`,
      });
    });

    const data = await bot.call('getMe');
    console.log('getMe', JSON.stringify(data, null, 2));
    console.log('sending a message');
    const sentMessage = await bot.call('sendMessage', {
      chat_id,
      text: 'Hello World',
    });
    console.log('sending a upload_photo chat action');
    await bot.call('sendChatAction', {
      action: 'upload_photo',
      chat_id,
    });
    console.log('sending a photo');
    await bot.call('sendPhoto', {
      chat_id,
      text: 'See this',
      photo: createReadStream(join(__dirname, './image.png')),
    });
    console.log('editing the first message');
    await bot.call('editMessageText', {
      text: 'Hello World! (edited)',
      chat_id: sentMessage.result.chat.id,
      message_id: sentMessage.result.message_id,
    });
    const messageToDelete = await bot.call('sendMessage', {
      chat_id,
      text: 'This message will be deleted in 3 seconds',
    });
    await setTimeout(3000);
    console.log('deleting the message');
    await bot.call('deleteMessage', {
      chat_id,
      message_id: messageToDelete.result.message_id,
    });
    await bot.call('sendMessage', {
      chat_id,
      text: 'Testing keyboards',
      reply_markup: {
        inline_keyboard: KeyboardBuilder()
          .button({ text: 'Yes', callback_data: 'YES' })
          .button({ text: 'No', callback_data: 'NO' }).keyboard,
      },
    });
    await bot.call('pinChatMessage', {
      chat_id,
      message_id: sentMessage.result.message_id,
    });
    await setTimeout(1500);
    await bot.call('unpinChatMessage', {
      chat_id,
    });
  } catch (err) {
    console.error(err);
  }
};

fn();
