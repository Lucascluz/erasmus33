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
	taken_rooms: number;
	images: string[];
}
