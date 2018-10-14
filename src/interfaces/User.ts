export interface User {
  /** Unique identifier for this user or bot */
  id: number;
  /** True, if this user is a bot */
  is_bot: boolean;
  /** User‘s or bot’s first name */
  first_name: string;
  /** Optional. User‘s or bot’s last name */
  last_name?: string;
  /** Optional. User‘s or bot’s username */
  username?: string;
  /** Optional. IETF language tag of the user's language */
  language_code?: string;
}
