import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Room } from '@/interfaces/room';
import { createRoom } from '@/app/admin/rooms/new/actions';
import { deleteRoom, updateRoom } from '@/app/admin/rooms/edit/actions';
import { redirect } from 'next/navigation';
import { uploadImagesToStorage } from '@/app/admin/rooms/actions';
import { v4 } from 'uuid';
import { z } from 'zod';

const roomTypes = [
	{ value: 'single', beds: 1 },
	{ value: 'double', beds: 2 },
	{ value: 'triple', beds: 3 },
	{ value: 'quadruple', beds: 4 },
	{ value: 'suite', beds: 2 },
]

const defaultRoom: Room = {
	id: v4(),
	number: 0,
	house_id: '',
	house_number: 0,
	price: 0,
	description: '',
	type: 'single',
	beds: 1,
	renters: [],
	is_available: true,
	images: [],
};

export function useRoomForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
	const supabase = createClient();
	const [room, setRoom] = useState<Room>(defaultRoom);
	const [housesData, setHousesData] = useState<{ id: string; number: number }[]>([]);
	const [displayedImageUrls, setDisplayedImageUrls] = useState<string[]>([]);
	const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
	const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(mode === 'create');

	useEffect(() => {
		const fetchHousesData = async () => {
			const { data, error } = await supabase
				.from('houses')
				.select('id, number')
				.order('number', { ascending: true });
			if (error) {
				console.error('Error fetching houses:', error);
				return;
			}
			if (!data) {
				console.error('No houses found');
				return;
			}
			// Check if the data is an array and has the expected structure
			if (!Array.isArray(data) || !data.every((item) => item.id && item.number)) {
				console.error('Invalid houses data:', data);
				return;
			}

			setHousesData(data || []);
		}

		fetchHousesData();

		if (mode === 'edit' && id) {
			const fetchRoom = async () => {
				const { data, error } = await supabase
					.from('rooms')
					.select('*')
					.eq('id', id)
					.single();
				if (error) {
					console.error('Error fetching room:', error);
					return;
				}
				if (!data) {
					console.error('No room found with the given ID');
					return;
				}
				setRoom({ ...data, number: Number(data.number) });
				setDisplayedImageUrls(data.images || []);
				setHasLoaded(true);
			};
			fetchRoom();
		}
	}, [id, supabase]);

	const handleImageAdd = useCallback((file: File) => {
		const tempUrl = URL.createObjectURL(file);
		setDisplayedImageUrls((prev) => [...prev, tempUrl]);
		setNewImageFiles((prev) => [...prev, file]);
	}, []);

	const handleImageRemove = useCallback((url: string) => {

		const index = displayedImageUrls.indexOf(url);

		setDeletedImageUrls((prev) => [...prev, displayedImageUrls[index]]);
		setDisplayedImageUrls((prev) => prev.filter((_, i) => i !== index));
		setRoom((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
	}, [displayedImageUrls]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Validate the room object before proceeding
		if (!validateRoom(room)) {
			setLoading(false);
			return;
		}

		// Check is there are any new images to upload
		let newImageUrls: string[] = [];
		if (newImageFiles.length > 0) {
			newImageUrls = await uploadImagesToStorage(room.id, newImageFiles);
		}

		if (mode === 'create') {
			await createRoom(room, newImageUrls);
		} else if (mode === 'edit') {
			await updateRoom(room, newImageUrls, deletedImageUrls);
		}

		redirect('/admin');
	};

	const handleDelete = async () => {
		setLoading(true);
		await deleteRoom(room);
		redirect('/admin');
	};

	return {
		room,
		housesData,
		hasLoaded,
		loading,
		displayedImageUrls,
		setRoom,
		handleImageAdd,
		handleImageRemove,
		handleSubmit,
		handleDelete,
	};
}

const validateRoom = (room: Room) => {
	// Verify that the room object has the required properties
	if (!room || typeof room !== 'object') {
		console.error('Invalid room object:', room);
		return false;
	}

	const roomSchema = z.object({
		id: z.string().uuid(),
		number: z.number().int().positive(),
		house_id: z.string().uuid(),
		house_number: z.number().int().positive(),
		price: z.number().int().positive(),
		description: z.string().optional(),
		type: z.string().refine((val) => roomTypes.some((type) => type.value === val), {
			message: 'Invalid room type',
		}),
		beds: z.number().int().refine((val) => roomTypes.some((type) => type.beds === val), {
			message: 'Invalid number of beds',
		}),
		renters: z.array(z.string()).optional(),
	}); const parsedRoom = roomSchema.safeParse(room);
	if (!parsedRoom.success) {
		parsedRoom.error.errors.forEach((error) => {
			console.error('Validation error:', error.message);
		});
		return false;
	}
	return true;
}
