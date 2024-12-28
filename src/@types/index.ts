import type {
  SendMessage,
  SendPhoto,
  ChatPhoto,
  Message,
  User,
  ForwardMessage,
  SendMediaGroup,
  SendAudio,
  SendDocument,
  GetChatMember,
  ChatMember,
  Chat,
  File,
  SendSticker,
  SendVideo,
  SendVoice,
  SendLocation,
  EditMessageLiveLocation,
  StopMessageLiveLocation,
  SendVenue,
  SendContact,
  SendPoll,
  StopPoll,
  Poll,
  SendChatAction,
  GetUserProfilePhotos,
  UserProfilePhotos,
  UnbanChatMember,
  AnswerCallbackQuery,
  EditMessageText,
  EditMessageCaption,
  EditMessageReplyMarkup,
  AnswerInlineQuery,
  SendGame,
  SetGameScore,
  GetGameHighScores,
  GameHighScore,
  GetUpdates,
  Update,
  SetWebhook,
  WebhookInfo,
  DeleteMessage,
  RestrictChatMember,
  PromoteChatMember,
  SetChatPhoto,
  SetChatTitle,
  SetChatDescription,
  StickerSet,
  UploadStickerFile,
  CreateNewStickerSet,
  SetStickerPositionInSet,
  SendInvoice,
  AnswerShippingQuery,
  AnswerPreCheckoutQuery,
  EditMessageMedia,
  SendAnimation,
  LogOut,
  Close,
  ForwardMessages,
  CopyMessage,
  CopyMessages,
  SendVideoNote,
  SendPaidMedia,
  SendDice,
  SetMessageReaction,
  SetUserEmojiStatus,
  BanChatMember,
  SetChatAdministratorCustomTitle,
  BanChatSenderChat,
  UnbanChatSenderChat,
  SetChatPermissions,
  CreateChatInviteLink,
  EditChatInviteLink,
  CreateChatSubscriptionInviteLink,
  EditChatSubscriptionInviteLink,
  RevokeChatInviteLink,
  ApproveChatJoinRequest,
  DeclineChatJoinRequest,
  PinChatMessage,
  UnpinAllChatMessages,
  GetChatMemberCount,
  SetChatStickerSet,
  GetForumTopicIconStickers,
  CreateForumTopic,
  EditForumTopic,
  CloseForumTopic,
  ReopenForumTopic,
  DeleteForumTopic,
  UnpinAllForumTopicMessages,
  EditGeneralForumTopic,
  CloseGeneralForumTopic,
  ReopenGeneralForumTopic,
  HideGeneralForumTopic,
  UnhideGeneralForumTopic,
  UnpinAllGeneralForumTopicMessages,
  GetUserChatBoosts,
  GetBusinessConnection,
  SetMyCommands,
  DeleteMyCommands,
  GetMyCommands,
  SetMyName,
  GetMyName,
  SetMyDescription,
  GetMyDescription,
  SetMyShortDescription,
  GetMyShortDescription,
  SetChatMenuButton,
  GetChatMenuButton,
  SetMyDefaultAdministratorRights,
  GetMyDefaultAdministratorRights,
  DeleteMessages,
  GetCustomEmojiStickers,
  AddStickerToSet,
  ReplaceStickerInSet,
  SetStickerEmojiList,
  SetStickerKeywords,
  SetStickerMaskPosition,
  SetStickerSetTitle,
  SetStickerSetThumbnail,
  SetCustomEmojiStickerSetThumbnail,
  DeleteStickerSet,
  GetAvailableGifts,
  SendGift,
  AnswerWebAppQuery,
  SavePreparedInlineMessage,
  CreateInvoiceLink,
  GetStarTransactions,
  RefundStarPayment,
  EditUserStarSubscription,
  SetPassportDataErrors,
  UnpinChatMessage,
  MessageId,
  ChatInviteLink,
  Sticker,
  ForumTopic,
  UserChatBoosts,
  BusinessConnection,
  BotCommand,
  BotName,
  BotDescription,
  BotShortDescription,
  MenuButton,
  ChatAdministratorRights,
  Gifts,
  SentWebAppMessage,
  PreparedInlineMessage,
  StarTransactions,
} from './generated';

