export default interface SetGameScore {
  user_id: number;
  score: number;
  /**
   * Pass True, if the high score is allowed to decrease.
   */
  force?: boolean;
  /**
   * Pass True, if the game message should not be automatically edited to include the current scoreboard
   */
  disable_edit_message?: boolean;
  /**
   * Required if `inline_message_id` is not specified. Unique identifier for the target chat
   */
  chat_id?: number;
  /**
   * Required if `inline_message_id` is not specified. Identifier of the sent message
   */
  message_id?: number;
  /**
   * Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
   */
  inline_message_id?: string;
}
