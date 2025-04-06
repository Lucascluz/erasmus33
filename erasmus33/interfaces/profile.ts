export interface Profile {
	user_id?: string; // UUID
	first_name: string;
	last_name: string;
	phone_number: string;
	pt_phone_number: string;
	email: string;
	picture_url?: string;
	proof_of_residence?: string; // Optional field
	passport_picture_url?: string; // Optional field
	passport_number?: string; // Optional field
	country: string;
	preferred_language: string | 'pt' | 'en';
	room_id?: string; // UUID // Optional field
	room_number?: number; // Optional field
	house_id?: string; // UUID // Optional field
	house_number?: number; // Optional field
	arrival_date?: Date | null; // Nullable // Optional field
	departure_estimate?: Date | null; // Nullable // Optional field
	role: string | 'user'; // Default role
}
