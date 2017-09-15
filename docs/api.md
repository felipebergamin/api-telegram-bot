## Modules

<dl>
<dt><a href="#module_force_reply">force_reply</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#TelegramBotClient">TelegramBotClient</a></dt>
<dd><p>TelegramBotClient</p>
</dd>
<dt><a href="#InlineKeyboardMarkup">InlineKeyboardMarkup</a></dt>
<dd><p>{InlineKeyboardMarkup}</p>
</dd>
<dt><a href="#ReplyKeyboardMarkup">ReplyKeyboardMarkup</a></dt>
<dd><p>ReplyKeyboardMarkup</p>
</dd>
<dt><a href="#ReplyKeyboardRemove">ReplyKeyboardRemove</a></dt>
<dd><p>{ReplyKeyboardRemove}</p>
</dd>
<dt><a href="#InlineKeyboardButton">InlineKeyboardButton</a></dt>
<dd><p>{InlineKeyboardButton}</p>
</dd>
<dt><a href="#KeyboardButton">KeyboardButton</a></dt>
<dd><p>{KeyboardButton}</p>
</dd>
</dl>

<a name="module_force_reply"></a>

## force_reply
<a name="TelegramBotClient"></a>

## TelegramBotClient
TelegramBotClient

**Kind**: global class  
**See**: [https://www.npmjs.com/package/node-emoji](https://www.npmjs.com/package/node-emoji)  

* [TelegramBotClient](#TelegramBotClient)
    * [new TelegramBotClient(token, [config])](#new_TelegramBotClient_new)
    * [.InlineKeyboardMarkup](#TelegramBotClient+InlineKeyboardMarkup) : <code>[InlineKeyboardMarkup](#InlineKeyboardMarkup)</code>
    * [.ReplyKeyboardMarkup](#TelegramBotClient+ReplyKeyboardMarkup) : <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>
    * [.ReplyKeyboardRemove](#TelegramBotClient+ReplyKeyboardRemove) : <code>[ReplyKeyboardRemove](#ReplyKeyboardRemove)</code>
    * [.ForceReply](#TelegramBotClient+ForceReply) : <code>force_reply</code>
    * [.createWebhook(config, [expressApp])](#TelegramBotClient+createWebhook)
    * [.onRegex(regex, callback)](#TelegramBotClient+onRegex)
    * [.getMe()](#TelegramBotClient+getMe) ⇒ <code>Promise</code>
    * [.sendMessage(chat_id, text, [optionals])](#TelegramBotClient+sendMessage) ⇒ <code>Promise</code>
    * [.forwardMessage(chat_id, from_chat_id, message_id, [optionals])](#TelegramBotClient+forwardMessage) ⇒ <code>Promise</code>
    * [.sendPhoto(chat_id, photo, [optionals])](#TelegramBotClient+sendPhoto) ⇒ <code>Promise</code>
    * [.sendAudio(chat_id, audio, [optionals])](#TelegramBotClient+sendAudio) ⇒ <code>Promise</code>
    * [.sendDocument(chat_id, document, [optionals])](#TelegramBotClient+sendDocument) ⇒ <code>Promise</code>
    * [.sendSticker(chat_id, sticker, [optionals])](#TelegramBotClient+sendSticker) ⇒ <code>Promise</code>
    * [.sendVideo(chat_id, video, [optionals])](#TelegramBotClient+sendVideo) ⇒ <code>Promise</code>
    * [.sendVoice(chat_id, voice, [optionals])](#TelegramBotClient+sendVoice) ⇒ <code>Promise</code>
    * [.sendLocation(chat_id, latitude, longitude, [optionals])](#TelegramBotClient+sendLocation) ⇒ <code>Promise</code>
    * [.sendVenue(chat_id, latitude, longitude, title, address, [optionals])](#TelegramBotClient+sendVenue) ⇒ <code>Promise</code>
    * [.sendContact(chat_id, phone_number, first_name, [optionals])](#TelegramBotClient+sendContact) ⇒ <code>Promise</code>
    * [.sendChatAction(chat_id, action)](#TelegramBotClient+sendChatAction) ⇒ <code>Promise</code>
    * [.getUserProfilePhotos(user_id, [optionals])](#TelegramBotClient+getUserProfilePhotos) ⇒ <code>Promise</code>
    * [.getFile(file_id)](#TelegramBotClient+getFile) ⇒ <code>Promise</code>
    * [.kickChatMember(chat_id, user_id)](#TelegramBotClient+kickChatMember) ⇒ <code>Promise</code>
    * [.leaveChat(chat_id)](#TelegramBotClient+leaveChat) ⇒ <code>Promise</code>
    * [.unbanChatMember(chat_id, user_id)](#TelegramBotClient+unbanChatMember) ⇒ <code>Promise</code>
    * [.getChat(chat_id)](#TelegramBotClient+getChat) ⇒ <code>Promise</code>
    * [.getChatAdministrators(chat_id)](#TelegramBotClient+getChatAdministrators) ⇒ <code>Promise</code>
    * [.getChatMembersCount(chat_id)](#TelegramBotClient+getChatMembersCount) ⇒ <code>Promise</code>
    * [.getChatMember(chat_id, user_id)](#TelegramBotClient+getChatMember) ⇒ <code>Promise</code>
    * [.answerCallbackQuery(callback_query_id, [optionals])](#TelegramBotClient+answerCallbackQuery) ⇒ <code>Promise</code>
    * [.editMessageText(text, [optionals])](#TelegramBotClient+editMessageText) ⇒ <code>Promise</code>
    * [.editMessageCaption(optionals)](#TelegramBotClient+editMessageCaption) ⇒ <code>Promise</code>
    * [.editMessageReplyMarkup(optionals)](#TelegramBotClient+editMessageReplyMarkup) ⇒ <code>Promise</code>
    * [.answerInlineQuery(inline_query_id, results, optionals)](#TelegramBotClient+answerInlineQuery) ⇒ <code>Promise</code>
    * [.sendGame(chat_id, game_short_name, [optionals])](#TelegramBotClient+sendGame) ⇒ <code>Promise</code>
    * [.setGameScore(user_id, score, [optionals])](#TelegramBotClient+setGameScore) ⇒ <code>Promise</code>
    * [.getGameHighScores(user_id, [optionals])](#TelegramBotClient+getGameHighScores) ⇒ <code>Promise</code>
    * [.getUpdates([optionals])](#TelegramBotClient+getUpdates) ⇒ <code>Promise</code>
    * [.setWebhook(url, [optionals])](#TelegramBotClient+setWebhook) ⇒ <code>Promise</code>
    * [.deleteWebhook()](#TelegramBotClient+deleteWebhook) ⇒ <code>Promise</code>
    * [.getWebhookInfo()](#TelegramBotClient+getWebhookInfo) ⇒ <code>Promise</code>
    * [.deleteMessage(chat_id, message_id)](#TelegramBotClient+deleteMessage) ⇒ <code>Promise</code>
    * [.restrictChatMember(chat_id, user_id, options)](#TelegramBotClient+restrictChatMember) ⇒ <code>Promise</code>
    * [.promoteChatMember(chat_id, user_id, options)](#TelegramBotClient+promoteChatMember) ⇒ <code>Promise</code>
    * [.exportChatInviteLink(chat_id)](#TelegramBotClient+exportChatInviteLink) ⇒ <code>Promise</code>
    * [.setChatPhoto(chat_id, photo)](#TelegramBotClient+setChatPhoto) ⇒ <code>Promise</code>
    * [.deleteChatPhoto(chat_id)](#TelegramBotClient+deleteChatPhoto) ⇒ <code>Promise</code>
    * [.setChatTitle(chat_id, title)](#TelegramBotClient+setChatTitle) ⇒ <code>Promise</code>
    * [.setChatDescription(chat_id, description)](#TelegramBotClient+setChatDescription) ⇒ <code>Promise</code>
    * [.pinChatMessage(chat_id, message_id, disable_notification)](#TelegramBotClient+pinChatMessage) ⇒ <code>Promise</code>
    * [.unpinChatMessage(chat_id)](#TelegramBotClient+unpinChatMessage) ⇒ <code>Promise</code>

<a name="new_TelegramBotClient_new"></a>

### new TelegramBotClient(token, [config])
Constructs bot client


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>String</code> |  | Bot token |
| [config] | <code>object</code> | <code>{}</code> | Optional config object. See default configuration below |
| [config.onlyFirstRegexMatch] | <code>boolean</code> | <code>true</code> | `true` for execute only first callback whose RegExp returns true. `false` will execute all matches. (see .onRegex()) |
| [config.split_long_messages] | <code>boolean</code> | <code>false</code> | Telegram messages can't be longer than 4096 chars, if `true`, the sendMessage function will split long messages and send sequentially |
| [config.emojify_texts] | <code>boolean</code> | <code>false</code> | `true` if you want the bot automatically call [emoji.emojify](https://www.npmjs.com/package/node-emoji) in texts |

<a name="TelegramBotClient+InlineKeyboardMarkup"></a>

### telegramBotClient.InlineKeyboardMarkup : <code>[InlineKeyboardMarkup](#InlineKeyboardMarkup)</code>
**Kind**: instance property of <code>[TelegramBotClient](#TelegramBotClient)</code>  
<a name="TelegramBotClient+ReplyKeyboardMarkup"></a>

### telegramBotClient.ReplyKeyboardMarkup : <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>
**Kind**: instance property of <code>[TelegramBotClient](#TelegramBotClient)</code>  
<a name="TelegramBotClient+ReplyKeyboardRemove"></a>

### telegramBotClient.ReplyKeyboardRemove : <code>[ReplyKeyboardRemove](#ReplyKeyboardRemove)</code>
**Kind**: instance property of <code>[TelegramBotClient](#TelegramBotClient)</code>  
<a name="TelegramBotClient+ForceReply"></a>

### telegramBotClient.ForceReply : <code>force_reply</code>
**Kind**: instance property of <code>[TelegramBotClient](#TelegramBotClient)</code>  
<a name="TelegramBotClient+createWebhook"></a>

### telegramBotClient.createWebhook(config, [expressApp])
Create Webhook

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Configuration object |
| config.path | <code>String</code> | <code>&#x27;/&lt;bot_token&gt;&#x27;</code> | Path for webhook listen on |
| config.port | <code>Number</code> | <code>80</code> | Port for http server listen |
| [expressApp] | <code>Express</code> |  | Optional. Personal express app. You must set bodyparser middleware by yourself for webhook works. |

<a name="TelegramBotClient+onRegex"></a>

### telegramBotClient.onRegex(regex, callback)
Set a regex that will test every text message received. If regex.test() returns true, callback is called with two arguments: the message received and reply callback.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  

| Param | Type | Description |
| --- | --- | --- |
| regex | <code>RegExp</code> | RegExp for test message text |
| callback | <code>function</code> | Callback to call if regex.test() return true |

<a name="TelegramBotClient+getMe"></a>

### telegramBotClient.getMe() ⇒ <code>Promise</code>
Requires no parameters. Returns basic information about the bot in form of a `User` object.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getme](https://core.telegram.org/bots/api#getme)  
<a name="TelegramBotClient+sendMessage"></a>

### telegramBotClient.sendMessage(chat_id, text, [optionals]) ⇒ <code>Promise</code>
Send a simple text message.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendmessage](https://core.telegram.org/bots/api#sendmessage)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| text | <code>String</code> | Text to be sent. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.parse_mode] | <code>String</code> | Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message. |
| [optionals.disable_web_page_preview] | <code>boolean</code> | Disables link previews for links in this message |
| [optionals.disable_notification] | <code>boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message. |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+forwardMessage"></a>

### telegramBotClient.forwardMessage(chat_id, from_chat_id, message_id, [optionals]) ⇒ <code>Promise</code>
Use this method to forward messages of any kind.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#forwardmessage](https://core.telegram.org/bots/api#forwardmessage)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| from_chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the chat where the original message was sent. |
| message_id | <code>Integer</code> | Message identifier in the chat specified in from_chat_id |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |

<a name="TelegramBotClient+sendPhoto"></a>

### telegramBotClient.sendPhoto(chat_id, photo, [optionals]) ⇒ <code>Promise</code>
Use this method to send photos.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendphoto](https://core.telegram.org/bots/api#sendphoto)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| photo | <code>ReadStream</code> &#124; <code>String</code> | Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or pass read stream to upload your own file. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.caption] | <code>String</code> | Photo caption (may also be used when resending photos by file_id), 0-200 characters |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message. |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendAudio"></a>

### telegramBotClient.sendAudio(chat_id, audio, [optionals]) ⇒ <code>Promise</code>
Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendaudio](https://core.telegram.org/bots/api#sendaudio)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| audio | <code>ReadStream</code> &#124; <code>String</code> | Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or pass a read stream for upload your own. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.caption] | <code>String</code> | Audio caption, 0-200 characters |
| [optionals.duration] | <code>Integer</code> | Duration of the audio in seconds. |
| [optionals.performer] | <code>String</code> | Performer |
| [optionals.title] | <code>String</code> | Track name |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message. |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendDocument"></a>

### telegramBotClient.sendDocument(chat_id, document, [optionals]) ⇒ <code>Promise</code>
Use this method to send general files.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#senddocument](https://core.telegram.org/bots/api#senddocument)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| document | <code>ReadStream</code> &#124; <code>String</code> | File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing an read stream for file. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.caption] | <code>String</code> | Document caption (may also be used when resending documents by file_id), 0-200 characters. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendSticker"></a>

### telegramBotClient.sendSticker(chat_id, sticker, [optionals]) ⇒ <code>Promise</code>
Use this method to send .webp stickers

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendsticker](https://core.telegram.org/bots/api#sendsticker)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| sticker | <code>ReadStream</code> &#124; <code>String</code> | Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .webp file from the Internet, or upload a new one passing a Read Stream for file. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendVideo"></a>

### telegramBotClient.sendVideo(chat_id, video, [optionals]) ⇒ <code>Promise</code>
Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document).

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendvideo](https://core.telegram.org/bots/api#sendvideo)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| video | <code>ReadStream</code> &#124; <code>String</code> | Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video passing a read stream. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.duration] | <code>Integer</code> | Duration of sent video in seconds |
| [optionals.width] | <code>Integer</code> | Video width |
| [optionals.height] | <code>Integer</code> | Video height |
| [optionals.caption] | <code>String</code> | Video caption (may also be used when resending videos by file_id), 0-200 characters |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendVoice"></a>

### telegramBotClient.sendVoice(chat_id, voice, [optionals]) ⇒ <code>Promise</code>
Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document).

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendvoice](https://core.telegram.org/bots/api#sendvoice)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| voice | <code>ReadStream</code> &#124; <code>String</code> | Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing a read stream. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.caption] | <code>String</code> | Voice message caption, 0-200 characters |
| [optionals.duration] | <code>Integer</code> | Duration of the voice message in seconds |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendLocation"></a>

### telegramBotClient.sendLocation(chat_id, latitude, longitude, [optionals]) ⇒ <code>Promise</code>
Use this method to send point on the map.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendlocation](https://core.telegram.org/bots/api#sendlocation)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| latitude | <code>Float</code> | Latitude of location |
| longitude | <code>FLoat</code> | Longitude of location |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendVenue"></a>

### telegramBotClient.sendVenue(chat_id, latitude, longitude, title, address, [optionals]) ⇒ <code>Promise</code>
Use this method to send information about a venue.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendvenue](https://core.telegram.org/bots/api#sendvenue)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel. |
| latitude | <code>Float</code> | Latitude of location |
| longitude | <code>FLoat</code> | Longitude of location |
| title | <code>String</code> | Name of the venue |
| address | <code>String</code> | Address of the venue |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.foursquare_id] | <code>String</code> | Foursquare identifier of the venue |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendContact"></a>

### telegramBotClient.sendContact(chat_id, phone_number, first_name, [optionals]) ⇒ <code>Promise</code>
Use this method to send phone contacts.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendcontact](https://core.telegram.org/bots/api#sendcontact)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| phone_number | <code>String</code> | Contact's phone number |
| first_name | <code>String</code> | Contact's first name |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.last_name] | <code>String</code> | Contact's last name |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. |

<a name="TelegramBotClient+sendChatAction"></a>

### telegramBotClient.sendChatAction(chat_id, action) ⇒ <code>Promise</code>
Attention: the sendMessage, sendPhoto, sendDocument, sendAudio and sendVideo methods automatically sends their repective chat actions before send data.
Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendchataction](https://core.telegram.org/bots/api#sendchataction)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| action | <code>String</code> | Type of action to broadcast. Choose one, depending on what the user is about to receive: `typing` for text messages, `upload_photo` for photos, `record_video` or `upload_video` for videos, `record_audio` or `upload_audio` for audio files, `upload_document` for general files, `find_location` for location data. |

<a name="TelegramBotClient+getUserProfilePhotos"></a>

### telegramBotClient.getUserProfilePhotos(user_id, [optionals]) ⇒ <code>Promise</code>
Use this method to get a list of profile pictures for a user.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getuserprofilephotos](https://core.telegram.org/bots/api#getuserprofilephotos)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| user_id | <code>Integer</code> &#124; <code>String</code> |  | Unique identifier of the target user |
| [optionals] | <code>Object</code> |  | An object with optional params that you want to send in request. |
| [optionals.offset] | <code>Integer</code> |  | Sequential number of the first photo to be returned. By default, all photos are returned. |
| [optionals.limit] | <code>Integer</code> | <code>100</code> | Limits the number of photos to be retrieved. Values between 1—100 are accepted. |

<a name="TelegramBotClient+getFile"></a>

### telegramBotClient.getFile(file_id) ⇒ <code>Promise</code>
Use this method to get basic info about a file and prepare it for downloading. 
The file can then be downloaded via the link 
`https://api.telegram.org/file/bot<token>/<file_path>`,
where `<file_path>` is taken from the response. 
It is guaranteed that the link will be valid for at least 1 hour. 
When the link expires, a new one can be requested by calling getFile again.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getfile](https://core.telegram.org/bots/api#getfile)  

| Param | Type | Description |
| --- | --- | --- |
| file_id | <code>Integer</code> | File identifier to get info about |

<a name="TelegramBotClient+kickChatMember"></a>

### telegramBotClient.kickChatMember(chat_id, user_id) ⇒ <code>Promise</code>
Use this method to kick a user from a group or a supergroup.
In the case of supergroups, the user will not be able to return to the
group on their own using invite links, etc., unless unbanned first.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#kickchatmember](https://core.telegram.org/bots/api#kickchatmember)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> | Unique identifier for the target group or username of the target supergroup |
| user_id | <code>Integer</code> | Unique identifier of the target user |

<a name="TelegramBotClient+leaveChat"></a>

### telegramBotClient.leaveChat(chat_id) ⇒ <code>Promise</code>
Use this method for your bot to leave a group, supergroup or channel.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#leavechat](https://core.telegram.org/bots/api#leavechat)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target supergroup or channel |

<a name="TelegramBotClient+unbanChatMember"></a>

### telegramBotClient.unbanChatMember(chat_id, user_id) ⇒ <code>Promise</code>
Use this method to unban a previously kicked user in a supergroup.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#unbanchatmember](https://core.telegram.org/bots/api#unbanchatmember)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target group or username of the target supergroup |
| user_id | <code>Integer</code> | Unique identifier of the target user |

<a name="TelegramBotClient+getChat"></a>

### telegramBotClient.getChat(chat_id) ⇒ <code>Promise</code>
Use this method to get up to date information about the chat

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#unbanchatmember](https://core.telegram.org/bots/api#unbanchatmember)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target supergroup or channel |

<a name="TelegramBotClient+getChatAdministrators"></a>

### telegramBotClient.getChatAdministrators(chat_id) ⇒ <code>Promise</code>
Use this method to get a list of administrators in a chat.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getchatadministrators](https://core.telegram.org/bots/api#getchatadministrators)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target supergroup or channel |

<a name="TelegramBotClient+getChatMembersCount"></a>

### telegramBotClient.getChatMembersCount(chat_id) ⇒ <code>Promise</code>
Use this method to get the number of members in a chat.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getchatmemberscount](https://core.telegram.org/bots/api#getchatmemberscount)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target supergroup or channel |

<a name="TelegramBotClient+getChatMember"></a>

### telegramBotClient.getChatMember(chat_id, user_id) ⇒ <code>Promise</code>
Use this method to get information about a member of a chat.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getchatmember](https://core.telegram.org/bots/api#getchatmember)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target supergroup or channel |
| user_id | <code>Integer</code> | Unique identifier of the target user |

<a name="TelegramBotClient+answerCallbackQuery"></a>

### telegramBotClient.answerCallbackQuery(callback_query_id, [optionals]) ⇒ <code>Promise</code>
Use this method to send answers to callback queries sent from inline keyboards.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#answercallbackquery](https://core.telegram.org/bots/api#answercallbackquery)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback_query_id | <code>String</code> |  | Unique identifier for the query to be answered |
| [optionals] | <code>Object</code> |  | An object with optional params that you want to send in request. |
| [optionals.text] | <code>String</code> |  | Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters |
| [optionals.show_alert] | <code>Boolean</code> | <code>false</code> | If true, an alert will be shown by the client instead of a notification at the top of the chat screen. |
| [optionals.url] | <code>String</code> |  | URL that will be opened by the user's client. |
| [optionals.cache_time] | <code>Integer</code> | <code>0</code> | The maximum amount of time in seconds that the result of the callback query may be cached client-side. |

<a name="TelegramBotClient+editMessageText"></a>

### telegramBotClient.editMessageText(text, [optionals]) ⇒ <code>Promise</code>
Use this method to edit text and game messages sent by the bot or via the bot (for inline bots).

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#editmessagetext](https://core.telegram.org/bots/api#editmessagetext)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | New text of the message |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.chat_id] | <code>Integer</code> &#124; <code>String</code> | Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel |
| [optionals.message_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Identifier of the sent message |
| [optionals.inline_message_id] | <code>String</code> | Required if `chat_id` and `message_id` are not specified. Identifier of the inline message. |
| [optionals.parse_mode] | <code>String</code> | Send Markdown or HTML. |
| [optionals.disable_web_page_preview] | <code>Boolean</code> | Disables link previews for links in this message |
| [optionals.reply_markup] | <code>Object</code> | A JSON-serialized object for an inline keyboard. |

<a name="TelegramBotClient+editMessageCaption"></a>

### telegramBotClient.editMessageCaption(optionals) ⇒ <code>Promise</code>
Use this method to edit captions of messages sent by the bot or via the bot (for inline bots).

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#editmessagecaption](https://core.telegram.org/bots/api#editmessagecaption)  

| Param | Type | Description |
| --- | --- | --- |
| optionals | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.chat_id] | <code>Integer</code> &#124; <code>String</code> | Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel. |
| [optionals.message_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Identifier of the sent message |
| [optionals.inline_message_id] | <code>String</code> | Required if `chat_id` and `message_id` are not specified. Identifier of the inline message |
| [optionals.caption] | <code>String</code> | New caption of the message |
| [optionals.reply_markup] | <code>String</code> | A JSON-serialized object for an inline keyboard. |

<a name="TelegramBotClient+editMessageReplyMarkup"></a>

### telegramBotClient.editMessageReplyMarkup(optionals) ⇒ <code>Promise</code>
Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots)

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#editmessagereplymarkup](https://core.telegram.org/bots/api#editmessagereplymarkup)  

| Param | Type | Description |
| --- | --- | --- |
| optionals | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.chat_id] | <code>Integer</code> &#124; <code>String</code> | Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel |
| [optionals.message_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Identifier of the sent message |
| [optioanls.inline_message_id] | <code>String</code> | Required if `chat_id` and `message_id` are not specified. Identifier of the inline message |
| [optionals.reply_markup] | <code>Object</code> | A JSON-serialized object for an inline keyboard. |

<a name="TelegramBotClient+answerInlineQuery"></a>

### telegramBotClient.answerInlineQuery(inline_query_id, results, optionals) ⇒ <code>Promise</code>
Use this method to send answers to an inline query.
No more than 50 results per query are allowed.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#answerinlinequery](https://core.telegram.org/bots/api#answerinlinequery)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| inline_query_id | <code>String</code> |  | Unique identifier for the answered query |
| results | <code>Array</code> |  | A JSON-serialized array of [results](https://core.telegram.org/bots/api#inlinequeryresult) for the inline query |
| optionals | <code>Object</code> |  | An object with optional params that you want to send in request. |
| [optionals.cache_time] | <code>Integer</code> | <code>300</code> | The maximum amount of time in seconds that the result of the inline query may be cached on the server. |
| [optionals.is_personal] | <code>Boolean</code> |  | Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query |
| [optionals.next_offset] | <code>String</code> |  | Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. |
| [optionals.switch_pm_text] | <code>String</code> |  | If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter |
| [optionals.switch_pm_parameter] | <code>String</code> |  | Parameter for the start message sent to the bot when user presses the switch button |

<a name="TelegramBotClient+sendGame"></a>

### telegramBotClient.sendGame(chat_id, game_short_name, [optionals]) ⇒ <code>Promise</code>
Use this method to send a game.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#sendgame](https://core.telegram.org/bots/api#sendgame)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> | Unique identifier for the target chat |
| game_short_name | <code>String</code> | Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather. |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.disable_notification] | <code>Boolean</code> | Sends the message silently. |
| [optionals.reply_to_message_id] | <code>Integer</code> | If the message is a reply, ID of the original message |
| [optionals.reply_markup] | <code>Object</code> | A JSON-serialized object for an inline keyboard. |

<a name="TelegramBotClient+setGameScore"></a>

### telegramBotClient.setGameScore(user_id, score, [optionals]) ⇒ <code>Promise</code>
Use this method to set the score of the specified user in a game.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#setgamescore](https://core.telegram.org/bots/api#setgamescore)  

| Param | Type | Description |
| --- | --- | --- |
| user_id | <code>Integer</code> | User identifier |
| score | <code>Integer</code> | New score, must be non-negative |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.force] | <code>Boolean</code> | Pass True, if the high score is allowed to decrease. |
| [optionals.disable_edit_message] | <code>Boolean</code> | Pass True, if the game message should not be automatically edited to include the current scoreboard |
| [optionals.chat_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Unique identifier for the target chat |
| [optionals.message_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Identifier of the sent message |
| [optionals.inline_message_id] | <code>String</code> | Required if `chat_id` and `message_id` are not specified. Identifier of the inline message |

<a name="TelegramBotClient+getGameHighScores"></a>

### telegramBotClient.getGameHighScores(user_id, [optionals]) ⇒ <code>Promise</code>
Use this method to get data for high score tables.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getgamehighscores](https://core.telegram.org/bots/api#getgamehighscores)  

| Param | Type | Description |
| --- | --- | --- |
| user_id | <code>Integer</code> | Target user id |
| [optionals] | <code>Object</code> | An object with optional params that you want to send in request. |
| [optionals.chat_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Unique identifier for the target chat |
| [optionals.message_id] | <code>Integer</code> | Required if `inline_message_id` is not specified. Identifier of the sent message |
| [optionals.inline_message_id] | <code>String</code> | Required if chat_id and message_id are not specified. Identifier of the inline message |

<a name="TelegramBotClient+getUpdates"></a>

### telegramBotClient.getUpdates([optionals]) ⇒ <code>Promise</code>
Use this method to receive incoming updates using long polling.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#getupdates](https://core.telegram.org/bots/api#getupdates)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [optionals] | <code>Object</code> |  | An object with optional params that you want to send in request. |
| [optionals.offset] | <code>Integer</code> |  | Identifier of the first update to be returned. |
| [optionals.limit] | <code>Integer</code> | <code>100</code> | Limits the number of updates to be retrieved. Values between 1—100 are accepted. |
| [optionals.timeout] | <code>Integer</code> |  | Timeout in seconds for long polling. |
| [optionals.allowed_updates] | <code>Array</code> |  | List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. |

<a name="TelegramBotClient+setWebhook"></a>

### telegramBotClient.setWebhook(url, [optionals]) ⇒ <code>Promise</code>
Use this method to specify a url and receive incoming updates via an outgoing webhook.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#setwebhook](https://core.telegram.org/bots/api#setwebhook)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | HTTPS url to send updates to. Use an empty string to remove webhook integration |
| [optionals] | <code>Object</code> |  | An object with optional params that you want to send in request. |
| [optionals.certificate] | <code>ReadStrem</code> |  | Upload your public key certificate so that the root certificate in use can be checked. |
| [optionals.max_connections] | <code>Integer</code> | <code>40</code> | Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. |
| [optionals.allowed_updates] | <code>Array</code> |  | List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. |

<a name="TelegramBotClient+deleteWebhook"></a>

### telegramBotClient.deleteWebhook() ⇒ <code>Promise</code>
Use this method to remove webhook integration if you decide to switch back to getUpdates. Requires no parameters.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#deletewebhook](https://core.telegram.org/bots/api#deletewebhook)  
<a name="TelegramBotClient+getWebhookInfo"></a>

### telegramBotClient.getWebhookInfo() ⇒ <code>Promise</code>
Use this method to get current webhook status. Requires no parameters.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#deletewebhook](https://core.telegram.org/bots/api#deletewebhook)  
<a name="TelegramBotClient+deleteMessage"></a>

### telegramBotClient.deleteMessage(chat_id, message_id) ⇒ <code>Promise</code>
Use this method to delete a message, including service messages

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#deletemessage](https://core.telegram.org/bots/api#deletemessage)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| message_id | <code>Integer</code> &#124; <code>String</code> | Identifier of the message to delete |

<a name="TelegramBotClient+restrictChatMember"></a>

### telegramBotClient.restrictChatMember(chat_id, user_id, options) ⇒ <code>Promise</code>
**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#restrictchatmember](https://core.telegram.org/bots/api#restrictchatmember)  

| Param | Type |
| --- | --- |
| chat_id | <code>String</code> &#124; <code>Integer</code> | 
| user_id | <code>String</code> &#124; <code>Integer</code> | 
| options | <code>Object</code> | 
| options.until_date | <code>Integer</code> | 
| options.can_send_messages | <code>Boolean</code> | 
| options.can_send_media_messages | <code>Boolean</code> | 
| options.can_send_other_messages | <code>Boolean</code> | 
| options.can_add_web_page_previews | <code>Boolean</code> | 

<a name="TelegramBotClient+promoteChatMember"></a>

### telegramBotClient.promoteChatMember(chat_id, user_id, options) ⇒ <code>Promise</code>
Use this method to promote or demote a user in a supergroup or a channel.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#promotechatmember](https://core.telegram.org/bots/api#promotechatmember)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| user_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier of the target user |
| options | <code>object</code> |  |
| options.can_change_infoPass | <code>Boolean</code> | True, if the administrator can change chat title, photo and other settings |
| options.can_post_messagesPass | <code>Boolean</code> | True, if the administrator can create channel posts, channels only |
| options.can_edit_messages | <code>Boolean</code> | Pass True, if the administrator can edit messages of other users, channels only |
| options.can_delete_messages | <code>Boolean</code> | Pass True, if the administrator can delete messages of other users |
| options.can_invite_users | <code>Boolean</code> | Pass True, if the administrator can invite new users to the chat |
| options.can_restrict_members | <code>Boolean</code> | Pass True, if the administrator can restrict, ban or unban chat members |
| options.can_pin_messages | <code>Boolean</code> | Pass True, if the administrator can pin messages, supergroups only |
| options.can_promote_members | <code>Boolean</code> | Pass True, if the administrator can add new administrators with a subset of his own privileges |

<a name="TelegramBotClient+exportChatInviteLink"></a>

### telegramBotClient.exportChatInviteLink(chat_id) ⇒ <code>Promise</code>
Use this method to export an invite link to a supergroup or a channel.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#exportchatinvitelink](https://core.telegram.org/bots/api#exportchatinvitelink)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |

<a name="TelegramBotClient+setChatPhoto"></a>

### telegramBotClient.setChatPhoto(chat_id, photo) ⇒ <code>Promise</code>
Use this method to set a new profile photo for the chat.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#setchatphoto](https://core.telegram.org/bots/api#setchatphoto)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| photo | <code>ReadStream</code> | New chat photo. |

<a name="TelegramBotClient+deleteChatPhoto"></a>

### telegramBotClient.deleteChatPhoto(chat_id) ⇒ <code>Promise</code>
Use this method to delete a chat photo

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#deletechatphoto](https://core.telegram.org/bots/api#deletechatphoto)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |

<a name="TelegramBotClient+setChatTitle"></a>

### telegramBotClient.setChatTitle(chat_id, title) ⇒ <code>Promise</code>
Use this method to change the title of a chat.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#setchattitle](https://core.telegram.org/bots/api#setchattitle)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| title | <code>String</code> | New chat title, 1-255 characters |

<a name="TelegramBotClient+setChatDescription"></a>

### telegramBotClient.setChatDescription(chat_id, description) ⇒ <code>Promise</code>
Use this method to change the description of a supergroup or a channel.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#setchatdescription](https://core.telegram.org/bots/api#setchatdescription)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target channel |
| description | <code>String</code> | New chat description, 0-255 characters |

<a name="TelegramBotClient+pinChatMessage"></a>

### telegramBotClient.pinChatMessage(chat_id, message_id, disable_notification) ⇒ <code>Promise</code>
Use this method to pin a message in a supergroup.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#pinchatmessage](https://core.telegram.org/bots/api#pinchatmessage)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> |  | Unique identifier for the target chat or username of the target supergroup |
| message_id | <code>Integer</code> &#124; <code>String</code> |  | Identifier of a message to pin |
| disable_notification | <code>Boolean</code> | <code>false</code> | Pass True, if it is not necessary to send a notification to all group members about the new pinned message. Default false |

<a name="TelegramBotClient+unpinChatMessage"></a>

### telegramBotClient.unpinChatMessage(chat_id) ⇒ <code>Promise</code>
Use this method to unpin a message in a supergroup chat.

**Kind**: instance method of <code>[TelegramBotClient](#TelegramBotClient)</code>  
**See**: [https://core.telegram.org/bots/api#unpinchatmessage](https://core.telegram.org/bots/api#unpinchatmessage)  

| Param | Type | Description |
| --- | --- | --- |
| chat_id | <code>Integer</code> &#124; <code>String</code> | Unique identifier for the target chat or username of the target supergroup |

<a name="InlineKeyboardMarkup"></a>

## InlineKeyboardMarkup
{InlineKeyboardMarkup}

**Kind**: global class  
**See**: [https://core.telegram.org/bots/api#inlinekeyboardmarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup)  

* [InlineKeyboardMarkup](#InlineKeyboardMarkup)
    * _instance_
        * [.appendRow()](#InlineKeyboardMarkup+appendRow) ↩︎
        * [.addButton(button)](#InlineKeyboardMarkup+addButton) ↩︎
        * [.distributeButtonsInRows(array_btn, [maxButtonsInRow])](#InlineKeyboardMarkup+distributeButtonsInRows) ↩︎
    * _static_
        * [.InlineKeyboardButton](#InlineKeyboardMarkup.InlineKeyboardButton) : <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>

<a name="InlineKeyboardMarkup+appendRow"></a>

### inlineKeyboardMarkup.appendRow() ↩︎
Append a new row to keyboard. New buttons will be added on new row.

**Kind**: instance method of <code>[InlineKeyboardMarkup](#InlineKeyboardMarkup)</code>  
**Chainable**  
<a name="InlineKeyboardMarkup+addButton"></a>

### inlineKeyboardMarkup.addButton(button) ↩︎
Add a new button on last row

**Kind**: instance method of <code>[InlineKeyboardMarkup](#InlineKeyboardMarkup)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>[InlineKeyboardButton](#InlineKeyboardButton)</code> | The button object |

<a name="InlineKeyboardMarkup+distributeButtonsInRows"></a>

### inlineKeyboardMarkup.distributeButtonsInRows(array_btn, [maxButtonsInRow]) ↩︎
Distribute an array of Buttons in rows, respecting a limit of buttons for each row

**Kind**: instance method of <code>[InlineKeyboardMarkup](#InlineKeyboardMarkup)</code>  
**Chainable**  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| array_btn | <code>Array</code> |  | The array of InlineKeyboardButton |
| [maxButtonsInRow] | <code>Number</code> | <code>1</code> | Max buttons allowed on each row |

<a name="InlineKeyboardMarkup.InlineKeyboardButton"></a>

### InlineKeyboardMarkup.InlineKeyboardButton : <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>
**Kind**: static property of <code>[InlineKeyboardMarkup](#InlineKeyboardMarkup)</code>  
<a name="ReplyKeyboardMarkup"></a>

## ReplyKeyboardMarkup
ReplyKeyboardMarkup

**Kind**: global class  
**See**: [https://core.telegram.org/bots/api#replykeyboardmarkup](https://core.telegram.org/bots/api#replykeyboardmarkup)  

* [ReplyKeyboardMarkup](#ReplyKeyboardMarkup)
    * _instance_
        * [.setResizeKeyboard(resize_keyboard)](#ReplyKeyboardMarkup+setResizeKeyboard) ↩︎
        * [.setOneTimeKeyboard(one_time_keyboard)](#ReplyKeyboardMarkup+setOneTimeKeyboard) ↩︎
        * [.setSelective(selective)](#ReplyKeyboardMarkup+setSelective) ↩︎
        * [.appendRow()](#ReplyKeyboardMarkup+appendRow) ↩︎
        * [.addButton(button)](#ReplyKeyboardMarkup+addButton) ↩︎
    * _static_
        * [.KeyboardButton](#ReplyKeyboardMarkup.KeyboardButton) : <code>[KeyboardButton](#KeyboardButton)</code>

<a name="ReplyKeyboardMarkup+setResizeKeyboard"></a>

### replyKeyboardMarkup.setResizeKeyboard(resize_keyboard) ↩︎
Set `resize_keyboard` property

**Kind**: instance method of <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| resize_keyboard | <code>boolean</code> | Requests clients to resize the keyboard vertically for optimal fit |

<a name="ReplyKeyboardMarkup+setOneTimeKeyboard"></a>

### replyKeyboardMarkup.setOneTimeKeyboard(one_time_keyboard) ↩︎
Set `one_time_keyboard` property

**Kind**: instance method of <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| one_time_keyboard | <code>boolean</code> | Requests clients to hide the keyboard as soon as it's been used. |

<a name="ReplyKeyboardMarkup+setSelective"></a>

### replyKeyboardMarkup.setSelective(selective) ↩︎
Set `selective` property

**Kind**: instance method of <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| selective | <code>boolean</code> | Use this parameter if you want to show the keyboard to specific users only. |

<a name="ReplyKeyboardMarkup+appendRow"></a>

### replyKeyboardMarkup.appendRow() ↩︎
Append a new row to keyboard. New buttons will be added on new row.

**Kind**: instance method of <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>  
**Chainable**  
<a name="ReplyKeyboardMarkup+addButton"></a>

### replyKeyboardMarkup.addButton(button) ↩︎
Add a button to last row

**Kind**: instance method of <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>[KeyboardButton](#KeyboardButton)</code> | The button object |

<a name="ReplyKeyboardMarkup.KeyboardButton"></a>

### ReplyKeyboardMarkup.KeyboardButton : <code>[KeyboardButton](#KeyboardButton)</code>
**Kind**: static property of <code>[ReplyKeyboardMarkup](#ReplyKeyboardMarkup)</code>  
<a name="ReplyKeyboardRemove"></a>

## ReplyKeyboardRemove
{ReplyKeyboardRemove}

**Kind**: global class  
**See**: [https://core.telegram.org/bots/api#replykeyboardremove](https://core.telegram.org/bots/api#replykeyboardremove)  

* [ReplyKeyboardRemove](#ReplyKeyboardRemove)
    * [.setRemoveKeyboard(remove_keyboard)](#ReplyKeyboardRemove+setRemoveKeyboard) ↩︎
    * [.setSelective(selective)](#ReplyKeyboardRemove+setSelective) ↩︎

<a name="ReplyKeyboardRemove+setRemoveKeyboard"></a>

### replyKeyboardRemove.setRemoveKeyboard(remove_keyboard) ↩︎
Set `remove_keyboard` property. Default is `true`

**Kind**: instance method of <code>[ReplyKeyboardRemove](#ReplyKeyboardRemove)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| remove_keyboard | <code>Boolean</code> | Requests clients to remove the custom keyboard |

<a name="ReplyKeyboardRemove+setSelective"></a>

### replyKeyboardRemove.setSelective(selective) ↩︎
Set `selective` property

**Kind**: instance method of <code>[ReplyKeyboardRemove](#ReplyKeyboardRemove)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| selective | <code>Boolean</code> | Use this parameter if you want to remove the keyboard for specific users only. |

<a name="InlineKeyboardButton"></a>

## InlineKeyboardButton
{InlineKeyboardButton}

**Kind**: global class  
**See**: [https://core.telegram.org/bots/api#inlinekeyboardbutton](https://core.telegram.org/bots/api#inlinekeyboardbutton)  

* [InlineKeyboardButton](#InlineKeyboardButton)
    * [.setText(text)](#InlineKeyboardButton+setText) ↩︎
    * [.setUrl(url)](#InlineKeyboardButton+setUrl) ↩︎
    * [.setCallbackData(callback_data)](#InlineKeyboardButton+setCallbackData) ↩︎
    * [.setSwitchInlineQuery(switch_inline_query)](#InlineKeyboardButton+setSwitchInlineQuery) ↩︎
    * [.setSwitchInlineQueryCurrentChat(switch_inline_query_current_chat)](#InlineKeyboardButton+setSwitchInlineQueryCurrentChat) ↩︎
    * [.setCallbackGame(callback_game)](#InlineKeyboardButton+setCallbackGame) ↩︎

<a name="InlineKeyboardButton+setText"></a>

### inlineKeyboardButton.setText(text) ↩︎
Set `text` property

**Kind**: instance method of <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Label text on the button |

<a name="InlineKeyboardButton+setUrl"></a>

### inlineKeyboardButton.setUrl(url) ↩︎
Set `url` property

**Kind**: instance method of <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | HTTP url to be opened when button is pressed |

<a name="InlineKeyboardButton+setCallbackData"></a>

### inlineKeyboardButton.setCallbackData(callback_data) ↩︎
Set `callback_data` property

**Kind**: instance method of <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| callback_data | <code>String</code> | Data to be sent in a `callback_query` to the bot when button is pressed, 1-64 bytes |

<a name="InlineKeyboardButton+setSwitchInlineQuery"></a>

### inlineKeyboardButton.setSwitchInlineQuery(switch_inline_query) ↩︎
Set `switch_inline_query` property

**Kind**: instance method of <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| switch_inline_query | <code>String</code> | If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s username and the specified inline query in the input field. |

<a name="InlineKeyboardButton+setSwitchInlineQueryCurrentChat"></a>

### inlineKeyboardButton.setSwitchInlineQueryCurrentChat(switch_inline_query_current_chat) ↩︎
Set `switch_inline_query_current_chat` property

**Kind**: instance method of <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| switch_inline_query_current_chat | <code>String</code> | If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's input field. |

<a name="InlineKeyboardButton+setCallbackGame"></a>

### inlineKeyboardButton.setCallbackGame(callback_game) ↩︎
Set `callback_game` property

**Kind**: instance method of <code>[InlineKeyboardButton](#InlineKeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| callback_game | <code>Object</code> | Description of the game that will be launched when the user presses the button. |

<a name="KeyboardButton"></a>

## KeyboardButton
{KeyboardButton}

**Kind**: global class  
**See**: [https://core.telegram.org/bots/api#keyboardbutton](https://core.telegram.org/bots/api#keyboardbutton)  

* [KeyboardButton](#KeyboardButton)
    * [.setText(text)](#KeyboardButton+setText) ↩︎
    * [.setRequestContact(request_contact)](#KeyboardButton+setRequestContact) ↩︎
    * [.setRequestLocation(request_location)](#KeyboardButton+setRequestLocation) ↩︎

<a name="KeyboardButton+setText"></a>

### keyboardButton.setText(text) ↩︎
Set `text` property

**Kind**: instance method of <code>[KeyboardButton](#KeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Text of the button |

<a name="KeyboardButton+setRequestContact"></a>

### keyboardButton.setRequestContact(request_contact) ↩︎
Set `request_contact` property

**Kind**: instance method of <code>[KeyboardButton](#KeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| request_contact | <code>boolean</code> | If `true`, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only |

<a name="KeyboardButton+setRequestLocation"></a>

### keyboardButton.setRequestLocation(request_location) ↩︎
Set `request_location` property

**Kind**: instance method of <code>[KeyboardButton](#KeyboardButton)</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| request_location | <code>boolean</code> | If `true`, the user's current location will be sent when the button is pressed. Available in private chats only |

