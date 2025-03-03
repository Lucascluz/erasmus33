import { UUID } from 'crypto';

export interface User {
	id: UUID;
	fullName: string;
	nationality: string;
	preferredLanguage: string;
	roomNumber: number;
	houseNumber: number;
	arrivalDate: Date;
	departureEstimate: Date;
	role: string;
	profilePicture: string;
}
