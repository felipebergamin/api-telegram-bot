/* tslint:disable:max-line-length */
import { ReadStream } from "fs";
import * as nodeEmoji from "node-emoji";
import * as request from "request-promise-native";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { isFunction } from "util";

import { SmartMenu } from "./builders/SmartMenu";
import { debug } from "./debug";
import * as I from "./interfaces";
import { Polling } from "./Polling";
import * as Types from "./types";
import { Webhook } from "./Webhook";

import {
  createFilteredMessageObservable,
  createFilteredUpdateObservable,
  createMessageActions,
  ExplicitTypedUpdate,
  stringifyFormData,
} from "./utils";

export class Bot {
  /** @ignore */
  private static MAX_MESSAGE_LENGTH = 4096;

  /** emits all message updates received on webhook or polling */
  public message$ = new Subject<I.WrappedMessageActions>();
  /** emits edited_message updates received on webhook or polling */
  public editedMessage$ = new Subject<I.Update>();
  /** emits channel_post updates from webhook or polling */
  public channelPost$ = new Subject<I.Update>();
  /** emits edited_channel_post updates from webhook or polling */
  public editedChannelPost$ = new Subject<I.Update>();
  /** emits inline_query updates from webhook or polling */
  public inlineQuery$ = new Subject<I.Update>();
  /** emits chosen_inline_result updates from webhook or polling */
  public chosenInlineResult$ = new Subject<I.Update>();
  /** emits callback_query updates from webhook or polling */
  public callbackQuery$ = new Subject<I.Update>();
  /** emits shipping_query updates from webhook or polling */
  public shippingQuery$ = new Subject<I.Update>();
  /** emits pre_checkout_query updates from webhook or polling */
  public preCheckoutQuery$ = new Subject<I.Update>();

  /** emits text message types from webhook or polling */
  public text$ = new Subject<I.WrappedMessageActions>();
  /** emits audio message types from webhook or polling */
  public audio$ = new Subject<I.WrappedMessageActions>();
  /** emits document message types from webhook or polling */
  public document$ = new Subject<I.WrappedMessageActions>();
  /** emits game message types from webhook or polling */
  public game$ = new Subject<I.WrappedMessageActions>();
  /** emits photo message types from webhook or polling */
  public photo$ = new Subject<I.WrappedMessageActions>();
  /** emits sticker message types from webhook or polling */
  public sticker$ = new Subject<I.WrappedMessageActions>();
  /** emits video message types from webhook or polling */
  public video$ = new Subject<I.WrappedMessageActions>();
  /** emits voice message types from webhook or polling */
  public voice$ = new Subject<I.WrappedMessageActions>();
  /** emits video_note message types from webhook or polling */
  public videoNote$ = new Subject<I.WrappedMessageActions>();
  /** emits contact message types from webhook or polling */
  public contact$ = new Subject<I.WrappedMessageActions>();
  /** emits location message types from webhook or polling */
  public location$ = new Subject<I.WrappedMessageActions>();
  /** emits venue message types from webhook or polling */
  public venue$ = new Subject<I.WrappedMessageActions>();
  /** emits new_chat_members message types from webhook or polling */
  public newChatMembers$ = new Subject<I.WrappedMessageActions>();
  /** emits left_chat_member message types from webhook or polling */
  public leftChatMember$ = new Subject<I.WrappedMessageActions>();
  /** emits new_chat_title message types from webhook or polling */
  public newChatTitle$ = new Subject<I.WrappedMessageActions>();
  /** emits new_chat_photo message types from webhook or polling */
  public newChatPhoto$ = new Subject<I.WrappedMessageActions>();
  /** emits delete_chat_photo message types from webhook or polling */
  public deleteChatPhoto$ = new Subject<I.WrappedMessageActions>();
  /** emits group_chat_created message types from webhook or polling */
  public groupChatCreated$ = new Subject<I.WrappedMessageActions>();
  /** emits supergroup_chat_created message types from webhook or polling */
  public supergroupChatCreated$ = new Subject<I.WrappedMessageActions>();
  /** emits channel_chat_created message types from webhook or polling */
  public channelChatCreated$ = new Subject<I.WrappedMessageActions>();
  /** emits pinned_message message types from webhook or polling */
  public pinnedMessage$ = new Subject<I.WrappedMessageActions>();
  /** emits invoice message types from webhook or polling */
  public invoice$ = new Subject<I.WrappedMessageActions>();
  /** emits successful_payment message types from webhook or polling */
  public successfulPayment$ = new Subject<I.WrappedMessageActions>();

  private config: I.Config;
  private repliesCallbacks: I.OnReceiveReplyCallback[] = [];
  private _smartMenus: SmartMenu[] = [];
  private _webhook: Webhook;
  private _polling: Polling;

