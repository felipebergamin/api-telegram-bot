export default interface GetUserProfilePhotos {
  user_id: number | string;
  /**
   * Sequential number of the first photo to be returned. By default, all photos are returned.
   */
  offset?: number;
  /**
   * Limits the number of photos to be retrieved. Values between 1—100 are accepted.
   */
  limit?: number;
}
