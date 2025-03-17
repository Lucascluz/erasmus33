'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardFooter } from '@heroui/card';
import { Room } from '@/interfaces/room';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function RoomEditPage() {
	const router = useRouter();

	const [room, setRoom] = useState<Room | null>(null);
	const [newImages, setNewImages] = useState<FileList | null>(null);
	const [loading, setLoading] = useState(false);

	const params = useParams(); // For App Router
	const id = params?.id; // Get ID from URL

	// Fetch room data from Supabase
	useEffect(() => {
		if (!id) return;
		const fetchRoom = async () => {
			const { data, error } = await supabase
				.from('rooms')
				.select('*')
				.eq('id', id)
				.single();
			if (error) console.error('Error fetching room:', error);
			else setRoom(data);
		};
		fetchRoom();
	}, [id]);

	async function uploadRoomImages(roomId: number, files: FileList) {
		if (!room) return;

		const newUrls: string[] = [];
		const updatedImages = [...(room.images || [])]; // Create a new copy

		// Optimistically update UI before upload finishes
		for (const file of Array.from(files)) {
			const tempUrl = URL.createObjectURL(file); // Create a temporary URL
			updatedImages.push(tempUrl); // Add to UI
		}
		setRoom({ ...room, images: updatedImages });

		for (const file of Array.from(files)) {
			const filePath = `room_${roomId}/${file.name}`;

			const { error } = await supabase.storage
				.from('room_images')
				.upload(filePath, file);

			if (error) {
				console.error('Error uploading image:', error.message);
				continue;
			}

			const { data: publicURL } = supabase.storage
				.from('room_images')
				.getPublicUrl(filePath);

			if (publicURL.publicUrl) {
				newUrls.push(publicURL.publicUrl);
			}
		}

		if (newUrls.length === 0) {
			console.error('No images successfully uploaded.');
			return;
		}

		// Merge real URLs and update the database
		const finalImages = [...(room.images || []), ...newUrls];

		const { error: updateError } = await supabase
			.from('rooms')
			.update({ images: finalImages })
			.eq('id', roomId);

		if (updateError) {
			console.error('Error updating room images:', updateError.message);
		} else {
			setRoom({ ...room, images: finalImages }); // Ensure UI reflects real URLs
		}
	}

	async function deleteRoomImage(roomId: number, imageUrl: string) {
		if (!room) return;

		// Optimistically update UI first
		const updatedImages = room.images?.filter((img) => img !== imageUrl) || [];
		setRoom({ ...room, images: updatedImages });

		// Extract file path from URL
		const filePath = imageUrl.split('/').slice(-2).join('/');

		const { error } = await supabase.storage
			.from('room_images')
			.remove([filePath]);

		if (error) {
			console.error('Error deleting image:', error.message);
			return;
		}

		// Sync with the database
		const { error: updateError } = await supabase
			.from('rooms')
			.update({ images: updatedImages })
			.eq('id', roomId);

		if (updateError) {
			console.error('Error updating room images:', updateError.message);
		}
	}

	// Update room data in the database
	const updateRoomData = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!room) return;
		setLoading(true);
		const updatedRoom = { ...room };

		console.log('Updating room data:', updatedRoom);
		const { error: updError } = await supabase
			.from('rooms')
			.update({
				house: room.house_number,
				price: room.price,
				type: room.type,
				description: room.description,
				beds_left: room.beds_left,
				is_available: room.is_available,
				availability_reason: room.availability_reason,
				availability_start: room.availability_start,
				images: room.images,
			})
			.eq('id', room.id);

		if (updError) {
			console.error('Error updating room:', updError.message, updError.details);
		} else {
			console.log('Room updated successfully:', updatedRoom);
			setRoom(updatedRoom);
		}
		setLoading(false);
	};

	const deleteRoom = async (id: number) => {
		setLoading(true);
		// Delete room data from the database
		console.log('Deleting room with ID:', id);
		const { error: dbError } = await supabase.from('rooms').delete().eq('id', id);
		if (dbError) {
			console.error('Error deleting room:', dbError);
		}

		// Delete room images from the storage bucket
		const { error: errorST } = await supabase.storage.deleteBucket(`rooms/${id}`);
		if (errorST) {
			console.error('Error deleting room images:', errorST);
		}
		router.push('/admin/rooms');
		setLoading(false);
	};

	if (!room) return <div>Loading...</div>;

	return (
		<div className='container mx-auto py-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold mb-4'>
					Editing Room: {room.number} at House {room.house_number}
				</h1>
				<Button variant='bordered' onPress={() => router.push('/admin/rooms')}>
					Back to Rooms
				</Button>
			</div>

			<Card className='p-4'>
				<form onSubmit={updateRoomData} className='space-y-4'>
					<Input
						label='Price'
						type='text'
						value={room.price.toString() ?? ''}
						onChange={(e) => setRoom({ ...room, price: parseInt(e.target.value) })}
					/>
					<Input
						label='Description'
						type='text'
						value={room.description ?? ''}
						onChange={(e) => setRoom({ ...room, description: e.target.value })}
					/>
					<Input
						label='Type'
						type='url'
						value={room.type ?? ''}
						onChange={(e) => setRoom({ ...room, type: e.target.value })}
					/>
					<Input
						label='Beds Left'
						type='url'
						value={room.beds_left.toString()}
						onChange={(e) =>
							setRoom({ ...room, beds_left: parseInt(e.target.value) })
						}
					/>
					<Input
						label='Is Available'
						type='boolean'
						value={room.is_available ? 'true' : 'false'}
						onChange={(e) =>
							setRoom({ ...room, is_available: e.target.value === 'true' })
						}
					/>
					`
					{room.is_available && (
						<Input
							label='Availability Reason'
							type='number'
							value={room.availability_reason}
							onChange={(e) =>
								setRoom({
									...room,
									availability_reason: (parseInt(e.target.value, 10) || 0).toString(),
								})
							}
						/>
					)}
					`
					<Input
						color='primary'
						type='file'
						multiple
						onChange={(e) => {
							if (e && e.target && e.target.files) {
								setNewImages(e.target.files);
							}
						}}
					/>
					<Button
						variant='solid'
						color={newImages ? 'success' : 'default'}
						onPress={() => {
							if (newImages) {
								uploadRoomImages(room.id, newImages);
							}
						}}
						disabled={loading || !newImages}>
						{loading ? 'Uploading...' : 'Upload Images'}
					</Button>
					{room.images?.length > 0
						? room.images.map((image: string, index: number) => (
								<Card key={room.id + index} className='cursor-pointer'>
									<img
										key={index}
										src={image}
										alt={`Room Image ${index}`}
										className='w-full h-48 object-cover rounded'
									/>
									<CardFooter className='flex justify-end'>
										<Button
											className='h-10'
											variant='solid'
											color='danger'
											onPress={() => deleteRoomImage(room.id, image)}>
											<TrashIcon className='h-5 w-5' />
										</Button>
									</CardFooter>
								</Card>
							))
						: null}
					<Button variant='solid' type='submit' color='primary'>
						Save Changes
					</Button>
					<Button
						variant='solid'
						color='danger'
						onPress={() => {
							deleteRoom(room.id);
						}}>
						Delete
					</Button>
				</form>
			</Card>
		</div>
	);
}