  /**
   * Constructs bot client
   *
   * @constructor
   * @param token Bot token
   * @param config Optional config object.
   */
  constructor(private bot_token: string, { emojifyTexts = true, splitLongMessages = true, sendChatActionBeforeMsg = true }: I.Config = {}) {
    debug("constructing TelegramBotClient");
    debug("Config: ", JSON.stringify({ emojifyTexts, splitLongMessages, sendChatActionBeforeMsg }));

    if (!bot_token) {
      throw new Error("bot token undefined");
    }

    this.config = { emojifyTexts, splitLongMessages, sendChatActionBeforeMsg };
  }

  /** @ignore */
  public set webhook(webhook: Webhook) {
    if (this._webhook) {
      throw new Error("Trying to set a webhook reference, but another webhook was set");
    }

    if (webhook && webhook instanceof Webhook) {
      debug("setting webhook reference");
      this.configObservables(webhook.updates);
      this._webhook = webhook;
    }
  }

  /**
   * @return Webhook instance reference
   */
  public get webhook() {
    return this._webhook;
  }

  public set polling(polling: Polling) {
    if (this._polling) {
      this._polling.stopPolling();
    }

    if (polling && polling instanceof Polling) {
      debug("setting polling reference");
      this.configObservables(polling.updates);
      this._polling = polling;
    }
  }

  /** @return Polling intance reference */
  public get polling() {
    return this._polling;
  }

  /**
   * create a polling object to fetch updates
   * @param options polling configs
   * @return polling instance
   */
  public startPolling(options: I.PollingOptions = {}) {
    const polling = new Polling(this, options);
    return polling;
  }

  /**
   * create a webhook to receive updates
   * returns a request handler function to be used with express or node http
   * @return http request handler
   */
  public getWebhook() {
    const wh = new Webhook(this);
    return wh.getWebhook();
  }

  /**
   * Send a message with a SmartMenu. *This is a experimental feature*
   * @param chat_id Unique identifier for the target chat
   * @param smartMenu SmartMenu to send
   * @beta
   */
  public async sendSmartMenu(chat_id: number | string, smartMenu: SmartMenu) {
    const sentMenu = await this.sendMessage(chat_id, smartMenu.title, { reply_markup: { inline_keyboard: smartMenu.inline_keyboard }});

    if (sentMenu.ok) {
      smartMenu.chat_id = sentMenu.result.chat.id;
      smartMenu.message_id = sentMenu.result.message_id;
      this._smartMenus.unshift(smartMenu);
    }
    return sentMenu;
  }

  /**
   * Requires no parameters. Returns basic information about the bot in form of a `User` object.
   * @see {@link https://core.telegram.org/bots/api#getme}
   * @returns getMe result
   */
  public getMe(): Promise<I.TelegramResponse<I.User>> {
    return this.makeRequest<I.User>("getMe");
  }

  /**
   * Send a simple text message.
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param text Text to be sent.
   * @param optionals An object with optional params that you want to send in request or a reply callback function
   * @see {@link https://core.telegram.org/bots/api#sendmessage}
   */
  public async sendMessage(chat_id: number | string, text: string, optionals: I.SendMessageOptionals = {}): Promise<I.TelegramResponse<I.Message>> {

    const { onReceiveReply, ...optionalParams } = optionals;

    // telegram message text can not be greater than 4096 characters
    if (text.length > Bot.MAX_MESSAGE_LENGTH) {

      // if bot config allow message split, throw an error
      if (this.config.splitLongMessages) {
        // Wraps text in chunks of 4096 characters
        const splited_text = this.splitText(text, Bot.MAX_MESSAGE_LENGTH);

        // send chunks sequentially
        return splited_text.reduce((previous: Promise<I.TelegramResponse<I.Message>>, chunk: string, index) => {
          // sendMessage call itself with a acceptable text length
          // if this chunk is the last, pass optionals with reply handler callback
          return previous
            .then(() => this.sendMessage(chat_id, chunk, (index === splited_text.length - 1 ? optionals : optionalParams)));
        }, Promise.resolve({} as I.TelegramResponse<I.Message>));
      }
    }

    // from here on executes only if text <= 4096
    const json = {
      chat_id,
      text,
      ...optionals,
    };

    const _sendmsg = async (): Promise<I.TelegramResponse<I.Message>> => {
      const sentmsg = await this.makeRequest<I.Message>("sendMessage", { json });
      this.registerReplyHandler(sentmsg, onReceiveReply);
      return sentmsg;
    };

    if (this.config.sendChatActionBeforeMsg) {
      await this.sendChatAction(chat_id, "typing");
    }
    return await _sendmsg();
  }

