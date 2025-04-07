'use client';

import { useCallback, useEffect, useState } from 'react';
import { Room } from '@/interfaces/room';
import {
	Button,
	Card,
	CardFooter,
	Image,
	Input,
	Select,
	SelectItem,
	User,
} from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { TrashIcon } from 'lucide-react';
import {
	handleCreateRoomBase,
	updateRoomImages,
} from '@/app/admin/rooms/actions';
import { createClient } from '@/utils/supabase/client';

interface RoomFormProps {
	initialData?: Room;
	housesData: { id: string; number: number }[];
	usersData: {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
		profile_picture: string;
	}[];
}

export default function RoomForm({
	initialData,
	housesData,
	usersData,
}: RoomFormProps) {
	const [room, setRoom] = useState<Room>(
		initialData || {
			id: '',
			number: 0,
			price: 0,
			description: '',
			beds: 0,
			type: 'single',
			renters: [],
			is_available: true,
			images: [],
			house_id: '',
			house_number: 0,
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
			const tempUrl = URL.createObjectURL(file);
			setRoomImagesUrls((prev) => [...prev, tempUrl]);
			setRoomImagesFiles((prev) => [...prev, file]);
		},
		[setRoomImagesUrls, setRoomImagesFiles]
	);

	async function uploadImagesToStorage(id: string, files: File[]) {
		const supabase = createClient();

		const urls: string[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const { data, error } = await supabase.storage
				.from('room_images')
				.upload(`${id}/${i}`, file, { upsert: true });

			if (error) {
				console.error('Error uploading image:', error);
				continue;
			}

			const { data: publicUrlData } = supabase.storage
				.from('room_images')
				.getPublicUrl(`${id}/${i}`);

			if (publicUrlData?.publicUrl) {
				urls.push(publicUrlData.publicUrl);
			}
		}

		return urls;
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			// 1. Create the room
			const roomId = await handleCreateRoomBase(room);
			if (!roomId) {
				alert('Error creating the room');
				return;
			}

			// 2. Upload images
			const urls = await uploadImagesToStorage(roomId, roomImagesFiles);

			// 3. Update room with image URLs
			await updateRoomImages(roomId, urls);

			// 4. Redirect
			redirect('/admin');
		} catch (error) {
			console.error('Error submitting the form:', error);
			alert('An error occurred. Please try again.');
		}
	};

	return (
		<Card className='p-4'>
			<form className='space-y-4' onSubmit={handleSubmit}>
				<div className='grid grid-cols-2 gap-4'>
					<Input
						type='text'
						label='Room Number'
						value={room.number.toString()}
						onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value) })}
					/>
					<Input
						type='number'
						label='Price'
						value={room.price.toString()}
						onChange={(e) => setRoom({ ...room, price: parseFloat(e.target.value) })}
					/>
					<Select
						label='Type'
						value={room.type}
						onChange={(e) => setRoom({ ...room, type: e.target.value })}>
						<SelectItem key='single' data-value='single'>
							Single
						</SelectItem>
						<SelectItem key='shared' data-value='shared'>
							Shared
						</SelectItem>
					</Select>
					<Input
						type='number'
						label='Beds'
						value={room.beds.toString()}
						disabled={room.type === 'single'}
						onChange={(e) => setRoom({ ...room, beds: parseInt(e.target.value) })}
					/>
					<Select
						label='House'
						value={room.house_id}
						onChange={(value) => {
							const selectedHouse = housesData.find(
								(house) => house.id === value.toString()
							);
							if (selectedHouse) {
								setRoom({
									...room,
									house_id: selectedHouse.id,
									house_number: selectedHouse.number,
								});
							}
						}}>
						{housesData.map((house) => (
							<SelectItem key={house.id} data-value={house.id}>
								House {house.number}
							</SelectItem>
						))}
					</Select>
					<Select
						label='Renters'
						value={room.renters}
						multiple
						onChange={(e) => {
							const selectedValues = Array.from(
								e.target.selectedOptions,
								(option) => option.value
							);
							setRoom({ ...room, renters: selectedValues });
						}}>
						{usersData.map((user) => (
							<SelectItem key={user.id} text-value={user.first_name}>
								<User
									avatarProps={{ src: user.profile_picture }}
									name={`${user.first_name} ${user.last_name}`}
									description={user.email}
								/>
							</SelectItem>
						))}
					</Select>
				</div>
				<Input
					type='text'
					label='Description'
					value={room.description}
					onChange={(e) => setRoom({ ...room, description: e.target.value })}
				/>
				<ImageCropper aspectRatio='16/9' callback={updateUi} />
				<div className='grid grid-cols-4 gap-4'>
					{roomImagesUrls.map((image, index) => (
						<Card key={index} className='w-full overflow-hidden items-end'>
							<Image
								src={image}
								alt={`Room Image ${index + 1}`}
								className='w-full object-cover rounded-md'
								children={null}
							/>
							<TrashIcon
								className='h-5 w-5 m-2 hover:text-danger cursor-pointer'
								onClick={() => {
									setRoomImagesUrls((prev) => prev.filter((_, i) => i !== index));
									setRoomImagesFiles((prev) => prev.filter((_, i) => i !== index));
								}}
							/>
						</Card>
					))}
				</div>
				<CardFooter className='flex justify-between'>
					<Button className='p-2 rounded-md' color='primary' type='submit'>
						Submit
					</Button>
					<Button
						className='p-2 rounded-md'
						color='danger'
						type='button'
						onPress={() => redirect('/admin')}>
						Cancel
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
