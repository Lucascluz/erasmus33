export interface Room {
	id?: string; //uuid
	number: number;
	house_id: string; //uuid
	house_number: number;
	price: number;
	description: string;
	type: string | 'single' | 'double' | 'triple' | 'quad'; // Default type
	beds: number;
	renters: string[];
	is_available: boolean;
	images: string[];
}
