export interface Profile {
	user_id?: string; // UUID
	first_name: string;
	last_name: string;
	phone_number: string;
	email: string;
	picture_url?: string;
	country: string;
	preferred_language: string | 'pt' | 'en';
	role: string | 'user'; // Default role
	arrival_date?: Date; // ISO string
	departure_date?: Date; // ISO string
	is_active: boolean; // Default true
}
