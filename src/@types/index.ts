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
  logOut: [LogOut, unknown];
  close: [Close, unknown];
  forwardMessages: [ForwardMessages, unknown];
  copyMessage: [CopyMessage, unknown];
  copyMessages: [CopyMessages, unknown];
  sendVideoNote: [SendVideoNote, unknown];
  sendPaidMedia: [SendPaidMedia, unknown];
  sendDice: [SendDice, unknown];
  setMessageReaction: [SetMessageReaction, unknown];
  setUserEmojiStatus: [SetUserEmojiStatus, unknown];
  banChatMember: [BanChatMember, unknown];
  setChatAdministratorCustomTitle: [SetChatAdministratorCustomTitle, unknown];
  banChatSenderChat: [BanChatSenderChat, unknown];
  unbanChatSenderChat: [UnbanChatSenderChat, unknown];
  setChatPermissions: [SetChatPermissions, unknown];
  createChatInviteLink: [CreateChatInviteLink, unknown];
  editChatInviteLink: [EditChatInviteLink, unknown];
  createChatSubscriptionInviteLink: [CreateChatSubscriptionInviteLink, unknown];
  editChatSubscriptionInviteLink: [EditChatSubscriptionInviteLink, unknown];
  revokeChatInviteLink: [RevokeChatInviteLink, unknown];
  approveChatJoinRequest: [ApproveChatJoinRequest, unknown];
  declineChatJoinRequest: [DeclineChatJoinRequest, unknown];
  unpinAllChatMessages: [UnpinAllChatMessages, unknown];
  getChatMemberCount: [GetChatMemberCount, unknown];
  setChatStickerSet: [SetChatStickerSet, unknown];
  getForumTopicIconStickers: [GetForumTopicIconStickers, unknown];
  createForumTopic: [CreateForumTopic, unknown];
  editForumTopic: [EditForumTopic, unknown];
  closeForumTopic: [CloseForumTopic, unknown];
  reopenForumTopic: [ReopenForumTopic, unknown];
  deleteForumTopic: [DeleteForumTopic, unknown];
  unpinAllForumTopicMessages: [UnpinAllForumTopicMessages, unknown];
  editGeneralForumTopic: [EditGeneralForumTopic, unknown];
  closeGeneralForumTopic: [CloseGeneralForumTopic, unknown];
  reopenGeneralForumTopic: [ReopenGeneralForumTopic, unknown];
  hideGeneralForumTopic: [HideGeneralForumTopic, unknown];
  unhideGeneralForumTopic: [UnhideGeneralForumTopic, unknown];
  unpinAllGeneralForumTopicMessages: [
    UnpinAllGeneralForumTopicMessages,
    unknown,
  ];
  getUserChatBoosts: [GetUserChatBoosts, unknown];
  getBusinessConnection: [GetBusinessConnection, unknown];
  setMyCommands: [SetMyCommands, unknown];
  deleteMyCommands: [DeleteMyCommands, unknown];
  getMyCommands: [GetMyCommands, unknown];
  setMyName: [SetMyName, unknown];
  getMyName: [GetMyName, unknown];
  setMyDescription: [SetMyDescription, unknown];
  getMyDescription: [GetMyDescription, unknown];
  setMyShortDescription: [SetMyShortDescription, unknown];
  getMyShortDescription: [GetMyShortDescription, unknown];
  setChatMenuButton: [SetChatMenuButton, unknown];
  getChatMenuButton: [GetChatMenuButton, unknown];
  setMyDefaultAdministratorRights: [SetMyDefaultAdministratorRights, unknown];
  getMyDefaultAdministratorRights: [GetMyDefaultAdministratorRights, unknown];
  deleteMessages: [DeleteMessages, unknown];
  getCustomEmojiStickers: [GetCustomEmojiStickers, unknown];
  addStickerToSet: [AddStickerToSet, unknown];
  replaceStickerInSet: [ReplaceStickerInSet, unknown];
  setStickerEmojiList: [SetStickerEmojiList, unknown];
  setStickerKeywords: [SetStickerKeywords, unknown];
  setStickerMaskPosition: [SetStickerMaskPosition, unknown];
  setStickerSetTitle: [SetStickerSetTitle, unknown];
  setStickerSetThumbnail: [SetStickerSetThumbnail, unknown];
  setCustomEmojiStickerSetThumbnail: [
    SetCustomEmojiStickerSetThumbnail,
    unknown,
  ];
  deleteStickerSet: [DeleteStickerSet, unknown];
  getAvailableGifts: [GetAvailableGifts, unknown];
  sendGift: [SendGift, unknown];
  answerWebAppQuery: [AnswerWebAppQuery, unknown];
  savePreparedInlineMessage: [SavePreparedInlineMessage, unknown];
  createInvoiceLink: [CreateInvoiceLink, unknown];
  getStarTransactions: [GetStarTransactions, unknown];
  refundStarPayment: [RefundStarPayment, unknown];
  editUserStarSubscription: [EditUserStarSubscription, unknown];
  setPassportDataErrors: [SetPassportDataErrors, unknown];
};
