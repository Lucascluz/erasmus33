import { UUID } from 'crypto';

export interface User {
	id?: UUID;
	first_name: string;
	last_name: string;
	phone_number: string;
	pt_phone_number: string;
	email: string;
	profile_picture: string;
	nationality: string;
	preferred_language: string;
	room_number?: number;
	house_number?: number;
	arrival_date?: Date;
	departure_estimate?: Date;
	role: string;
}
