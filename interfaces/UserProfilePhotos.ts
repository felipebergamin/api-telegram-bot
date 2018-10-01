import { PhotoSize } from "./PhotoSize";

export interface UserProfilePhotos {
  total_count: number;
  photos: PhotoSize[];
}