export type ApiMethods = {
  sendMessage: [SendMessage, Message];
  sendPhoto: [SendPhoto, ChatPhoto];
  getMe: [never, User];
  forwardMessage: [ForwardMessage, Message];
  sendMediaGroup: [SendMediaGroup, Message[]];
  sendAudio: [SendAudio, Message];
  sendDocument: [SendDocument, Message];
  getChatMembersCount: [number | string, number];
  getChatMember: [GetChatMember, ChatMember];
  getChat: [string | number, Chat];
  getChatAdministrators: [number | string, ChatMember[]];
  leaveChat: [number | string, boolean];
  getFile: [string, File];
  sendSticker: [SendSticker, Message];
  sendVideo: [SendVideo, Message];
  sendVoice: [SendVoice, Message];
  sendLocation: [SendLocation, Message];
  editMessageLiveLocation: [EditMessageLiveLocation, Message | boolean];
  stopMessageLiveLocation: [StopMessageLiveLocation, Message | boolean];
  sendVenue: [SendVenue, Message];
  sendContact: [SendContact, Message];
  sendPoll: [SendPoll, Message];
  stopPoll: [StopPoll, Poll];
  sendChatAction: [SendChatAction, boolean];
  getUserProfilePhotos: [GetUserProfilePhotos, UserProfilePhotos];
  unbanChatMember: [UnbanChatMember, boolean];
  answerCallbackQuery: [AnswerCallbackQuery, boolean];
  editMessageText: [EditMessageText, Message | boolean];
  editMessageCaption: [EditMessageCaption, Message | boolean];
  editMessageReplyMarkup: [EditMessageReplyMarkup, Message | boolean];
  answerInlineQuery: [AnswerInlineQuery, boolean];
  sendGame: [SendGame, Message];
  setGameScore: [SetGameScore, Message | boolean];
  getGameHighScores: [GetGameHighScores, GameHighScore[]];
  getUpdates: [GetUpdates, Update[]];
  setWebhook: [SetWebhook, boolean];
  deleteWebhook: [never, boolean];
  getWebhookInfo: [never, WebhookInfo];
  deleteMessage: [DeleteMessage, boolean];
  restrictChatMember: [RestrictChatMember, boolean];
  promoteChatMember: [PromoteChatMember, boolean];
  exportChatInviteLink: [number | string, string];
  setChatPhoto: [SetChatPhoto, boolean];
  deleteChatPhoto: [number | string, boolean];
  setChatTitle: [SetChatTitle, boolean];
  setChatDescription: [SetChatDescription, boolean];
  pinChatMessage: [PinChatMessage, boolean];
  unpinChatMessage: [UnpinChatMessage, boolean];
  getStickerSet: [string, StickerSet];
  uploadStickerFile: [UploadStickerFile, File];
  createNewStickerSet: [CreateNewStickerSet, boolean];
  deleteChatStickerSet: [number | string, boolean];
  setStickerPositionInSet: [SetStickerPositionInSet, boolean];
  sendInvoice: [SendInvoice, Message];
  answerShippingQuery: [AnswerShippingQuery, boolean];
  answerPreCheckoutQuery: [AnswerPreCheckoutQuery, boolean];
  deleteStickerFromSet: [string, boolean];
  editMessageMedia: [EditMessageMedia, Message];
  sendAnimation: [SendAnimation, Message];
  logOut: [LogOut, boolean];
  close: [Close, boolean];
  forwardMessages: [ForwardMessages, MessageId[]];
  copyMessage: [CopyMessage, MessageId];
  copyMessages: [CopyMessages, MessageId[]];
  sendVideoNote: [SendVideoNote, Message];
  sendPaidMedia: [SendPaidMedia, Message];
  sendDice: [SendDice, Message];
  setMessageReaction: [SetMessageReaction, boolean];
  setUserEmojiStatus: [SetUserEmojiStatus, boolean];
  banChatMember: [BanChatMember, boolean];
  setChatAdministratorCustomTitle: [SetChatAdministratorCustomTitle, boolean];
  banChatSenderChat: [BanChatSenderChat, boolean];
  unbanChatSenderChat: [UnbanChatSenderChat, boolean];
  setChatPermissions: [SetChatPermissions, boolean];
  createChatInviteLink: [CreateChatInviteLink, ChatInviteLink];
  editChatInviteLink: [EditChatInviteLink, ChatInviteLink];
  createChatSubscriptionInviteLink: [CreateChatSubscriptionInviteLink, ChatInviteLink];
  editChatSubscriptionInviteLink: [EditChatSubscriptionInviteLink, ChatInviteLink];
  revokeChatInviteLink: [RevokeChatInviteLink, ChatInviteLink];
  approveChatJoinRequest: [ApproveChatJoinRequest, boolean];
  declineChatJoinRequest: [DeclineChatJoinRequest, boolean];
  unpinAllChatMessages: [UnpinAllChatMessages, boolean];
  getChatMemberCount: [GetChatMemberCount, number];
  setChatStickerSet: [SetChatStickerSet, boolean];
  getForumTopicIconStickers: [GetForumTopicIconStickers, Sticker[]];
  createForumTopic: [CreateForumTopic, ForumTopic];
  editForumTopic: [EditForumTopic, boolean];
  closeForumTopic: [CloseForumTopic, boolean];
  reopenForumTopic: [ReopenForumTopic, boolean];
  deleteForumTopic: [DeleteForumTopic, boolean];
  unpinAllForumTopicMessages: [UnpinAllForumTopicMessages, boolean];
  editGeneralForumTopic: [EditGeneralForumTopic, boolean];
  closeGeneralForumTopic: [CloseGeneralForumTopic, boolean];
  reopenGeneralForumTopic: [ReopenGeneralForumTopic, boolean];
  hideGeneralForumTopic: [HideGeneralForumTopic, boolean];
  unhideGeneralForumTopic: [UnhideGeneralForumTopic, boolean];
  unpinAllGeneralForumTopicMessages: [
    UnpinAllGeneralForumTopicMessages,
    boolean,
  ];
  getUserChatBoosts: [GetUserChatBoosts, UserChatBoosts];
  getBusinessConnection: [GetBusinessConnection, BusinessConnection];
  setMyCommands: [SetMyCommands, boolean];
  deleteMyCommands: [DeleteMyCommands, boolean];
  getMyCommands: [GetMyCommands, BotCommand[]];
  setMyName: [SetMyName, boolean];
  getMyName: [GetMyName, BotName];
  setMyDescription: [SetMyDescription, boolean];
  getMyDescription: [GetMyDescription, BotDescription];
  setMyShortDescription: [SetMyShortDescription, boolean];
  getMyShortDescription: [GetMyShortDescription, BotShortDescription];
  setChatMenuButton: [SetChatMenuButton, boolean];
  getChatMenuButton: [GetChatMenuButton, MenuButton];
  setMyDefaultAdministratorRights: [SetMyDefaultAdministratorRights, boolean];
  getMyDefaultAdministratorRights: [GetMyDefaultAdministratorRights, ChatAdministratorRights];
  deleteMessages: [DeleteMessages, boolean];
  getCustomEmojiStickers: [GetCustomEmojiStickers, Sticker[]];
  addStickerToSet: [AddStickerToSet, boolean];
  replaceStickerInSet: [ReplaceStickerInSet, boolean];
  setStickerEmojiList: [SetStickerEmojiList, boolean];
  setStickerKeywords: [SetStickerKeywords, boolean];
  setStickerMaskPosition: [SetStickerMaskPosition, boolean];
  setStickerSetTitle: [SetStickerSetTitle, boolean];
  setStickerSetThumbnail: [SetStickerSetThumbnail, boolean];
  setCustomEmojiStickerSetThumbnail: [
    SetCustomEmojiStickerSetThumbnail,
    boolean,
  ];
  deleteStickerSet: [DeleteStickerSet, boolean];
  getAvailableGifts: [GetAvailableGifts, Gifts];
  sendGift: [SendGift, boolean];
  answerWebAppQuery: [AnswerWebAppQuery, SentWebAppMessage];
  savePreparedInlineMessage: [SavePreparedInlineMessage, PreparedInlineMessage];
  createInvoiceLink: [CreateInvoiceLink, string];
  getStarTransactions: [GetStarTransactions, StarTransactions];
  refundStarPayment: [RefundStarPayment, boolean];
  editUserStarSubscription: [EditUserStarSubscription, boolean];
  setPassportDataErrors: [SetPassportDataErrors, boolean];
};
