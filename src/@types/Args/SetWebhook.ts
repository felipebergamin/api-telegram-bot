import type { ReadStream } from 'fs';

export default interface SetWebhook {
  url: string;
  /**
   * Upload your public key certificate so that the root certificate in use can be checked.
   */
  certificate?: ReadStream;
  /**
   * Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100.
   */
  max_connections?: number;
  /**
   * List the types of updates you want your bot to receive.
   * For example, specify [`message`, `edited_channel_post`, `callback_query`] to only receive updates of these types.
   */
  allowed_updates?: string[];
}
