import type PhotoSize from './PhotoSize';

export default interface Document {
  /** Unique file identifier */
  file_id: string;
  /** Document thumbnail as defined by sender */
  thumb: PhotoSize;
  /** Original filename as defined by sender */
  file_name: string;
  /** MIME type of the file as defined by sender */
  mime_type: string;
  /** File size */
  file_size: number;
}
