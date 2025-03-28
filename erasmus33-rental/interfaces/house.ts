import { UUID } from "crypto";

export interface House {
  id?: UUID;
  street: string;
  number: string;
  postal_code: string;
  description: string;
  google_maps: string;
  street_view: string;
  total_rooms: number;
  available_rooms: boolean[];
  images: string[];
}
