# Telegram Bot API for Node.js

Módulo escrito em Node.JS para interagir com a API oficial do Telegram [Telegram Bot API](https://core.telegram.org/bots/api).
Você precisará do seu próprio token, se você ainda não possui um, inicie uma conversa com [@botfather](https://telegram.me/BotFather) para criar um Bot.
Este pacote apenas implementa um WebHook que atenda às minhas necessidades, pois nenhum projeto que encontrei tinha o que eu precisava. O objeto `bot` e as funções de envio de mensagem, fotos, etc, é implementado por [yagop/node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api).

Instale:
```sh
npm install api-telegram-bot
```
E então use:
```js
var TelegramWebHook = require('api-telegram-bot');

const options = {
    token: YOUR_TOKEN,
    onlyFirstMatch: true,
    webhook: {
        port: process.env.PORT,
        path: '/webhook'
    }
};

const webhook = new TelegramWebHook(options);
const bot = webhook.bot;

// reply é um callback que facilita responder a mensagem recebida
webhook.on('text', (msg, reply)=>{
    reply('Hello');
});

webhook.onText(/^\/start/i, (msg, reply)=>{
    reply('Welcome!');
});
```

### Events
Toda vez que o webhook receber uma mensagem, ele emite um evento de acordo com o tipo de [mensagem](https://core.telegram.org/bots/api#message) recebida: `text`, `audio`, `document`, `photo`, `sticker`, `video`, `voice`, `contact`, `location`, `new_chat_participant`, `left_chat_participant`, `new_chat_title`, `new_chat_photo`, `delete_chat_photo`, `group_chat_created`.
Também é emitido um evento `message` sempre que uma mensagem é recebida, idependente do seu tipo.

O WebHook emite `callback_query` ao receber um [Callback Query](https://core.telegram.org/bots/api#callbackquery).
O WebHook emite `inline_query` ao receber um [Inline Query](https://core.telegram.org/bots/api#inlinequery) e emite um `chosen_inline_result` quando recebe um [ChosenInlineResult](https://core.telegram.org/bots/api#choseninlineresult). o WebHook também emite `channel_post` quando receber qualquer tipo de post em um `channel`.
Emite `edited_message` quando uma mensagem é editada.
* * *

### WebHooks

O Telegram funciona apenas com HTTPS, mas este bot inicialmente foi feito para funcionar em uma hospedagem atrás de um proxy HTTPS.
Suporte nativo à HTTPS será adicionado no futuro.

## API Reference
<a name="TelegramWebHook"></a>

## TelegramWebHook
TelegramWebHook

**Kind**: global class  

* [TelegramWebHook](#TelegramWebHook)
    * [new TelegramWebHook([options])](#new_TelegramWebHook_new)
    * [.onText([regex], callback)](#TelegramWebHook+onText)

<a name="new_TelegramWebHook_new"></a>

### new TelegramWebHook([options])
Construtor do WebHook, pooling não é suportado, apenas WebHook.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.token] | <code>String</code> |  | Bot Token |
| [options.onlyFirstMatch] | <code>Boolean</code> | <code>false</code> | Se true, apenas a primeira regex válida definida em onText() será executada. Se false, todas as válidas serão executadas. |
| [options.expressApp] | <code>Object</code> | <code>express()</code> | Objeto express personalizado |
| [options.webhook] | <code>Object</code> |  | Opções do WebHook |
| [options.webhook.port] | <code>Number</code> | <code>80</code> | Porta para o servidor http escutar |
| [options.webhook.path] | <code>String</code> | <code>&#x27;/&#x27;</code> | Path do WebHook |

<a name="TelegramWebHook+onText"></a>

### telegramWebHook.onText([regex], callback)
Define uma regex e uma callback que será executada quando uma mensagem cujo texto retornar true para regex.test()

**Kind**: instance method of <code>[TelegramWebHook](#TelegramWebHook)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [regex] | <code>RegExp</code> | Regex que testará a mensagem recebida. |
| callback | <code>function</code> | será chamada com dois parâmetros. O primeiro é a mensagem recebida, o segundo, é uma função `reply`. |

* * *