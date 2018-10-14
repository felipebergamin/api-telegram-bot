export interface File {
  /** Unique identifier for this file */
  file_id: string;
  /** Optional. File size, if known */
  file_size?: number;
  /** Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file. */
  file_path?: string;
}
