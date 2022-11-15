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
    call: jest.fn(),
  };

  const actions = createMessageActions(message as any, bot as any);

  test('actions must be a object with three functions: banChatMember, deleteMessage and reply', () => {
    expect(typeof actions.banChatMember).toBe('function');
    expect(typeof actions.deleteMessage).toBe('function');
    expect(typeof actions.reply).toBe('function');
  });

  test('deleteMessage action should call bot.deleteMessage with right arguments', () => {
    if (!actions.deleteMessage)
      throw new Error('actions.deleteMessage is not defined');
    actions.deleteMessage();
    expect(bot.call).toHaveBeenCalledWith('deleteMessage', {
      chat_id: message.chat.id,
      message_id: message.message_id,
    });
  });

  test('banChatMember action should call bot.kickChatMember with right arguments', () => {
    const until_date = 9000;
    if (!actions.banChatMember)
      throw new Error('actions.banChatMember is not defined');
    actions.banChatMember(until_date);
    expect(bot.call).toHaveBeenCalledWith('banChatMember', {
      chat_id: message.chat.id,
      user_id: message.from.id,
      until_date,
    });
  });

  test('reply action should call bot.sendMessage with right arguments', () => {
    const replyText = 'Hey!';

    actions.reply({ text: replyText });
    expect(bot.call).toHaveBeenCalledWith('sendMessage', {
      chat_id: message.chat.id,
      text: replyText,
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
    call: jest.fn(),
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
    const options = {
      callback_query_id: cbkQuery.id,
      text: 'Hey',
      show_alert: false,
    };

    if (!actions.answerQuery)
      throw new Error('actions.answerQuery is not defined');
    actions.answerQuery(options);
    expect(bot.call).toHaveBeenCalledWith('answerCallbackQuery', {
      ...options,
    });
  });

  test('banChatMember action should call bot.kickChatMember with right arguments', () => {
    const until_date = 9000;
    if (!actions.banChatMember)
      throw new Error('actions.banChatMember is not defined');
    actions.banChatMember(until_date);
    expect(bot.call).toHaveBeenCalledWith('banChatMember', {
      chat_id: cbkQuery.message.chat.id,
      user_id: cbkQuery.message.from.id,
      until_date,
    });
  });

  test('deleteMessage action should call bot.deleteMessage with right arguments', () => {
    if (!actions.deleteMessage)
      throw new Error('actions.deleteMessage is not defined');
    actions.deleteMessage();
    expect(bot.call).toHaveBeenCalledWith('deleteMessage', {
      chat_id: cbkQuery.message.chat.id,
      message_id: cbkQuery.message.message_id,
    });
  });

  test('editMessageReplyMarkup action should call bot.editMessageReplyMarkup with right arguments', () => {
    const markup = { inline_keyboard: [[{ text: 'Hi', callback_data: 'HI' }]] };

    if (!actions.editMessageReplyMarkup)
      throw new Error('actions.editMessageReplyMarkup is not defined');
    actions.editMessageReplyMarkup(markup);
    expect(bot.call).toHaveBeenCalledWith('editMessageReplyMarkup', {
      chat_id: cbkQuery.message.chat.id,
      message_id: cbkQuery.message.message_id,
      reply_markup: markup,
    });
  });

  test('editMessageText action should call bot.editMessageText with right arguments', () => {
    const editedText = '*edited message*';
    const options = { parse_mode: 'Markdown' };
    if (!actions.editMessageText)
      throw new Error('actions.editMessageText is not defined');
    actions.editMessageText({
      text: editedText,
      ...options,
    });
    expect(bot.call).toHaveBeenCalledWith('editMessageText', {
      ...options,
      text: editedText,
      chat_id: cbkQuery.message.chat.id,
      message_id: cbkQuery.message.message_id,
    });
  });
});
