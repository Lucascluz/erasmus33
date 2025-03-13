import { UUID } from 'crypto';

export interface User {
	id: UUID;
	nationality: string;
	preferred_language: string;
	room_number: number;
	house_number: number;
	arrival_date: Date;
	departure_estimate: Date;
	role: string;
	profile_picture: string;
	phone_number: string;
	pt_phone_number: string;
	email: string;
	first_name: string;
	last_name: string;
}
