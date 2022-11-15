export default interface ForwardMessage {
  chat_id: number | string;
  from_chat_id: number | string;
  message_id: number;
  disable_notification?: boolean;
}
