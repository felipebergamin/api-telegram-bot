import { IPhotoSize as PhotoSize } from "./IPhotoSize";

export interface IUserProfilePhotos {
  total_count: number;
  photos: PhotoSize[];
}
