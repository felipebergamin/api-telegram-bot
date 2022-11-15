export default interface RestrictChatMember {
  chat_id: number | string;
  user_id: number | string;
  /**
   * Date when restrictions will be lifted for the user, unix time.
   */
  until_date?: number;
  /**
   * Pass True, if the user can send text messages, contacts, locations and venues
   */
  can_send_messages?: boolean;
  /**
   * Pass True, if the user can send audios, documents, photos, videos, video notes and voice notes,
   * implies can_send_messages
   */
  can_send_media_messages?: boolean;
  /**
   * Pass True, if the user can send animations, games, stickers and use inline bots, implies can_send_media_messages
   */
  can_send_other_messages?: boolean;
  /**
   * Pass True, if the user may add web page previews to their messages, implies can_send_media_messages
   */
  can_add_web_page_previews?: boolean;
}
