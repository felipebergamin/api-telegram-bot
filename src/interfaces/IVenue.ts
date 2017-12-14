import { ILocation as Location } from "./ILocation";

export interface IVenue {
  location: Location;
  title: string;
  address: string;
  foursquare_id: string;
}
