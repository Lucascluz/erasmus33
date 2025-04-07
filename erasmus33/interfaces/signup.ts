export interface SignUpFormData {
	email: string;
	password: string;
	profile_picture?: File | null;
	first_name?: string;
	last_name?: string;
	phone_number?: string;
	country?: string;
	preferred_language?: 'pt' | 'en';
	role?: 'user';
}
