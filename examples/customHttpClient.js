const { Bot } = require('../dist');

const BOT_TOKEN = '';
const chat_id = '';

const bot = new Bot({
  bot_token: BOT_TOKEN,
  createHttpClient: ({ baseURL }) => {
    return {
      // basic example. Won't work with file uploads
      post: async (methodName, body) => {
        const response = await fetch(`${baseURL}/${methodName}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        return { data };
      },
    };
  },
});

const { log } = console;

(async () => {
  log('Sending message');
  await bot.call('sendMessage', {
    chat_id,
    text: 'Hello, world!',
  });
})();
