import { createCallbackQueryActions, createMessageActions } from '../src/utils';

describe('createMessageActions', () => {
  const message = {
    chat: {
      id: 100,
    },
    from: {
      id: 110,
    },
    message_id: 120,
  };

  const bot = {
    deleteMessage: jest.fn(),
    kickChatMember: jest.fn(),
    sendMessage: jest.fn(),
  };

  const actions = createMessageActions(message as any, bot as any);

  test('actions must be a object with three functions: banChatMember, deleteMessage and reply', () => {
    expect(typeof actions.banChatMember).toBe('function');
    expect(typeof actions.deleteMessage).toBe('function');
    expect(typeof actions.reply).toBe('function');
  });

  test('deleteMessage action should call bot.deleteMessage with right arguments', () => {
    if (!actions?.deleteMessage)
      throw new Error('actions.deleteMessage is not defined');
    actions.deleteMessage();
    expect(bot.deleteMessage).toHaveBeenCalledWith(
      message.chat.id,
      message.message_id
    );
  });

  test('banChatMember action should call bot.kickChatMember with right arguments', () => {
    const until = 9000;
    if (!actions?.banChatMember)
      throw new Error('actions.banChatMember is not defined');
    actions.banChatMember(until);
    expect(bot.kickChatMember).toHaveBeenCalledWith(
      message.chat.id,
      message.from.id,
      until
    );
  });

  test('reply action should call bot.sendMessage with right arguments', () => {
    const replyText = 'Hey!';

    actions.reply(replyText);
    expect(bot.sendMessage).toHaveBeenCalledWith(message.chat.id, replyText, {
      reply_to_message_id: message.message_id,
    });
  });
});

describe('createCallbackQuery action', () => {
  const cbkQuery = {
    id: 90,
    message: {
      chat: {
        id: 100,
      },
      from: {
        id: 110,
      },
      message_id: 120,
    },
  };

  const bot = {
    answerCallbackQuery: jest.fn(),
    deleteMessage: jest.fn(),
    editMessageReplyMarkup: jest.fn(),
    editMessageText: jest.fn(),
    kickChatMember: jest.fn(),
    sendMessage: jest.fn(),
  };

  const actions = createCallbackQueryActions(cbkQuery as any, bot as any);

  test('actions must provide all functions', () => {
    expect(typeof actions.answerQuery).toBe('function');
    expect(typeof actions.banChatMember).toBe('function');
    expect(typeof actions.deleteMessage).toBe('function');
    expect(typeof actions.editMessageReplyMarkup).toBe('function');
    expect(typeof actions.editMessageText).toBe('function');
  });

  test('answerQuery should call bot.answerCallbackQuery with right arguments', () => {
    const options = { text: 'Hey', show_alert: false };

    if (!actions?.answerQuery)
      throw new Error('actions.answerQuery is not defined');
    actions.answerQuery(options);
    expect(bot.answerCallbackQuery).toHaveBeenCalledWith(cbkQuery.id, options);
  });

  test('banChatMember action should call bot.kickChatMember with right arguments', () => {
    const until = 9000;
    if (!actions?.banChatMember)
      throw new Error('actions.banChatMember is not defined');
    actions.banChatMember(until);
    expect(bot.kickChatMember).toHaveBeenCalledWith(
      cbkQuery.message.chat.id,
      cbkQuery.message.from.id,
      until
    );
  });

  test('deleteMessage action should call bot.deleteMessage with right arguments', () => {
    if (!actions?.deleteMessage)
      throw new Error('actions.deleteMessage is not defined');
    actions.deleteMessage();
    expect(bot.deleteMessage).toHaveBeenCalledWith(
      cbkQuery.message.chat.id,
      cbkQuery.message.message_id
    );
  });

  test('editMessageReplyMarkup action should call bot.editMessageReplyMarkup with right arguments', () => {
    const markup = { inline_keyboard: [[{ text: 'Hi', callback_data: 'HI' }]] };

    if (!actions?.editMessageReplyMarkup)
      throw new Error('actions.editMessageReplyMarkup is not defined');
    actions.editMessageReplyMarkup(markup);
    expect(bot.editMessageReplyMarkup).toHaveBeenCalledWith({
      chat_id: cbkQuery.message.chat.id,
      message_id: cbkQuery.message.message_id,
      reply_markup: markup,
    });
  });

  test('editMessageText action should call bot.editMessageText with right arguments', () => {
    const editedText = '*edited message*';
    const options = { parse_mode: 'Markdown' };
    if (!actions?.editMessageText)
      throw new Error('actions.editMessageText is not defined');
    actions.editMessageText(editedText, options);
    expect(bot.editMessageText).toHaveBeenCalledWith(editedText, {
      ...options,
      chat_id: cbkQuery.message.chat.id,
      message_id: cbkQuery.message.message_id,
    });
  });
});
