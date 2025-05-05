export const roomTypes = [
	{ id: 'single', name: 'Single', beds: 1 },
	{ id: 'double', name: 'Double', beds: 2 },
	{ id: 'triple', name: 'Triple', beds: 3 },
	{ id: 'quadruple', name: 'Quadruple', beds: 4 },
]

export interface Room {
	id: string; //uuid
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
