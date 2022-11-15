import type Location from './Location';

export default interface Venue {
  /** Venue location */
  location: Location;
  /** Name of the venue */
  title: string;
  /** Address of the venue */
  address: string;
  /** Optional. Foursquare identifier of the venue */
  foursquare_id: string;
  /**
   * Optional. Foursquare type of the venue.
   * (For example, `arts_entertainment/default`, `arts_entertainment/aquarium` or `food/icecream`.)
   */
  foursquare_type: string;
}
