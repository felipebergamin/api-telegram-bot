export default interface TelegramResponse<T> {
  ok: boolean;
  description?: string;
  result: T;
}
