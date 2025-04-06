export interface House {
	id?: string;
	street: string;
	number: number;
	postal_code: string;
	description: string;
	google_maps: string;
	street_view: string;
	total_rooms: number;
	full_rooms: number;
	images: string[];
}
