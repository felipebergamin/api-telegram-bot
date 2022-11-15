import type ForceReply from './ForceReply';
import type InlineKeyboardMarkup from './InlineKeyboardMarkup';
import type ReplyKeyboardMarkup from './ReplyKeyboardMarkup';
import type ReplyKeyboardRemove from './ReplyKeyboardRemove';

type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply;

export default ReplyMarkup;
