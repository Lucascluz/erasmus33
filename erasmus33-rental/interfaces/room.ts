import { UUID } from "crypto";

export interface Room {
	id?: UUID;
	house_number: number;
	number: number;
	price: number;
	description: string;
	type: string;
	beds_left: number;
	renters: UUID[];
	is_available: boolean;
	images: string[];
}