  /**
   * Use this method to send a group of photos or videos as an album
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
   * @param optionals method optional params
   * @see {@link https://core.telegram.org/bots/api#sendmediagroup}
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
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param from_chat_id Unique identifier for the chat where the original message was sent.
   * @param message_id Message identifier in the chat specified in from_chat_id
   * @param disable_notification Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
   * @see {@link https://core.telegram.org/bots/api#forwardmessage}
   */
  public forwardMessage(chat_id: number | string, from_chat_id: number | string, message_id: number, disable_notification: boolean = false): Promise<I.TelegramResponse<I.Message>> {
    const params = { chat_id, from_chat_id, message_id, disable_notification };

    return this.makeRequest<I.Message>("forwardMessage", { json: params });
  }

  /**
   * Use this method to send photos.
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or pass read stream to upload your own file.
   * @param optionals An object with optional params that you want to send in request.
   * @see {@link https://core.telegram.org/bots/api#sendphoto}
   */
  public async sendPhoto(chat_id: number | string, photo: ReadStream | string, optionals: I.SendPhotoOptionals = {}): Promise<I.TelegramResponse<I.Message>> {
    const { onReceiveReply, ...optionalParams } = optionals;

    const formData = {
      chat_id,
      photo,
      ...optionalParams,
    };

    const _sendphoto = async (): Promise<I.TelegramResponse<I.Message>> => {
      const sent = await this.makeRequest<I.Message>("sendPhoto", { formData });
      this.registerReplyHandler(sent, onReceiveReply);
      return sent;
    };

    if (this.config.sendChatActionBeforeMsg) {
      await this.sendChatAction(chat_id, "upload_photo");
    }
    return await _sendphoto();
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format.
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or pass a read stream for upload your own.
   * @param optionals optional api method params
   * @see {@link https://core.telegram.org/bots/api#sendaudio}
   */
  public async sendAudio(chat_id: number | string, audio: ReadStream | string, optionals: I.SendAudioOptionals = {}): Promise<I.TelegramResponse<I.Message>> {
    const { onReceiveReply, ...optionalParams } = optionals;
    const formData = {
      audio,
      chat_id,
      ...optionalParams,
    };

    const _sendaudio = async (): Promise<I.TelegramResponse<I.Message>> => {
      const sent = await this.makeRequest<I.Message>("sendAudio", { formData });
      this.registerReplyHandler(sent, onReceiveReply);
      return sent;
    };

    if (this.config.sendChatActionBeforeMsg) {
      await this.sendChatAction(chat_id, "upload_audio");
    }
    return await _sendaudio();
  }

  /**
   * Use this method to send general files.
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing an read stream for file.
   * @param optionals An object with optional params that you want to send in request.
   * @see {@link https://core.telegram.org/bots/api#senddocument}
   */
  public async sendDocument(chat_id: number | string, doc: ReadStream | string, optionals: I.SendDocumentOptionals = {}): Promise<I.TelegramResponse<I.Message>> {
    const { onReceiveReply, ...optionalParams } = optionals;

    const formData = {
      chat_id,
      document: doc,
      ...optionalParams,
    };

    const _senddocument = async (): Promise<I.TelegramResponse<I.Message>> => {
      const sent = await this.makeRequest<I.Message>("sendDocument", { formData });
      this.registerReplyHandler(sent, onReceiveReply);
      return sent;
    };

    if (this.config.sendChatActionBeforeMsg) {
      await this.sendChatAction(chat_id, "upload_document");
    }
    return await _senddocument();
  }

  /**
   * Use this method to send .webp stickers
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .webp file from the Internet, or upload a new one passing a Read Stream for file.
   * @param optionals An object with optional params that you want to send in request.
   * @see {@link https://core.telegram.org/bots/api#sendsticker}
   */
  public async sendSticker(chat_id: number | string, sticker: ReadStream | string, optionals?: I.SendStickerOptionals): Promise<I.TelegramResponse<I.Message>> {
    const { onReceiveReply, ...optionalParams } = optionals;

    const formData = {
      chat_id,
      sticker,
      ...optionalParams,
    };

    const sent = await this.makeRequest<I.Message>("sendSticker", { formData });
    this.registerReplyHandler(sent, onReceiveReply);
    return sent;
  }

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document).
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video passing a read stream.
   * @param optionals An object with optional params that you want to send in request.
   * @see {@link https://core.telegram.org/bots/api#sendvideo}
   */
  public async sendVideo(chat_id: number | string, video: ReadStream | string, optionals: I.SendVideoOptionals = {}): Promise<I.TelegramResponse<I.Message>> {
    const { onReceiveReply, ...optionalParams } = optionals;

    const formData = {
      chat_id,
      video,
      ...optionalParams,
    };

    const _sendvideo = async (): Promise<I.TelegramResponse<I.Message>> => {
      const sent = await this.makeRequest<I.Message>("sendVideo", { formData });
      this.registerReplyHandler(sent, onReceiveReply);
      return sent;
    };

    if (this.config.sendChatActionBeforeMsg) {
      await this.sendChatAction(chat_id, "upload_video");
    }
    return await _sendvideo();
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document).
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing a read stream.
   * @param optionals An object with optional params that you want to send in request.
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
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param latitude Latitude of location
   * @param longitude Longitude of location
   * @param optionals An object with optional params that you want to send in request.
   * @see {@link https://core.telegram.org/bots/api#sendlocation}
   */
  public async sendLocation(chat_id: number | string, latitude: number, longitude: number, optionals: I.SendLocationOptionals = {}): Promise<I.TelegramResponse<I.Message>> {
    const { onReceiveReply, ...optionalParams } = optionals;

    const json = {
      chat_id,
      latitude,
      longitude,
      ...optionalParams,
    };

    const sent = await this.makeRequest<I.Message>("sendLocation", { json });
    this.registerReplyHandler(sent, onReceiveReply);
    return sent;
  }

  /**
   * Use this method to edit live location messages sent by the bot or via the bot
   * @param latitude Latitude of new location
   * @param longitude Longitude of new location
   * @param optionals optional method params
   * @see {@link https://core.telegram.org/bots/api#editmessagelivelocation}
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
   * @param optionals method params, see telegram docs to know how to use
   * @see {@link https://core.telegram.org/bots/api#stopmessagelivelocation}
   */
  public stopMessageLiveLocation(optionals: I.StopMessageLiveLocationOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = optionals || {};

    return this.makeRequest<I.Message | boolean>("stopMessageLiveLocation", { json });
  }

  /**
   * Use this method to send information about a venue.
   * @param chat_id Unique identifier for the target chat or username of the target channel.
   * @param latitude Latitude of location
   * @param longitude Longitude of location
   * @param title Name of the venue
   * @param address Address of the venue
   * @param optionals An object with optional params that you want to send in request.
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
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param phone_number Contact"s phone number
   * @param first_name Contact"s first name
   * @param optionals An object with optional params that you want to send in request.
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
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: `typing` for text messages, `upload_photo` for photos, `record_video` or `upload_video` for videos, `record_audio` or `upload_audio` for audio files, `upload_document` for general files, `find_location` for location data.
   * @see {@link https://core.telegram.org/bots/api#sendchataction}
   */
  public sendChatAction(chat_id: number | string, action: string): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id, action };

    return this.makeRequest<boolean>("sendChatAction", { json });
  }

  /**
   * Use this method to get a list of profile pictures for a user.
   * @param user_id Unique identifier of the target user
   * @param optionals An object with optional params that you want to send in request.
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
   * @param file_id File identifier to get info about
   * @see {@link https://core.telegram.org/bots/api#getfile}
   */
  public getFile(file_id: string): Promise<I.TelegramResponse<I.File>> {
    const json = { file_id };

    return this.makeRequest<I.File>("getFile", { json });
  }

  /**
   * Use this method to kick a user from a group or a supergroup.
   * In the case of supergroups, the user will not be able to return to the
   * group on their own using invite links, etc., unless unbanned first.
   * @param chat_id Unique identifier for the target group or username of the target supergroup
   * @param user_id Unique identifier of the target user
   * @param until_date Date when the user will be unbanned, unix time.
   * @see {@link https://core.telegram.org/bots/api#kickchatmember}
   */
  public kickChatMember(chat_id: number | string, user_id: number, until_date?: number): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id, user_id, until_date };

