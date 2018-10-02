/* tslint:disable:max-line-length */
import { ReadStream } from "fs";
import * as nodeEmoji from "node-emoji";
import * as request from "request-promise-native";

import { debug } from "./debug";
import * as I from "./interfaces";

export class Bot {
  private static MAX_MESSAGE_LENGTH = 4096;
  private config: I.Config;
  private emojify: (text: string) => string;

  /**
   * Constructs bot client
   *
   * @class TelegramBotClient
   * @constructor
   * @param {String} token Bot token
   * @param {object} [config={}] Optional config object. See default configuration below
   * @param {boolean} [config.split_long_messages=false] Telegram messages can"t be longer than 4096 chars, if `true`, the sendMessage function will split long messages and send sequentially
   * @param {boolean} [config.emojify_texts=false] `true` if you want the bot automatically call [emoji.emojify](https://www.npmjs.com/package/node-emoji) in texts
   * @see {@link https://www.npmjs.com/package/node-emoji}
   */
  constructor(private bot_token: string, { emojifyTexts = true, splitLongMessages = true, sendChatActionBeforeMsg = true }: I.Config = {}) {
    debug("constructing TelegramBotClient");
    debug("Config: ", JSON.stringify({ emojifyTexts, splitLongMessages, sendChatActionBeforeMsg }));

    if (!bot_token) {
      throw new Error("bot token undefined");
    }

    this.config = { emojifyTexts, splitLongMessages, sendChatActionBeforeMsg };

    if (!this.config.emojifyTexts) {
      this.emojify = (text: string) => text;
    } else {
      this.emojify = nodeEmoji.emojify;
    }
  }

  /**
   * Requires no parameters. Returns basic information about the bot in form of a `User` object.
   * @see {@link https://core.telegram.org/bots/api#getme}
   * @returns	{Promise}
   */
  public getMe(): Promise<I.TelegramResponse<I.User>> {
    return this.makeRequest<I.User>("getMe");
  }

  /**
   * Send a simple text message.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {String} text Text to be sent.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {String} [optionals.parse_mode] Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot"s message.
   * @param {boolean} [optionals.disable_web_page_preview] Disables link previews for links in this message
   * @param {boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message.
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendmessage}
   */
  public sendMessage(chat_id: number | string, text: string, optionals?: I.SendMessageOptionals): Promise<I.TelegramResponse<I.Message>> {
    // telegram message text can not be greater than 4096 characters
    if (text.length > Bot.MAX_MESSAGE_LENGTH) {

      // if configuration does not allow message split, throw an error
      if (!this.config.splitLongMessages) {
        return Promise.reject(new Error(`text can't be longer than ${Bot.MAX_MESSAGE_LENGTH} chars`));
      }
      // Wraps text in chunks of 4096 characters
      const splited_text = this.splitText(text, Bot.MAX_MESSAGE_LENGTH);

      // send chunks sequentially
      return splited_text.reduce((previous: Promise<I.TelegramResponse<I.Message>>, chunk: string) => {
        // sendMessage call itself with a acceptable text length
        return previous
          .then(() => this.sendMessage(chat_id, chunk, optionals));
      }, Promise.resolve({} as I.TelegramResponse<I.Message>));
    }

    // from here on executes only if text <= 4096
    const params = { chat_id, text };
    const json = {
      ...params,
      ...optionals,
    };

    const _sendmsg = (): Promise<I.TelegramResponse<I.Message>> => {
      return this.makeRequest<I.Message>("sendMessage", { json });
    };

    return this.config.sendChatActionBeforeMsg ?
      this.sendChatAction(chat_id, "typing")
        .then(_sendmsg) :
      _sendmsg();
  }

  /**
   * Use this method to send a group of photos or videos as an album
   * @param {integer|string} chat_id Unique identifier for the target chat or username of the target channel
   * @param {InputMedia[]} media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
   * @param {object} optionals
   * @param {boolean} optionals.disable_notification Sends the messages silently. Users will receive a notification with no sound
   * @param {integer} optionals.reply_to_message_id If the messages are a reply, ID of the original message
   * @return {Promise}
   */
  public sendMediaGroup(chat_id: number | string, media: I.InputMedia[], optionals: I.SendMediaGroupOptionals): Promise<I.TelegramResponse<I.Message[]>> {
    const formData = {
      chat_id,
      media,
      ...optionals,
    };

    return this.makeRequest<I.Message[]>("sendMediaGroup", { formData });
  }

