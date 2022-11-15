export default interface PhotoSize {
  /** Unique identifier for this file */
  file_id: string;
  /** Photo width */
  width: number;
  /** Photo height */
  height: number;
  /** Optional. File size */
  file_size?: number;
}
