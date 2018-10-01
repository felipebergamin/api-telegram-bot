import { PhotoSize } from "./PhotoSize";

export interface Animation {
  file_id: string;
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}