  /**
   * Use this method to forward messages of any kind.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {Integer|String} from_chat_id Unique identifier for the chat where the original message was sent.
   * @param {Integer} message_id Message identifier in the chat specified in from_chat_id
   * @param {Boolean} [disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#forwardmessage}
   */
  public forwardMessage(chat_id: number | string, from_chat_id: number | string, message_id: number, disable_notification: boolean = false): Promise<I.TelegramResponse<I.Message>> {
    const params = { chat_id, from_chat_id, message_id, disable_notification };

    return this.makeRequest<I.Message>("forwardMessage", { json: params });
  }

  /**
   * Use this method to send photos.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {ReadStream|String} photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or pass read stream to upload your own file.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {String} [optionals.caption] Photo caption (may also be used when resending photos by file_id), 0-200 characters
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message.
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendphoto}
   */
  public sendPhoto(chat_id: number | string, photo: ReadStream | string, optionals?: I.SendPhotoOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      chat_id,
      photo,
      ...optionals,
    };

    const _sendphoto = (): Promise<I.TelegramResponse<I.Message>> => {
      return this.makeRequest<I.Message>("sendPhoto", { formData });
    };

    return this.config.sendChatActionBeforeMsg ?
      this.sendChatAction(chat_id, "upload_photo").then(_sendphoto) :
      _sendphoto();
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {ReadStream|String} audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or pass a read stream for upload your own.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {String} [optionals.caption] Audio caption, 0-200 characters
   * @param {Integer} [optionals.duration] Duration of the audio in seconds.
   * @param {String} [optionals.performer] Performer
   * @param {String} [optionals.title] Track name
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message.
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendaudio}
   */
  public sendAudio(chat_id: number | string, audio: ReadStream | string, optionals?: I.SendAudioOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      audio,
      chat_id,
      ...optionals,
    };

    const _sendaudio = (): Promise<I.TelegramResponse<I.Message>> => {
      return this.makeRequest<I.Message>("sendAudio", { formData });
    };

    return this.config.sendChatActionBeforeMsg ?
      this.sendChatAction(chat_id, "upload_audio")
        .then(_sendaudio) :
      _sendaudio();
  }

  /**
   * Use this method to send general files.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {ReadStream|String} document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing an read stream for file.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {String} [optionals.caption] Document caption (may also be used when resending documents by file_id), 0-200 characters.
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#senddocument}
   */
  public sendDocument(chat_id: number | string, doc: ReadStream | string, optionals?: I.SendDocumentOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      chat_id,
      document: doc,
      ...optionals,
    };

    const _senddocument = (): Promise<I.TelegramResponse<I.Message>> => {
      return this.makeRequest<I.Message>("sendDocument", { formData });
    };

    return this.config.sendChatActionBeforeMsg ?
      this.sendChatAction(chat_id, "upload_document")
        .then(_senddocument) :
      _senddocument();
  }

  /**
   * Use this method to send .webp stickers
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {ReadStream|String} sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .webp file from the Internet, or upload a new one passing a Read Stream for file.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendsticker}
   */
  public sendSticker(chat_id: number | string, sticker: ReadStream | string, optionals?: I.SendStickerOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      chat_id,
      sticker,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendSticker", { formData });
  }

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document).
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {ReadStream|String} video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video passing a read stream.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Integer} [optionals.duration] Duration of sent video in seconds
   * @param {Integer} [optionals.width] Video width
   * @param {Integer} [optionals.height] Video height
   * @param {String} [optionals.caption] Video caption (may also be used when resending videos by file_id), 0-200 characters
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendvideo}
   */
  public sendVideo(chat_id: number | string, video: ReadStream | string, optionals?: I.SendVideoOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      chat_id,
      video,
      ...optionals,
    };

    const _sendvideo = (): Promise<I.TelegramResponse<I.Message>> => {
      return this.makeRequest<I.Message>("sendVideo", { formData });
    };

    return this.config.sendChatActionBeforeMsg ?
      this.sendChatAction(chat_id, "upload_video")
        .then(_sendvideo) :
      _sendvideo();
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document).
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {ReadStream|String} voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing a read stream.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {String} [optionals.caption] Voice message caption, 0-200 characters
   * @param {Integer} [optionals.duration] Duration of the voice message in seconds
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendvoice}
   */
  public sendVoice(chat_id: number | string, voice: ReadStream | string, optionals?: I.SendVoiceOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      chat_id,
      voice,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendVoice", { formData });
  }

  /**
   * Use this method to send point on the map.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {Float} latitude Latitude of location
   * @param {FLoat} longitude Longitude of location
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Integer} [optionals.live_period] Period in seconds for which the location will be updated (should be between 60 and 86400)
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendlocation}
   */
  public sendLocation(chat_id: number | string, latitude: number, longitude: number, optionals?: I.SendLocationOptionals): Promise<I.TelegramResponse<I.Message>> {
    const json = {
      chat_id,
      latitude,
      longitude,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendLocation", { json });
  }

  /**
   * Use this method to edit live location messages sent by the bot or via the bot
   * @param {Integer} latitude Latitude of new location
   * @param {Integer} longitude Longitude of new location
   * @param {object} [optionals]
   * @param {Integer|String} [optionals.chat_id] Required if inline_message_id is not specified. Unique identifier for the target chat
   * @param {Integer} [optionals.message_id] Required if inline_message_id is not specified. Identifier of the sent message
   * @param {String} [optionals.inline_message_id] Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {object} [optionals.reply_markup] A JSON-serialized object for a new inline keyboard.
   * @return {Promise}
   */
  public editMessageLiveLocation(latitude: number, longitude: number, optionals: I.EditMessageLiveLocationOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = {
      latitude,
      longitude,
      ...optionals,
    };

    return this.makeRequest<I.Message | boolean>("editMessageLiveLocation", { json });
  }

  /**
   * Use this method to stop updating a live location message sent by the bot or via the bot (for inline bots) before live_period expires
   * @param {Integer|String} optionals.chat_id Required if inline_message_id is not specified. Unique identifier for the target chat
   * @param {Integer} optionals.message_id Required if inline_message_id is not specified. Identifier of the sent message
   * @param {Integer} optionals.inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param {object} optionals.reply_markup A JSON-serialized object for a new inline keyboard
   * @return {Promise}
   */
  public stopMessageLiveLocation(optionals: I.StopMessageLiveLocationOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = optionals || {};

    return this.makeRequest<I.Message | boolean>("stopMessageLiveLocation", { json });
  }

  /**
   * Use this method to send information about a venue.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
   * @param {Float} latitude Latitude of location
   * @param {FLoat} longitude Longitude of location
   * @param {String} title Name of the venue
   * @param {String} address Address of the venue
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {String} [optionals.foursquare_id] Foursquare identifier of the venue
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendvenue}
   */
  public sendVenue(chat_id: number | string, latitude: number, longitude: number, title: string, address: string, optionals?: I.SendVenueOptionals): Promise<I.TelegramResponse<I.Message>> {
    const json = {
      address,
      chat_id,
      latitude,
      longitude,
      ...optionals,
      title,
    };

    return this.makeRequest<I.Message>("sendVenue", { json });
  }

  /**
   * Use this method to send phone contacts.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {String} phone_number Contact"s phone number
   * @param {String} first_name Contact"s first name
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {String} [optionals.last_name] Contact"s last name
   * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendcontact}
   */
  public sendContact(chat_id: number | string, phone_number: string, first_name: string, optionals?: I.SendContactOptionals): Promise<I.TelegramResponse<I.Message>> {
    const json = {
      chat_id,
      first_name,
      phone_number,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendContact", { json });
  }

  /**
   * Attention: the sendMessage, sendPhoto, sendDocument, sendAudio and sendVideo methods automatically sends their repective chat actions before send data.
   * Use this method when you need to tell the user that something is happening on the bot"s side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {String} action Type of action to broadcast. Choose one, depending on what the user is about to receive: `typing` for text messages, `upload_photo` for photos, `record_video` or `upload_video` for videos, `record_audio` or `upload_audio` for audio files, `upload_document` for general files, `find_location` for location data.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendchataction}
   */
  public sendChatAction(chat_id: number | string, action: string): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id, action };

    return this.makeRequest<boolean>("sendChatAction", { json });
  }

  /**
   * Use this method to get a list of profile pictures for a user.
   * @param {Integer|String} user_id Unique identifier of the target user
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Integer} [optionals.offset] Sequential number of the first photo to be returned. By default, all photos are returned.
   * @param {Integer} [optionals.limit=100] Limits the number of photos to be retrieved. Values between 1—100 are accepted.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
   */
  public getUserProfilePhotos(user_id: number | string, optionals?: I.GetUserProfilePhotosOptionals): Promise<I.TelegramResponse<I.UserProfilePhotos>> {
    const json = {
      user_id,
      ...optionals,
    };

    return this.makeRequest<I.UserProfilePhotos>("getUserProfilePhotos", { json });
  }

  /**
   * Use this method to get basic info about a file and prepare it for downloading.
   * The file can then be downloaded via the link
   * `https://api.telegram.org/file/bot<token>/<file_path>`,
   * where `<file_path>` is taken from the response.
   * It is guaranteed that the link will be valid for at least 1 hour.
   * When the link expires, a new one can be requested by calling getFile again.
   * @param {String} file_id File identifier to get info about
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getfile}
   */
  public getFile(file_id: string): Promise<I.TelegramResponse<File>> {
    const json = { file_id };

    return this.makeRequest<File>("getFile", { json });
  }

  /**
   * Use this method to kick a user from a group or a supergroup.
   * In the case of supergroups, the user will not be able to return to the
   * group on their own using invite links, etc., unless unbanned first.
   * @param {Integer|String} chat_id Unique identifier for the target group or username of the target supergroup
   * @param {Integer} user_id Unique identifier of the target user
   * @param {Integer} [until_date] Date when the user will be unbanned, unix time.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#kickchatmember}
   */
  public kickChatMember(chat_id: number | string, user_id: number, until_date?: number): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id, user_id, until_date };

    return this.makeRequest<boolean>("kickChatMember", { json });
  }

  /**
   * Use this method for your bot to leave a group, supergroup or channel.
   * @param {Integer|String} chat_id 	Unique identifier for the target chat or username of the target supergroup or channel
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#leavechat}
   */
  public leaveChat(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id };

    return this.makeRequest<boolean>("leaveChat", { json });
  }

  /**
   * Use this method to unban a previously kicked user in a supergroup.
   * @param {Integer|String} chat_id Unique identifier for the target group or username of the target supergroup
   * @param {Integer} user_id Unique identifier of the target user
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
   */
  public unbanChatMember(chat_id: number | string, user_id: number): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id, user_id };

    return this.makeRequest<boolean>("unbanChatMember", { json });
  }

  /**
   * Use this method to get up to date information about the chat
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
   */
  public getChat(chat_id: number | string): Promise<I.TelegramResponse<I.Chat>> {
    const json = { chat_id };

    return this.makeRequest<I.Chat>("getChat", { json });
  }

  /**
   * Use this method to get a list of administrators in a chat.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
   */
  public getChatAdministrators(chat_id: number | string): Promise<I.TelegramResponse<I.ChatMember[]>> {
    const json = { chat_id };

    return this.makeRequest<I.ChatMember[]>("getChatAdministrators", { json });
  }

  /**
   * Use this method to get the number of members in a chat.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getchatmemberscount}
   */
  public getChatMembersCount(chat_id: number | string): Promise<I.TelegramResponse<number>> {
    const json = { chat_id };

    return this.makeRequest<number>("getChatMembersCount", { json });
  }

  /**
   * Use this method to get information about a member of a chat.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @param {Integer} user_id Unique identifier of the target user
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getchatmember}
   */
  public getChatMember(chat_id: number | string, user_id: number): Promise<I.TelegramResponse<I.ChatMember>> {
    const json = { chat_id, user_id };

    return this.makeRequest<I.ChatMember>("getChatMember", { json });
  }

  /**
   * Use this method to send answers to callback queries sent from inline keyboards.
   * @param {String} callback_query_id Unique identifier for the query to be answered
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {String} [optionals.text] Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
   * @param {Boolean} [optionals.show_alert=false] If true, an alert will be shown by the client instead of a notification at the top of the chat screen.
   * @param {String} [optionals.url] URL that will be opened by the user"s client.
   * @param {Integer} [optionals.cache_time=0] The maximum amount of time in seconds that the result of the callback query may be cached client-side.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
   */
  public answerCallbackQuery(callback_query_id: string, optionals?: I.AnswerCallbackQueryOptionals): Promise<I.TelegramResponse<boolean>> {
    const json = {
      callback_query_id,
      ...optionals,
    };

    return this.makeRequest<boolean>("answerCallbackQuery", { json });
  }

  /**
   * Use this method to edit text and game messages sent by the bot or via the bot (for inline bots).
   * @param {String} text New text of the message
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Integer|String} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel
   * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
   * @param {String} [optionals.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message.
   * @param {String} [optionals.parse_mode] Send Markdown or HTML.
   * @param {Boolean} [optionals.disable_web_page_preview] Disables link previews for links in this message
   * @param {Object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#editmessagetext}
   */
  public editMessageText(text: string, optionals?: I.EditMessageTextOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = {
      text,
      ...optionals,
    };

    return this.makeRequest<I.Message | boolean>("editMessageText", { json });
  }

  /**
   * Use this method to edit captions of messages sent by the bot or via the bot (for inline bots).
   * @param {Object} optionals An object with optional params that you want to send in request.
   * @param {Integer|String} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel.
   * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
   * @param {String} [optionals.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
   * @param {String} [optionals.caption] New caption of the message
   * @param {String} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
   */
  public editMessageCaption(optionals?: I.EditMessageCaptionOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = optionals;

    return this.makeRequest<I.Message | boolean>("editMessageCaption", { json });
  }

  /**
   * Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots)
   * @param {Object} optionals An object with optional params that you want to send in request.
   * @param {Integer|String} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel
   * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
   * @param {String} [optioanls.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
   * @param {Object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
   */
  public editMessageReplyMarkup(optionals?: I.EditMessageReplyMarkupOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = optionals;

    return this.makeRequest<I.Message | boolean>("editMessageReplyMarkup", { json });
  }

  /**
   * Use this method to send answers to an inline query.
   * No more than 50 results per query are allowed.
   * @param {String} inline_query_id Unique identifier for the answered query
   * @param {Array} results A JSON-serialized array of [results](https://core.telegram.org/bots/api#inlinequeryresult) for the inline query
   * @param {Object} optionals An object with optional params that you want to send in request.
   * @param {Integer} [optionals.cache_time=300] The maximum amount of time in seconds that the result of the inline query may be cached on the server.
   * @param {Boolean} [optionals.is_personal] Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
   * @param {String} [optionals.next_offset] Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination.
   * @param {String} [optionals.switch_pm_text] If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
   * @param {String} [optionals.switch_pm_parameter] Parameter for the start message sent to the bot when user presses the switch button
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
   */
  public answerInlineQuery(inline_query_id: string, results: any[], optionals?: I.AnswerInlineQueryOptionals): Promise<I.TelegramResponse<boolean>> {
    const json = {
      inline_query_id,
      results,
      ...optionals,
    };

    return this.makeRequest<boolean>("answerInlineQuery", { json });
  }

  /**
   * Use this method to send a game.
   * @param {Integer} chat_id Unique identifier for the target chat
   * @param {String} game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Boolean} [optionals.disable_notification] Sends the message silently.
   * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {Object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#sendgame}
   */
  public sendGame(chat_id: number, game_short_name: string, optionals?: I.SendGameOptionals): Promise<I.TelegramResponse<I.Message>> {
    const json = {
      chat_id,
      game_short_name,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendGame", { json });
  }

  /**
   * Use this method to set the score of the specified user in a game.
   * @param {Integer} user_id User identifier
   * @param {Integer} score New score, must be non-negative
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Boolean} [optionals.force] Pass True, if the high score is allowed to decrease.
   * @param {Boolean} [optionals.disable_edit_message] Pass True, if the game message should not be automatically edited to include the current scoreboard
   * @param {Integer} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat
   * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
   * @param {String} [optionals.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#setgamescore}
   */
  public setGameScore(user_id: number, score: number, optionals?: I.SetGameScoreOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = {
      user_id,
      ...optionals,
      score,
    };

    return this.makeRequest<I.Message | boolean>("setGameScore", { json });
  }

  /**
   * Use this method to get data for high score tables.
   * @param {Integer} user_id Target user id
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Integer} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat
   * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
   * @param {String} [optionals.inline_message_id] Required if chat_id and message_id are not specified. Identifier of the inline message
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
   */
  public getGameHighScores(user_id: number, optionals?: I.GetGameHighScoresOptionals): Promise<I.TelegramResponse<I.GameHighScore[]>> {
    const json = {
      user_id,
      ...optionals,
    };

    return this.makeRequest<I.GameHighScore[]>("getGameHighScores", { json });
  }

  /**
   * Use this method to receive incoming updates using long polling.
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {Integer} [optionals.offset] Identifier of the first update to be returned.
   * @param {Integer} [optionals.limit=100] Limits the number of updates to be retrieved. Values between 1—100 are accepted.
   * @param {Integer} [optionals.timeout] Timeout in seconds for long polling.
   * @param {Array} [optionals.allowed_updates] List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getupdates}
   */
  public getUpdates(optionals?: I.GetUpdatesOptionals): Promise<I.TelegramResponse<I.Update[]>> {
    const json = optionals || {};

    return this.makeRequest<I.Update[]>("getUpdates", { json });
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook.
   * @param {String} url HTTPS url to send updates to. Use an empty string to remove webhook integration
   * @param {Object} [optionals] An object with optional params that you want to send in request.
   * @param {ReadStrem} [optionals.certificate] Upload your public key certificate so that the root certificate in use can be checked.
   * @param {Integer} [optionals.max_connections=40] Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100.
   * @param {Array} [optionals.allowed_updates] List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#setwebhook}
   */
  public setWebhook(url: string, optionals?: I.SetWebhookOptionals): Promise<I.TelegramResponse<boolean>> {
    const formData = {
      url,
      ...optionals,
    };

    return this.makeRequest<boolean>("setWebhook", { formData });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates. Requires no parameters.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#deletewebhook}
   */
  public deleteWebhook(): Promise<I.TelegramResponse<boolean>> {
    return this.makeRequest<boolean>("deleteWebhook");
  }

  /**
   * Use this method to get current webhook status. Requires no parameters.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#deletewebhook}
   */
  public getWebhookInfo(): Promise<I.TelegramResponse<I.WebhookInfo>> {
    return this.makeRequest<I.WebhookInfo>("getWebhookInfo");
  }

  /**
   * Use this method to delete a message, including service messages
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {Integer|String} message_id Identifier of the message to delete
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#deletemessage}
   */
  public deleteMessage(chat_id: number | string, message_id: number | string): Promise<I.TelegramResponse<boolean>> {
    return this.makeRequest<boolean>("deleteMessage", { formData: { chat_id, message_id } });
  }

  /**
   * Use this method to restrict a user in a supergroup.
   * @param {String|Integer} chat_id Unique identifier for the target chat or username of the target supergroup
   * @param {String|Integer} user_id Unique identifier of the target user
   * @param {Object} [options] Object with optionals parameters
   * @param {Integer} [options.until_date] Date when restrictions will be lifted for the user, unix time.
   * @param {Boolean} [options.can_send_messages] Pass True, if the user can send text messages, contacts, locations and venues
   * @param {Boolean} [options.can_send_media_messages] Pass True, if the user can send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages
   * @param {Boolean} [options.can_send_other_messages] Pass True, if the user can send animations, games, stickers and use inline bots, implies can_send_media_messages
   * @param {Boolean} [options.can_add_web_page_previews] Pass True, if the user may add web page previews to their messages, implies can_send_media_messages
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#restrictchatmember}
   */
  public restrictChatMember(chat_id: number | string, user_id: number | string, options: I.RestrictChatMemberOptionals): Promise<I.TelegramResponse<boolean>> {
    const formData = {
      chat_id,
      user_id,
      ...options,
    };

    return this.makeRequest<boolean>("restrictChatMember", { formData });
  }

  /**
   * Use this method to promote or demote a user in a supergroup or a channel.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {Integer|String} user_id Unique identifier of the target user
   * @param {object} options Object with optionals parameters
   * @param {Boolean} options.can_change_infoPass True, if the administrator can change chat title, photo and other settings
   * @param {Boolean} options.can_post_messagesPass True, if the administrator can create channel posts, channels only
   * @param {Boolean} options.can_edit_messages Pass True, if the administrator can edit messages of other users, channels only
   * @param {Boolean} options.can_delete_messages Pass True, if the administrator can delete messages of other users
   * @param {Boolean} options.can_invite_users Pass True, if the administrator can invite new users to the chat
   * @param {Boolean} options.can_restrict_members Pass True, if the administrator can restrict, ban or unban chat members
   * @param {Boolean} options.can_pin_messages Pass True, if the administrator can pin messages, supergroups only
   * @param {Boolean} options.can_promote_members 	Pass True, if the administrator can add new administrators with a subset of his own privileges
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#promotechatmember}
   */
  public promoteChatMember(chat_id: number | string, user_id: number | string, options: I.PromoteChatMemberOptionals): Promise<I.TelegramResponse<boolean>> {
    const formData = {
      chat_id,
      user_id,
      ...options,
    };

    return this.makeRequest<boolean>("promoteChatMember", { formData });
  }

  /**
   * Use this method to export an invite link to a supergroup or a channel.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
   */
  public exportChatInviteLink(chat_id: number | string): Promise<I.TelegramResponse<string>> {
    const formData = { chat_id };

    return this.makeRequest<string>("exportChatInviteLink", { formData });
  }

  /**
   * Use this method to set a new profile photo for the chat.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {ReadStream} photo New chat photo.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#setchatphoto}
   */
  public setChatPhoto(chat_id: number | string, photo: ReadStream): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, photo };

    return this.makeRequest<boolean>("setChatPhoto", { formData });
  }

  /**
   * Use this method to delete a chat photo
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
   */
  public deleteChatPhoto(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id };

    return this.makeRequest<boolean>("deleteChatPhoto", { formData });
  }

  /**
   * Use this method to change the title of a chat.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {String} title New chat title, 1-255 characters
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#setchattitle}
   */
  public setChatTitle(chat_id: number | string, title: string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, title };

    return this.makeRequest<boolean>("setChatTitle", { formData });
  }

  /**
   * Use this method to change the description of a supergroup or a channel.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
   * @param {String} description New chat description, 0-255 characters
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#setchatdescription}
   */
  public setChatDescription(chat_id: number | string, description: string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, description };

    return this.makeRequest<boolean>("setChatDescription", { formData });
  }

  /**
   * Use this method to pin a message in a supergroup.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup
   * @param {Integer|String} message_id Identifier of a message to pin
   * @param {Boolean} disable_notification Pass True, if it is not necessary to send a notification to all group members about the new pinned message. Default false
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
   */
  public pinChatMessage(chat_id: number | string, message_id: number | string, disable_notification = false): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, message_id, disable_notification };

    return this.makeRequest<boolean>("pinChatMessage", { formData });
  }

  /**
   * Use this method to unpin a message in a supergroup chat.
   * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
   */
  public unpinChatMessage(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id };

    return this.makeRequest<boolean>("unpinChatMessage", { formData });
  }

  /**
   * Use this method to get a sticker set.
   * @param {String} name Name of the sticker set
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#getstickerset}
   */
  public getStickerSet(name: string): Promise<I.TelegramResponse<I.StickerSet>> {
    const formData = { name };

    return this.makeRequest<I.StickerSet>("getStickerSet", { formData });
  }

  /**
   * Use this method to upload a .png file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times).
   * @param {Integer} user_id User identifier of sticker file owner
   * @param {ReadStream} png_sticker Png image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px.
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
   */
  public uploadStickerFile(user_id: number, png_sticker: ReadStream): Promise<I.TelegramResponse<File>> {
    const formData = { user_id, png_sticker };

    return this.makeRequest<File>("uploadStickerFile", { formData });
  }

  /**
   * Use this method to create new sticker set owned by a user.
   * @param {Integer|String} user_id User identifier of created sticker set owner
   * @param {String} name Short name of sticker set, to be used in t.me/addstickers/ URLs
   * @param {String} title Sticker set title, 1-64 characters
   * @param {ReadStream|String} png_sticker Png image with the sticker
   * @param {String} emojis One or more emoji corresponding to the sticker
   * @param {object} options Object with optionals parameters
   * @param {boolean} options.contains_masks Pass True, if a set of mask stickers should be created
   * @param {object} options.mask_position A JSON-serialized object for position where the mask should be placed on faces
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#createnewstickerset}
   */
  public createNewStickerSet(user_id: number | string, name: string, title: string, png_sticker: ReadStream | string, emojis: string, options: I.CreateNewStickerSetOptionals): Promise<I.TelegramResponse<boolean>> {
    const formData = {
      emojis,
      name,
      ...options,
      png_sticker,
      title,
      user_id,
    };

    return this.makeRequest<boolean>("createNewStickerSet", { formData });
  }

  /**
   * Use this method to set a new group sticker set for a supergroup.
   * @param chat_id Unique identifier for the target chat
   * @param sticker_set_name Name of the sticker set to be set as the group sticker set
   * @return {Promise}
   */
  public setChatStickerSet(chat_id: number | string, sticker_set_name: string): Promise<I.TelegramResponse<boolean>> {
    const json = {
      chat_id,
      sticker_set_name,
    };

    return this.makeRequest<boolean>("setChatStickerSet", { json });
  }

  /**
   * Use this method to delete a group sticker set from a supergroup.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup
   * @return {Promise}
   */
  public deleteChatStickerSet(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const json = {
      chat_id,
    };

    return this.makeRequest<boolean>("deleteChatStickerSet", { json });
  }

  /**
   * Use this method to add a new sticker to a set created by the bot.
   * @param {Integer|String} user_id User identifier of sticker set owner
   * @param {String} name Sticker set name
   * @param {ReadStream|String} png_sticker Png image with the sticker
   * @param {String} emojis One or more emoji corresponding to the sticker
   * @param {object} [mask_position] A JSON-serialized object for position where the mask should be placed on faces
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#addstickertoset}
   */
  public addStickerToSet(user_id: number | string, name: string, png_sticker: ReadStream | string, emojis: string, mask_position?: I.MaskPosition): Promise<I.TelegramResponse<boolean>> {
    const formData = {
      emojis,
      mask_position,
      name,
      png_sticker,
      user_id,
    };

    return this.makeRequest<boolean>("addStickerToSet", { formData });
  }

  /**
   * Use this method to move a sticker in a set created by the bot to a specific position
   * @param {String} sticker File identifier of the sticker
   * @param {Integer} position New sticker position in the set, zero-based
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
   */
  public setStickerPositionInSet(sticker: string, position: number): Promise<I.TelegramResponse<boolean>> {
    const formData = { sticker, position };

    return this.makeRequest<boolean>("setStickerPositionInSet", { formData });
  }

  /**
   * Use this method to send invoices.
   * @param {number} chat_id Unique identifier for the target private chat
   * @param {string} title Product name, 1-32 characters
   * @param {string} description Product description, 1-255 characters
   * @param {string} payload Bot-defined invoice payload, 1-128 bytes.
   * @param {string} provider_token Payments provider token, obtained via Botfather
   * @param {string} start_parameter Unique deep-linking parameter that can be used to generate this invoice when used as a start parameter
   * @param {string} currency Three-letter ISO 4217 currency code
   * @param {object} prices Price breakdown, a list of components
   * @param {object} [optionals]
   * @param {string} [optionals.provider_data] JSON-encoded data about the invoice, which will be shared with the payment provider
   * @param {string} [optionals.photo_url] URL of the product photo for the invoice
   * @param {number} [optionals.photo_size] Photo size
   * @param {number} [optionals.photo_width] Photo width
   * @param {number} [optionals.photo_height] Photo height
   * @param {boolean} [optionals.need_name] Pass True, if you require the user's full name to complete the order
   * @param {boolean} [optionals.need_phone_number] Pass True, if you require the user's phone number to complete the order
   * @param {boolean} [optionals.need_email] Pass True, if you require the user's email to complete the order
   * @param {boolean} [optionals.need_shipping_address] Pass True, if you require the user's shipping address to complete the order
   * @param {boolean} [optionals.is_flexible] Pass True, if the final price depends on the shipping method
   * @param {boolean} [optionals.disable_notification] Sends the message silently.
   * @param {number} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
   * @param {object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
   * @return {Promise}
   */
  public sendInvoice(chat_id: number, title: string, description: string, payload: string, provider_token: string, start_parameter: string, currency: string, prices: I.LabeledPrice[], optionals: I.SendInvoiceOptionals): Promise<I.TelegramResponse<I.Message>> {
    const json = {
      chat_id,
      currency,
      description,
      payload,
      prices,
      provider_token,
      start_parameter,
      title,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendInvoice", { json });
  }

  /**
   * Use this method to reply to shipping queries received in updates
   * @param {string} shipping_query_id Unique identifier for the query to be answered
   * @param {boolean} ok Specify True if delivery to the specified address is possible and False if there are any problems
   * @param {object} optionals Object with optional parameters
   * @param {object} optionals.shipping_options Required if ok is True. A JSON-serialized array of available shipping options
   * @param {string} optionals.error_message Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order
   * @return {Promise}
   */
  public answerShippingQuery(shipping_query_id: string, ok: boolean, optionals: I.AnswerShippingQueryOptionals): Promise<I.TelegramResponse<boolean>> {
    const json = {
      ok,
      shipping_query_id,
      ...optionals,
    };

    return this.makeRequest<boolean>("answerShippingQuery", { json });
  }

  /**
   * Use this method to respond to such pre-checkout queries.
   * @param {string} pre_checkout_query_id Unique identifier for the query to be answered
   * @param {boolean} ok Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order.
   * @param {string} [error_message] Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout
   * @return {Promise}
   */
  public answerPreCheckoutQuery(pre_checkout_query_id: string, ok: boolean, error_message?: string): Promise<I.TelegramResponse<boolean>> {
    const json = {
      error_message,
      ok,
      pre_checkout_query_id,
    };

    return this.makeRequest<boolean>("answerPreCheckoutQuery", { json });
  }

  /**
   * Use this method to delete a sticker from a set created by the bot.
   * @param {String} sticker File identifier of the sticker
   * @returns {Promise}
   * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
   */
  public deleteStickerFromSet(sticker: string): Promise<I.TelegramResponse<boolean>> {
    const formData = { sticker };

    return this.makeRequest<boolean>("deleteStickerFromSet", { formData });
  }

  private makeRequest<T>(api_method: string, params: any = {}): Promise<I.TelegramResponse<T>> {
    debug("makeRequest ", api_method);
    if (!this.bot_token) {
      debug("Error: bot token isn't defined");
      throw new Error("Telegram Bot Token undefined");
    }

    const uri = `https://api.telegram.org/bot${this.bot_token}/${api_method}`;

    if (params.json && params.json.text) {
      debug("Emojify text");
      params.json.text = this.emojify(params.json.text);
    }

    if (params.formData && params.formData.caption) {
      debug("Emojify caption");
      params.formData.caption = this.emojify(params.formData.caption);
    }

    debug("fetching telegram api");
    return request.post({
      uri,
      ...params,
    }).promise();
  }

  private splitText(text: string, chunkLength: number): string[] {
    const textLength = text.length;
    const timesGreater = Math.ceil((textLength / chunkLength));
    const splitedText = [];

    for (let i = 0; i < timesGreater; i++) {
      const start = Bot.MAX_MESSAGE_LENGTH * i;
      const end = Bot.MAX_MESSAGE_LENGTH * (i + 1);

      const piece = text.substring(start, end);

      splitedText.push(piece);
    }
    return splitedText;
  }
}
