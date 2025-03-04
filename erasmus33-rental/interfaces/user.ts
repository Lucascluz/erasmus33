import { UUID } from 'crypto';

export interface User {
	id: UUID;
	full_name: string;
	nationality: string;
	preferred_language: string;
	room_number: number;
	house_number: number;
	arrival_date: Date;
	departure_estimate: Date;
	role: string;
	profile_picture: string;
}
