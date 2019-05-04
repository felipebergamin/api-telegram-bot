import { InlineMenuHandler } from '../src/generators';
import { answerQuery, deleteMessage, inlineMenu, switchFn, textMessage } from '../src/generators/actions';

describe('using generator for text messages', () => {
  const bot = { sendMessage: null, deleteMessage: null, answerCallbackQuery: null };
  const handler = InlineMenuHandler(bot as any);

  function* anotherGenerator() {
    // 7
    return textMessage('New generator!');
  }

  function* secondGenerator() {
    // 3
    yield deleteMessage();
    // 4
    yield inlineMenu({
      inline_keyboard: [
        [{ text: 'Yeah!', callback_data: 'YEAH' }],
        [{ text: 'No!', callback_data: 'NO' }],
      ],
      text: 'It works!',
    });
    // 5
    yield deleteMessage();
    // 6
    yield answerQuery({ text: 'Nice!' });
    return switchFn(anotherGenerator());
  }

  function* text() {
    // 1
    yield textMessage('Hi', { parse_mode: 'Markdown' });
    // 2
    yield textMessage('Ok');
    return switchFn(secondGenerator());
  }

  // 1
  test('should send a message when function yields a textMessage action', (done) => {
    bot.sendMessage = jest.fn((to, msg, opt) => {
      expect(to).toEqual(123);
      expect(msg).toEqual('Hi');
      expect(opt).toEqual({ parse_mode: 'Markdown', reply_markup: { force_reply: true } });
      done();
      return Promise.resolve({ ok: true, result: { message_id: 1, chat: { id: to } } });
    });

    handler.startGenerator(123, text());
  });

  // 2
  test('when receives a text message, action must include reply_to_message parameter', (done) => {
    bot.sendMessage = jest.fn((to, textToSend, opt) => {
      expect(to).toEqual(123);
      expect(textToSend).toEqual('Ok');
      expect(opt).toEqual({ reply_to_message_id: 2, reply_markup: { force_reply: true } });
      done();
      return Promise.resolve({ ok: true, result: { message_id: 2, chat: { id: to } } });
    });

    const msg = { reply_to_message: { message_id: 1 }, message_id: 2, chat: { id: 123 } } as any;
    expect(handler.hasHandlerForReply(msg)).toEqual(true);
    handler.continueTextGenerator(msg);
  });

  // 3
  test('deleteMessage should dispatch a call to bot.deleteMessage', (done) => {
    const receivedMessage: any = {
      chat: { id: 123 },
      message_id: 3,
      reply_to_message: { message_id: 2 },
    };

    bot.deleteMessage = jest.fn((chatId, messageId) => {
      expect(chatId).toEqual(receivedMessage.chat.id);
      expect(messageId).toEqual(receivedMessage.message_id);
      done();
    });

    expect(handler.hasHandlerForReply(receivedMessage)).toEqual(true);
    handler.continueTextGenerator(receivedMessage);
  });

  // 4
  test('inlineMenu should dispatch a call to sendMessage with reply_markup', (done) => {
    const receivedMessage: any = {
      chat: { id: 123 },
      message_id: 3,
      reply_to_message: { message_id: 2 },
    };

    bot.sendMessage = jest.fn((to, textToSend, opt) => {
      expect(to).toEqual(123);
      expect(textToSend).toEqual('It works!');
      expect(opt).toEqual({
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Yeah!', callback_data: 'YEAH' }],
            [{ text: 'No!', callback_data: 'NO' }],
          ],
        },
        reply_to_message_id: 3,
      });
      done();
      return Promise.resolve({ ok: true, result: { message_id: 3, chat: { id: to } } });
    });

    expect(handler.hasHandlerForReply(receivedMessage)).toEqual(true);
    handler.continueTextGenerator(receivedMessage);
  });

  test('index for previous messages should be removed', () => {
    const prevReceivedMessage: any = {
      chat: { id: 123 },
      message_id: 3,
      reply_to_message: { message_id: 2 },
    };

    expect(handler.hasHandlerForReply(prevReceivedMessage)).toEqual(false);
  });

  // 5
  test('deleteMessage should delete menu message when yielded after receives acallbackQuery', (done) => {
    const cbkQuery: any = {
      data: 'YEAH',
      id: '1a2b3c',
      message: { chat: { id: 123 }, message_id: 3 },
    };

    bot.deleteMessage = jest.fn((chatId, messageId) => {
      expect(chatId).toEqual(cbkQuery.message.chat.id);
      expect(messageId).toEqual(cbkQuery.message.message_id);
      done();
    });

    expect(handler.hasMenuForQuery(cbkQuery)).toEqual(true);
    handler.continueKbGenerator(cbkQuery);
  });

  // 6
  test('answerQuery should dispatch a call to bot.answerCallbackQuery', (done) => {
    const cbkQuery: any = {
      data: 'YEAH',
      id: '1a2b3c',
      message: { chat: { id: 123 }, message_id: 3 },
    };

    bot.answerCallbackQuery = jest.fn((cbkQueryId, data) => {
      expect(cbkQueryId).toEqual(cbkQuery.id);
      expect(data).toEqual({ text: 'Nice!' });
      done();
      return Promise.resolve({ ok: true });
    });

    expect(handler.hasMenuForQuery(cbkQuery)).toEqual(true);
    handler.continueKbGenerator(cbkQuery);
  });

  // 7
  test('switchFn should change generator function', (done) => {
    const prevCbkQuery: any = {
      data: 'YEAH',
      from: { id: 123 },
      id: '1a2b3c',
      message: { chat: { id: 123 }, message_id: 3 },
    };

    bot.sendMessage = jest.fn((to, textToSend, opt) => {
      expect(to).toEqual(123);
      expect(textToSend).toEqual('New generator!');
      expect(opt).toEqual({
        reply_markup: {
          force_reply: false,
        },
        reply_to_message_id: prevCbkQuery.message.message_id,
      });
      done();
      return Promise.resolve({ ok: true, result: { message_id: 5, chat: { id: to } } });
    });

    expect(handler.hasMenuForQuery(prevCbkQuery)).toEqual(true);
    handler.continueKbGenerator(prevCbkQuery).catch((err) => done.fail(err));
    done();
  });

  test('should not store generator when generator was done', () => {
    const receivedMessage: any = {
      chat: {
        id: 123,
      },
      reply_to_message: {
        message_id: 5,
      },
    };

    expect(handler.hasHandlerForReply(receivedMessage)).toEqual(false);
  });
});
