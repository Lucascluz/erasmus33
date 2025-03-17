'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardFooter } from '@heroui/card';
import { Room } from '@/interfaces/room';
import { TrashIcon } from '@heroicons/react/24/solid';
import { User } from '@/interfaces/user';
import { User as UserComponent } from '@heroui/user';
import { Link, Select, SelectItem } from '@heroui/react';

export default function RoomCreatePage() {
	const router = useRouter();

	const [room, setRoom] = useState<Room | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);
	const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const params = useParams(); // For App Router

	useEffect(() => {
		const fetchUsers = async () => {
			const { data: users, error } = await supabase.from('users').select('*');
			if (error) {
				console.error('Error fetching users:', error.message);
			} else {
				setUsers(users);
			}
		};

		fetchUsers();
	}, []);

	// Create a blank room object
	useEffect(() => {
		setRoom({
			house_number: room?.house_number ?? 0,
			number: room?.number ?? 0,
			price: room?.price ?? 0,
			description: room?.description ?? '',
			type: room?.type ?? '',
			beds_left: room?.beds_left ?? 0,
			renters: room?.renters ?? [],
			is_available: room?.is_available ?? false,
			images: room?.images ?? [],
		});

		// Garante que sempre que sempre que um arquivo for adicinado a UI atualiza
		if (newImageFiles && newImageFiles.length > 0) {
			updateRoomImagesUI();
		}
	}, [newImageFiles]);

	async function updateRoomImagesUI() {
		if (!newImageFiles || newImageFiles.length === 0) {
			console.error('No images selected to upload!');
			return;
		}

		const newUrls = Array.from(newImageFiles).map((file) =>
			URL.createObjectURL(file)
		);

		setNewImageUrls((prevUrls) => [...prevUrls, ...newUrls]);

		console.log('Updated image URLs:', newUrls);
	}

	async function deleteRoomImageFromUI(imageUrl: string) {
		// Optimistically update UI
		setNewImageUrls(newImageUrls.filter((url) => url !== imageUrl));
		console.log(newImageUrls);
	}

	// Insert room data in the database
	const insertRoomData = async (event: React.FormEvent<HTMLFormElement>) => {
		if (!room) return;
		event.preventDefault();
		setLoading(true);

		// Creating a new row with the room data:
		console.log('Creating a new row with the room data:', room);
		const { data, error: insError } = await supabase
			.from('rooms')
			.insert({
				house_number: room?.house_number ?? 0,
				number: room?.number ?? 0,
				price: room?.price ?? 0,
				description: room?.description ?? '',
				type: room?.type ?? '',
				beds_left: room?.beds_left ?? 0,
				renters: room?.renters ?? [],
				is_available: room?.is_available ?? false,
				images: room?.images ?? [],
			})
			.select('id') // Select the ID of the new row
			.single();

		const newRoomId = data ? data.id : null;

		if (insError) {
			console.error(
				'Error creating room regsiter:',
				insError.message,
				insError.details
			);
			return;
		}

		// Upload images to the storage bucket
		for (const file of Array.from(newImageFiles || [])) {
			// Construct the file path in storage
			const filePath = `room_${newRoomId}/${file.name}`;

			// Upload the file to Supabase storage
			const { error: uplError } = await supabase.storage
				.from('room_images')
				.upload(filePath, file);

			if (uplError || !newRoomId) {
				console.error('Error uploading image:', uplError?.message);
				continue;
			}

			// Get the public URL of the uploaded image
			const { data } = supabase.storage.from('room_images').getPublicUrl(filePath);

			// Insert the image URL in the database
			if (data) {
				const { error: imgError } = await supabase
					.from('rooms')
					.update({ images: [...room.images, data.publicUrl] })
					.eq('id', newRoomId);

				if (imgError) {
					console.error('Error updating image URL:', imgError.message);
				} else {
					console.log('Image uploaded successfully:', data);
					setRoom({ ...room, images: [...room.images, data.publicUrl] });
				}
			}
		}
		setLoading(false);
	};

	if (!room) return <div>Loading...</div>;

	return (
		<div className='container mx-auto py-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold mb-4'>Registering a new room</h1>
				<Button variant='bordered' onPress={() => router.push('/admin/rooms')}>
					Back to Rooms
				</Button>
			</div>

			<Card className='p-4'>
				<form onSubmit={insertRoomData} className='space-y-4'>
					<div className='grid grid-cols-4 gap-3'>
						<Input
							label='House Number'
							type='number'
							value={room.house_number.toString()}
							onChange={(e) =>
								setRoom({ ...room, house_number: parseInt(e.target.value) })
							}
						/>
						<Input
							label='Room Number'
							type='number'
							value={room.number.toString()}
							onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value) })}
						/>
						<Input
							label='Price'
							placeholder='0.00'
							startContent={
								<div className='pointer-events-none flex items-center'>
									<span className='text-default-400 text-small'>$</span>
								</div>
							}
							type='number'
							onChange={(e) => setRoom({ ...room, price: parseFloat(e.target.value) })}
						/>
						<Input
							label='Type'
							type=''
							value={room.type}
							onChange={(e) => setRoom({ ...room, type: e.target.value })}
						/>
					</div>
					<Input
						label='Description'
						type='text'
						value={room.description}
						onChange={(e) => setRoom({ ...room, description: e.target.value })}
					/>
					<Input
						label='Beds Left'
						type='number'
						value={room.beds_left.toString()}
						onChange={(e) =>
							setRoom({ ...room, beds_left: parseInt(e.target.value) })
						}
					/>

					<Select
						className='max-w-xs'
						label='Add a renter'
						placeholder='Select a user'
						selectionMode='multiple'>
						{users
							.filter((user) => !room.renters?.includes(user.id))
							.map((user) => (
								<SelectItem key={user.id}>
									{user.first_name + ' ' + user.last_name}
								</SelectItem>
							))}
					</Select>

					{room.renters?.length > 0 ? (
						<div className='grid grid-cols-4 gap-3'>
							{users
								.filter((user) => room.renters?.includes(user.id))
								.map((user, index) => (
									<UserComponent
										avatarProps={{
											src: `${user.profile_picture}`,
										}}
										name={user.first_name + ' ' + user.last_name}
									/>
								))}
						</div>
					) : (
						<p>There is no one renting this room</p>
					)}

					<p>Upload New Images</p>
					<div className='flex items-center space-x-4'>
						<Input
							color='primary'
							type='file'
							multiple
							onChange={(e) => {
								if (e.target.files) {
									const files = e.target.files; // Variável temporária
									console.log('New images selected:', files);
									setNewImageFiles(files);
								}
							}}
						/>
					</div>

					{newImageUrls?.length > 0 ? (
						<div className='grid grid-cols-4 gap-3'>
							{newImageUrls.map((imageURL, index) => (
								<Card key={index} className='cursor-pointer'>
									{newImageUrls.length > 0 ? (
										<img
											key={index}
											src={imageURL}
											alt={`House Image ${index}`}
											className='w-full h-48 object-cover rounded'
										/>
									) : (
										<div className='w-full h-48 flex justify-center items-center'>
											<span className='text-gray-500'>No Image Available</span>
										</div>
									)}
									<CardFooter className='flex justify-end'>
										<Button
											className='h-10'
											variant='solid'
											color='danger'
											onPress={() => deleteRoomImageFromUI(imageURL)}>
											<TrashIcon className='h-5 w-5' />
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					) : (
						<p>No images related to this room</p>
					)}
				</form>
			</Card>
		</div>
	);
}
