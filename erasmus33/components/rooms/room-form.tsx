'use client';

import { useCallback, useEffect, useState } from 'react';
import { Room } from '@/interfaces/room';
import { Card, Image } from '@heroui/react';
import ImageCropper from '../ui/image-cropper';

type userData = {
	id: string;
	first_name: string;
	last_name: string;
	profile_picture: string;
};

type houseData = {
	id: string;
	number: number;
};

type RoomFormProps = {
	dto: { users: userData[]; houses: houseData[] };
	initialData?: Room | null;
	onSubmit: (room: Room, images: File[]) => void;
};

export default function RoomForm({ initialData, onSubmit }: RoomFormProps) {
	const [room, setRoom] = useState<Room>(
		initialData || {
			id: '',
			number: 0,
			price: 0,
			description: '',
			beds: 0,
			type: 'single',
			renters: [],
			house_id: '',
			house_number: 0,
			is_available: true,
			images: [],
		}
	);

	const [roomImagesFiles, setRoomImagesFiles] = useState<File[]>([]);
	const [roomImagesUrls, setRoomImagesUrls] = useState<string[]>([]);

	useEffect(() => {
		if (initialData) {
			setRoom(initialData);
			setRoomImagesUrls(initialData.images);
		}
	}, [initialData]);

	const updateUi = useCallback(
		async (file: File) => {
			// Create a temporary URL for immediate UI update
			const tempUrl = URL.createObjectURL(file);

			// Optimistically update UI
			setRoomImagesUrls((prev) => [...prev, tempUrl]);
			setRoomImagesFiles((prev) => [...prev, file]);
		},
		[setRoomImagesUrls, setRoomImagesFiles]
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(room, roomImagesFiles);
	};

	return (
		<Card className='p-4'>
			<form className='space-y-4' onSubmit={handleSubmit}>
				<ImageCropper aspectRatio='16/9' callback={updateUi} />
				{roomImagesUrls.map((image, index) => (
					<Image
						key={index}
						src={image}
						alt={`Room Image ${index + 1}`}
						className='w-full h-48 object-cover rounded-md'
					/>
				))}
			</form>
		</Card>
	);
}