    return this.makeRequest<boolean>("kickChatMember", { json });
  }

  /**
   * Use this method for your bot to leave a group, supergroup or channel.
   * @param chat_id 	Unique identifier for the target chat or username of the target supergroup or channel
   * @see {@link https://core.telegram.org/bots/api#leavechat}
   */
  public leaveChat(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id };

    return this.makeRequest<boolean>("leaveChat", { json });
  }

  /**
   * Use this method to unban a previously kicked user in a supergroup.
   * @param chat_id Unique identifier for the target group or username of the target supergroup
   * @param user_id Unique identifier of the target user
   * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
   */
  public unbanChatMember(chat_id: number | string, user_id: number): Promise<I.TelegramResponse<boolean>> {
    const json = { chat_id, user_id };

    return this.makeRequest<boolean>("unbanChatMember", { json });
  }

  /**
   * Use this method to get up to date information about the chat
   * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
   */
  public getChat(chat_id: number | string): Promise<I.TelegramResponse<I.Chat>> {
    const json = { chat_id };

    return this.makeRequest<I.Chat>("getChat", { json });
  }

  /**
   * Use this method to get a list of administrators in a chat.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
   */
  public getChatAdministrators(chat_id: number | string): Promise<I.TelegramResponse<I.ChatMember[]>> {
    const json = { chat_id };

    return this.makeRequest<I.ChatMember[]>("getChatAdministrators", { json });
  }

  /**
   * Use this method to get the number of members in a chat.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @see {@link https://core.telegram.org/bots/api#getchatmemberscount}
   */
  public getChatMembersCount(chat_id: number | string): Promise<I.TelegramResponse<number>> {
    const json = { chat_id };

    return this.makeRequest<number>("getChatMembersCount", { json });
  }

  /**
   * Use this method to get information about a member of a chat.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel
   * @param user_id Unique identifier of the target user
   * @see {@link https://core.telegram.org/bots/api#getchatmember}
   */
  public getChatMember(chat_id: number | string, user_id: number): Promise<I.TelegramResponse<I.ChatMember>> {
    const json = { chat_id, user_id };

    return this.makeRequest<I.ChatMember>("getChatMember", { json });
  }

  /**
   * Use this method to send answers to callback queries sent from inline keyboards.
   * @param callback_query_id Unique identifier for the query to be answered
   * @param optionals An object with optional params that you want to send in request.
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
   * @param text New text of the message
   * @param optionals An object with optional params that you want to send in request.
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
   * @param optionals Method params, see telegram docs to know how to use
   * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
   */
  public editMessageCaption(optionals?: I.EditMessageCaptionOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = optionals;

    return this.makeRequest<I.Message | boolean>("editMessageCaption", { json });
  }

  /**
   * Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots)
   * @param optionals Object with method params
   * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
   */
  public editMessageReplyMarkup(optionals?: I.EditMessageReplyMarkupOptionals): Promise<I.TelegramResponse<I.Message | boolean>> {
    const json = optionals;

    return this.makeRequest<I.Message | boolean>("editMessageReplyMarkup", { json });
  }

  /**
   * Use this method to send answers to an inline query.
   * No more than 50 results per query are allowed.
   * @param inline_query_id Unique identifier for the answered query
   * @param results A JSON-serialized array of [results](https://core.telegram.org/bots/api#inlinequeryresult) for the inline query
   * @param optionals An object with optional params that you want to send in request.
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
   * @param chat_id Unique identifier for the target chat
   * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
   * @param optionals An object with optional params that you want to send in request.
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
   * @param user_id User identifier
   * @param score New score, must be non-negative
   * @param optionals An object with optional params that you want to send in request.
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
   * @param user_id Target user id
   * @param optionals An object with optional params that you want to send in request.
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
   * @param optionals An object with optional params that you want to send in request.
   * @see {@link https://core.telegram.org/bots/api#getupdates}
   */
  public getUpdates(optionals?: I.GetUpdatesOptionals): Promise<I.TelegramResponse<I.Update[]>> {
    const json = optionals || {};

    return this.makeRequest<I.Update[]>("getUpdates", { json });
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook.
   * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration
   * @param optionals An object with optional params that you want to send in request.
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
   * @see {@link https://core.telegram.org/bots/api#deletewebhook}
   */
  public deleteWebhook(): Promise<I.TelegramResponse<boolean>> {
    return this.makeRequest<boolean>("deleteWebhook");
  }

  /**
   * Use this method to get current webhook status. Requires no parameters.
   * @see {@link https://core.telegram.org/bots/api#deletewebhook}
   */
  public getWebhookInfo(): Promise<I.TelegramResponse<I.WebhookInfo>> {
    return this.makeRequest<I.WebhookInfo>("getWebhookInfo");
  }

  /**
   * Use this method to delete a message, including service messages.
   * Check Telegram official documentation to learn abot limitations.
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param message_id Identifier of the message to delete
   * @see {@link https://core.telegram.org/bots/api#deletemessage}
   */
  public deleteMessage(chat_id: number | string, message_id: number | string): Promise<I.TelegramResponse<boolean>> {
    return this.makeRequest<boolean>("deleteMessage", { formData: { chat_id, message_id } });
  }

  /**
   * Use this method to restrict a user in a supergroup.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup
   * @param user_id Unique identifier of the target user
   * @param options Object with optionals parameters
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
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param user_id Unique identifier of the target user
   * @param options Object with optionals parameters
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
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @see {@link https://core.telegram.org/bots/api#exportchatinvitelink}
   */
  public exportChatInviteLink(chat_id: number | string): Promise<I.TelegramResponse<string>> {
    const formData = { chat_id };

    return this.makeRequest<string>("exportChatInviteLink", { formData });
  }

  /**
   * Use this method to set a new profile photo for the chat.
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param photo New chat photo.
   * @see {@link https://core.telegram.org/bots/api#setchatphoto}
   */
  public setChatPhoto(chat_id: number | string, photo: ReadStream): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, photo };

    return this.makeRequest<boolean>("setChatPhoto", { formData });
  }

  /**
   * Use this method to delete a chat photo
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @see {@link https://core.telegram.org/bots/api#deletechatphoto}
   */
  public deleteChatPhoto(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id };

    return this.makeRequest<boolean>("deleteChatPhoto", { formData });
  }

  /**
   * Use this method to change the title of a chat.
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param title New chat title, 1-255 characters
   * @see {@link https://core.telegram.org/bots/api#setchattitle}
   */
  public setChatTitle(chat_id: number | string, title: string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, title };

    return this.makeRequest<boolean>("setChatTitle", { formData });
  }

  /**
   * Use this method to change the description of a supergroup or a channel.
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param description New chat description, 0-255 characters
   * @see {@link https://core.telegram.org/bots/api#setchatdescription}
   */
  public setChatDescription(chat_id: number | string, description: string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, description };

    return this.makeRequest<boolean>("setChatDescription", { formData });
  }

  /**
   * Use this method to pin a message in a supergroup.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup
   * @param message_id Identifier of a message to pin
   * @param disable_notification Pass True, if it is not necessary to send a notification to all group members about the new pinned message. Default false
   * @see {@link https://core.telegram.org/bots/api#pinchatmessage}
   */
  public pinChatMessage(chat_id: number | string, message_id: number | string, disable_notification = false): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id, message_id, disable_notification };

    return this.makeRequest<boolean>("pinChatMessage", { formData });
  }

  /**
   * Use this method to unpin a message in a supergroup chat.
   * @param chat_id Unique identifier for the target chat or username of the target supergroup
   * @see {@link https://core.telegram.org/bots/api#unpinchatmessage}
   */
  public unpinChatMessage(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const formData = { chat_id };

    return this.makeRequest<boolean>("unpinChatMessage", { formData });
  }

  /**
   * Use this method to get a sticker set.
   * @param name Name of the sticker set
   * @see {@link https://core.telegram.org/bots/api#getstickerset}
   */
  public getStickerSet(name: string): Promise<I.TelegramResponse<I.StickerSet>> {
    const formData = { name };

    return this.makeRequest<I.StickerSet>("getStickerSet", { formData });
  }

  /**
   * Use this method to upload a .png file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times).
   * @param user_id User identifier of sticker file owner
   * @param png_sticker Png image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px.
   * @see {@link https://core.telegram.org/bots/api#uploadstickerfile}
   */
  public uploadStickerFile(user_id: number, png_sticker: ReadStream): Promise<I.TelegramResponse<I.File>> {
    const formData = { user_id, png_sticker };

    return this.makeRequest<I.File>("uploadStickerFile", { formData });
  }

  /**
   * Use this method to create new sticker set owned by a user.
   * @param user_id User identifier of created sticker set owner
   * @param name Short name of sticker set, to be used in t.me/addstickers/ URLs
   * @param title Sticker set title, 1-64 characters
   * @param png_sticker Png image with the sticker
   * @param emojis One or more emoji corresponding to the sticker
   * @param options Object with optionals parameters
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
   */
  public deleteChatStickerSet(chat_id: number | string): Promise<I.TelegramResponse<boolean>> {
    const json = {
      chat_id,
    };

    return this.makeRequest<boolean>("deleteChatStickerSet", { json });
  }

  /**
   * Use this method to add a new sticker to a set created by the bot.
   * @param user_id User identifier of sticker set owner
   * @param name Sticker set name
   * @param png_sticker Png image with the sticker
   * @param emojis One or more emoji corresponding to the sticker
   * @param [mask_position] A JSON-serialized object for position where the mask should be placed on faces
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
   * @param sticker File identifier of the sticker
   * @param position New sticker position in the set, zero-based
   * @see {@link https://core.telegram.org/bots/api#setstickerpositioninset}
   */
  public setStickerPositionInSet(sticker: string, position: number): Promise<I.TelegramResponse<boolean>> {
    const formData = { sticker, position };

    return this.makeRequest<boolean>("setStickerPositionInSet", { formData });
  }

  /**
   * Use this method to send invoices.
   * @param chat_id Unique identifier for the target private chat
   * @param title Product name, 1-32 characters
   * @param description Product description, 1-255 characters
   * @param payload Bot-defined invoice payload, 1-128 bytes.
   * @param provider_token Payments provider token, obtained via Botfather
   * @param start_parameter Unique deep-linking parameter that can be used to generate this invoice when used as a start parameter
   * @param currency Three-letter ISO 4217 currency code
   * @param prices Price breakdown, a list of components
   * @param optionals Optional method params
   * @see {@link https://core.telegram.org/bots/api#sendinvoice}
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
   * @param shipping_query_id Unique identifier for the query to be answered
   * @param ok Specify True if delivery to the specified address is possible and False if there are any problems
   * @param optionals Object with optional parameters
   * @see {@link https://core.telegram.org/bots/api#answershippingquery}
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
   * @param pre_checkout_query_id Unique identifier for the query to be answered
   * @param ok Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order.
   * @param error_message Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout
   * @see {@link https://core.telegram.org/bots/api#answerprecheckoutquery}
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
   * @param sticker File identifier of the sticker
   * @see {@link https://core.telegram.org/bots/api#deletestickerfromset}
   */
  public deleteStickerFromSet(sticker: string): Promise<I.TelegramResponse<boolean>> {
    const formData = { sticker };

    return this.makeRequest<boolean>("deleteStickerFromSet", { formData });
  }

  /**
   * Use this method to edit audio, document, photo, or video messages.
   * See official Telegram docs for a complete reference.
   * @param media A JSON-serialized object for a new media content of the message
   * @param optionals Optional params, see Telegram Official API for a complete reference
   * @see {@link https://core.telegram.org/bots/api#editmessagemedia}
   */
  public editMessageMedia(media: I.InputMedia, optionals: I.EditMessageMediaOptionals = {}): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      media,
      ...optionals,
    };

    return this.makeRequest<I.Message>("editMessageMedia", { formData });
  }

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound).
   * @param chat_id Unique identifier for the target chat or username of the target channel
   * @param animation Animation to send. A file_id, web URL or a ReadStream to upload your own file
   * @param optionals Optional params
   * @see {@link https://core.telegram.org/bots/api#sendanimation}
   */
  public sendAnimation(chat_id: number | string, animation: ReadStream | string, optionals: I.SendAnimationOptionals): Promise<I.TelegramResponse<I.Message>> {
    const formData = {
      animation,
      chat_id,
      ...optionals,
    };

    return this.makeRequest<I.Message>("sendAnimation", { formData });
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

    if ("formData" in params) {
      params.formData = stringifyFormData(params.formData);
    }

    debug("fetching telegram api");
    return request.post(
      {
        uri,
        ...params,
        transform: (body, response) => {
          if (typeof body === "string") {
            try {
              return JSON.parse(body);
            } catch (err) {
              return body;
            }
          }

          return body;
        },
      },
    ).promise();
  }

  /**
   * Check if a received message has a callback for handle it.
   * If it has, call the function.
   * Return true if a callback handler was found, false otherwise.
   * @param message received message
   */
  private _checkRegisteredCallbacks(message: I.Message): boolean {
    if (!message.reply_to_message) {
      debug("Message isn't a reply, skipping");
      return false;
    }
    if (this.repliesCallbacks.length === 0) {
      debug(`There's no callback queries registered, skipping`);
      return false;
    }
    debug(`I have ${this.repliesCallbacks.length} reply callbacks`);

    let i;
    const cbk = this.repliesCallbacks.find((rc, index) => {
      if (rc.message_id === message.reply_to_message.message_id && rc.chat === message.from.id) {
        debug(`Reply handler found for message ${rc.message_id} from ${rc.chat}`);
        // save index
        i = index;
        // return true for find() function
        return true;
      }

      // return false for find() fn
      return false;
    });

    // check if a callback was found
    if (cbk) {
      cbk.f(message, createMessageActions(message, this));
      // remove handler from array
      this.repliesCallbacks.splice(i, 1);
      // a handler was found, so return true
      return true;
    }
    debug(`Reply handler not found for message ${message.reply_to_message.message_id} from ${message.from.id}`);
    return false;
  }

  private registerReplyHandler(sentMsg: I.TelegramResponse<I.Message>, cbk: Types.OnReplyCallbackFunction): I.TelegramResponse<I.Message> {
    if (cbk) {

      if (!isFunction(cbk)) {
        throw new Error(`registerReplyHandler: expected a function, received ${typeof cbk}`);
      }
      const { message_id, chat } = sentMsg.result;

      debug(`Registering reply handler to message ${message_id} on chat ${chat.id}`);
      this.repliesCallbacks.push({
        chat: chat.id,
        message_id,

        f: cbk,
      });
    }

    return sentMsg;
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

  private configObservables(origin: Observable<ExplicitTypedUpdate>) {
    const msgObservable = createFilteredUpdateObservable(origin, "message")
      .pipe(
        filter((update) => !this._checkRegisteredCallbacks(update.message)),
        map((update) => ({ update, actions: createMessageActions(update.message, this) })),
      );

    createFilteredUpdateObservable(origin, "edited_message").subscribe(this.editedMessage$);
    createFilteredUpdateObservable(origin, "channel_post").subscribe(this.channelPost$);
    createFilteredUpdateObservable(origin, "edited_channel_post").subscribe(this.editedChannelPost$);
    createFilteredUpdateObservable(origin, "inline_query").subscribe(this.inlineQuery$);
    createFilteredUpdateObservable(origin, "chosen_inline_result").subscribe(this.chosenInlineResult$);
    createFilteredUpdateObservable(origin, "callback_query")
        .pipe(
          filter((cbkQuery) => {
            debug(`${this._smartMenus.length} smart menus on array`);

            this._smartMenus.forEach((smartMenu, index) => {

              if (smartMenu.checkCallbackQueryUpdate(cbkQuery.callback_query)) {
                debug("smart menu found in array, running function");

                const kill = (): void => {
                  debug("kill was called, removing smart menu");
                  const i = this._smartMenus.indexOf(smartMenu);
                  if (i >= 0) {
                    debug("found on index ", i);
                    this._smartMenus.splice(i, 1);
                  }
                };

                smartMenu.run(cbkQuery.callback_query, this, kill)
                  .then((result) => {
                    if (result && result instanceof SmartMenu) {
                      debug("new SmartMenu instance returned, replacing in array");
                      this._smartMenus.splice(index, 1, result);
                    } else if (result === null) {
                      debug("null was returned, removing smart menu from array");
                      this._smartMenus.splice(index, 1);
                    }
                  });

                return false; // breaks propagation of update
              }
            });

            return true;
          }),
        ).subscribe(this.callbackQuery$);
    createFilteredUpdateObservable(origin, "shipping_query").subscribe(this.shippingQuery$);
    createFilteredUpdateObservable(origin, "pre_checkout_query").subscribe(this.preCheckoutQuery$);

    msgObservable.subscribe(this.message$);
    createFilteredMessageObservable(this.message$, "text").subscribe(this.text$);
    createFilteredMessageObservable(this.message$, "audio").subscribe(this.audio$);
    createFilteredMessageObservable(this.message$, "document").subscribe(this.document$);
    createFilteredMessageObservable(this.message$, "game").subscribe(this.game$);
    createFilteredMessageObservable(this.message$, "photo").subscribe(this.photo$);
    createFilteredMessageObservable(this.message$, "sticker").subscribe(this.sticker$);
    createFilteredMessageObservable(this.message$, "video").subscribe(this.video$);
    createFilteredMessageObservable(this.message$, "voice").subscribe(this.voice$);
    createFilteredMessageObservable(this.message$, "video_note").subscribe(this.videoNote$);
    createFilteredMessageObservable(this.message$, "contact").subscribe(this.contact$);
    createFilteredMessageObservable(this.message$, "location").subscribe(this.location$);
    createFilteredMessageObservable(this.message$, "venue").subscribe(this.venue$);
    createFilteredMessageObservable(this.message$, "new_chat_members").subscribe(this.newChatMembers$);
    createFilteredMessageObservable(this.message$, "left_chat_member").subscribe(this.leftChatMember$);
    createFilteredMessageObservable(this.message$, "new_chat_title").subscribe(this.newChatTitle$);
    createFilteredMessageObservable(this.message$, "new_chat_photo").subscribe(this.newChatPhoto$);
    createFilteredMessageObservable(this.message$, "delete_chat_photo").subscribe(this.deleteChatPhoto$);
    createFilteredMessageObservable(this.message$, "group_chat_created").subscribe(this.groupChatCreated$);
    createFilteredMessageObservable(this.message$, "supergroup_chat_created").subscribe(this.supergroupChatCreated$);
    createFilteredMessageObservable(this.message$, "channel_chat_created").subscribe(this.channelChatCreated$);
    createFilteredMessageObservable(this.message$, "pinned_message").subscribe(this.pinnedMessage$);
    createFilteredMessageObservable(this.message$, "invoice").subscribe(this.invoice$);
    createFilteredMessageObservable(this.message$, "successful_payment").subscribe(this.successfulPayment$);
  }

  private emojify = (text: string) => this.config.emojifyTexts ? nodeEmoji.emojify(text) : text;
}
