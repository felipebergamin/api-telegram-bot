export interface InputMediaPhoto {
  /** Type of the result, must be photo */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers,
   * pass an HTTP URL for Telegram to get a file from the Internet
   */
  media: string;
  /** Optional. Caption of the photo to be sent, 0-200 characters */
  caption?: string;
  /**
   * Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic,
   * fixed-width text or inline URLs in the media caption.
   */
  parse_mode?: string;
}
