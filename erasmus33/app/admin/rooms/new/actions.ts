'use server';

import { Room } from '@/interfaces/room';

export const handleCreateRoomAction = async (room: Room, images: File[]) => {
	// Handle room creation logic here
	console.log('Room:', room);
	console.log('Images:', images);

	// Example: Upload images and save room data
	// Add your implementation here
};
