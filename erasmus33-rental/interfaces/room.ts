import { UUID } from "crypto";

export interface Room {
  id?: UUID;
  house: UUID;
  number: number;
  price: number;
  description: string;
  beds: number;
  renters: UUID[];
  is_available: boolean;
  images: string[];
}
