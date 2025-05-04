'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { z } from 'zod';
import { Room, roomTypes } from '@/interfaces/room';
import { v4 } from 'uuid';

const emptyRoom: Room = {
	id: v4(),
	number: 0,
	price: 150,
	type: 'single',
	house_id: '',
	house_number: 0,
	description: '',
	beds: 1,
	images: [],
	renters: [],
	is_available: true
};

export const useRoomForm = () => {
	const supabase = createClient();

	const [room, setRoom] = useState<Room>(emptyRoom);
	const [roomImagesFiles, setRoomImagesFiles] = useState<File[]>([]);
	const [roomImagesUrls, setRoomImagesUrls] = useState<string[]>([]);
	const [housesData, setHousesData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const roomSchema = z.object({
		number: z.number().min(1, 'Room number must be greater than 0'),
		price: z.number().min(0, 'Price must be greater than or equal to 0'),
		type: z.string().refine((type) => roomTypes.some((t) => t.id === type), {
			message: 'Invalid room type',
		}),
		beds: z.number().refine(
			(beds) => beds === roomTypes.find((type) => type.id === room.type)?.beds,
			{
				message: 'Number of beds must correspond to the selected room type',
			}
		),
		house_id: z.string(),
		house_number: z.number(),
		description: z.string().max(500, 'Description is too long'),
	});

	useEffect(() => {
		const fetchHousesData = async () => {
			const { data, error } = await supabase.from('houses').select('id, number');
			if (error) {
				console.error('Error fetching houses:', error);
				setError('Failed to fetch houses data.');
			} else {
				setHousesData(data);
			}
		};
		fetchHousesData();
	}, []);

	const updateImagePreview = useCallback((file: File) => {
		const tempUrl = URL.createObjectURL(file);
		setRoomImagesUrls((prev) => [...prev, tempUrl]);
		setRoomImagesFiles((prev) => [...prev, file]);
	}, []);

	const removeImage = (index: number) => {
		setRoomImagesFiles((prev) => prev.filter((_, i) => i !== index));
		setRoomImagesUrls((prev) => prev.filter((_, i) => i !== index));
	};

	const validateRoom = () => {
		try {
			roomSchema.parse(room);
			return true;
		} catch (err) {
			console.error('Validation error:', err);
			setError('Validation failed. Please check the fields.');
			return false;
		}
	};

	return {
		room,
		roomImagesFiles,
		roomImagesUrls,
		housesData,
		loading,
		error,
		setRoom,
		setLoading,
		setError,
		updateImagePreview,
		removeImage,
		validateRoom,
	};
};
