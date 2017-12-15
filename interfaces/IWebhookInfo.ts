export interface IWebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date: number;
  last_error_message: string;
  max_connections: number;
  allowed_updates: string[];
}
