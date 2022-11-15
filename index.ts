import Bot from './src/Bot';

const bot = new Bot('token');

bot.call('getChat', 1000);
