export interface ITelegramResponse<T> {
  ok: boolean;
  description?: string;
  result: T;
}
