'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardFooter } from '@heroui/card';
import { House } from '@/interfaces/house';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function HouseEditPage() {
	const router = useRouter();

	const [house, setHouse] = useState<House | null>(null);
	const [newImages, setNewImages] = useState<FileList | null>(null);
	const [loading, setLoading] = useState(false);

	const params = useParams(); // For App Router
	const id = params?.id; // Get ID from URL

	// Fetch house data from Supabase
	useEffect(() => {
		if (!id) return;
		const fetchHouse = async () => {
			const { data, error } = await supabase
				.from('houses')
				.select('*')
				.eq('id', id)
				.single();
			if (error) console.error('Error fetching house:', error);
			else setHouse(data);
		};
		fetchHouse();
	}, [id]);

	async function uploadHouseImages(houseId: number, files: FileList) {
		if (!house) return;

		const newUrls: string[] = [];
		const updatedImages = [...(house.images || [])]; // Create a new copy

		// Optimistically update UI before upload finishes
		for (const file of Array.from(files)) {
			const tempUrl = URL.createObjectURL(file); // Create a temporary URL
			updatedImages.push(tempUrl); // Add to UI
		}
		setHouse({ ...house, images: updatedImages });

		for (const file of Array.from(files)) {
			const filePath = `house_${houseId}/${file.name}`;

			const { data, error } = await supabase.storage
				.from('house_images')
				.upload(filePath, file);

			if (error) {
				console.error('Error uploading image:', error.message);
				continue;
			}

			const { data: publicURL } = supabase.storage
				.from('house_images')
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
		const finalImages = [...(house.images || []), ...newUrls];

		const { error: updateError } = await supabase
			.from('houses')
			.update({ images: finalImages })
			.eq('id', houseId);

		if (updateError) {
			console.error('Error updating house images:', updateError.message);
		} else {
			setHouse({ ...house, images: finalImages }); // Ensure UI reflects real URLs
		}
	}

	async function deleteHouseImage(houseId: number, imageUrl: string) {
		if (!house) return;

		// Optimistically update UI first
		const updatedImages = house.images?.filter((img) => img !== imageUrl) || [];
		setHouse({ ...house, images: updatedImages });

		// Extract file path from URL
		const filePath = imageUrl.split('/').slice(-2).join('/');

		const { error } = await supabase.storage
			.from('house_images')
			.remove([filePath]);

		if (error) {
			console.error('Error deleting image:', error.message);
			return;
		}

		// Sync with the database
		const { error: updateError } = await supabase
			.from('houses')
			.update({ images: updatedImages })
			.eq('id', houseId);

		if (updateError) {
			console.error('Error updating house images:', updateError.message);
		}
	}

	// Update house data in the database
	const updateHouseData = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!house) return;
		setLoading(true);
		const updatedHouse = { ...house };

		console.log('Updating house data:', updatedHouse);
		const { error: updError } = await supabase
			.from('houses')
			.update({
				street: updatedHouse.street,
				number: updatedHouse.number,
				postal_code: updatedHouse.postal_code,
				maps_link: updatedHouse.maps_link,
				street_view: updatedHouse.street_view,
				total_rooms: updatedHouse.total_rooms,
				available_rooms: updatedHouse.available_rooms,
			})
			.eq('id', house.id);

		if (updError) {
			console.error('Error updating house:', updError.message, updError.details);
		} else {
			console.log('House updated successfully:', updatedHouse);
			setHouse(updatedHouse);
		}
		setLoading(false);
	};

	const deleteHouse = async (id: number) => {
		setLoading(true);
		// Delete house data from the database
		console.log('Deleting house with ID:', id);
		const { error: dbError } = await supabase
			.from('houses')
			.delete()
			.eq('id', id);
		if (dbError) {
			console.error('Error deleting house:', dbError);
		}

		// Delete house images from the storage bucket
		const { error: errorST } = await supabase.storage.deleteBucket(
			`houses/${id}`
		);
		if (errorST) {
			console.error('Error deleting house images:', errorST);
		}
		router.push('/admin/houses');
		setLoading(false);
	};

	if (!house) return <div>Loading...</div>;

	return (
		<div className='container mx-auto py-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold mb-4'>Editing House {house.id}</h1>
				<Button variant='bordered' onPress={() => router.push('/admin/houses')}>
					Back to Houses
				</Button>
			</div>

			<Card className='p-4'>
				<form onSubmit={updateHouseData} className='space-y-4'>
					<p>Adress</p>
					<div className='grid grid-cols-3 gap-4'>
						<Input
							label='Street'
							type='text'
							value={house.street ?? ''}
							onChange={(e) => setHouse({ ...house, street: e.target.value })}
						/>
						<Input
							label='Number'
							type='text'
							value={house.number ?? ''}
							onChange={(e) => setHouse({ ...house, number: e.target.value })}
							maxLength={5}
						/>
						<Input
							label='Postal Code'
							type='text'
							value={house.postal_code ?? ''}
							onChange={(e) => setHouse({ ...house, postal_code: e.target.value })}
							maxLength={7}
						/>
					</div>
					<p>Google maps</p>
					<div className='grid grid-cols-2 gap-4'>
						<Input
							label='Maps Link'
							type='url'
							value={house.maps_link ?? ''}
							onChange={(e) => setHouse({ ...house, maps_link: e.target.value })}
						/>
						<Input
							label='Street View Link'
							type='url'
							value={house.street_view ?? ''}
							onChange={(e) => setHouse({ ...house, street_view: e.target.value })}
						/>
					</div>

					<p>Rooms info</p>
					<div className='grid grid-cols-2 gap-4'>
						<Input
							label='Total Rooms'
							type='number'
							value={house.total_rooms ? house.total_rooms.toString() : '0'}
							onChange={(e) =>
								setHouse({ ...house, total_rooms: parseInt(e.target.value, 10) || 0 })
							}
						/>
						<Input
							label='Available Rooms'
							type='text'
							value={house.available_rooms ? house.available_rooms.join(', ') : ''}
							onChange={(e) =>
								setHouse({
									...house,
									available_rooms: e.target.value
										.split(',')
										.map((num) => parseInt(num, 10) || 0),
								})
							}
						/>
					</div>

					<p>Upload New Images</p>
					<div className='flex items-center space-x-4'>
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
									uploadHouseImages(house.id, newImages);
								}
							}}
							disabled={loading || !newImages}>
							{loading ? 'Uploading...' : 'Upload Images'}
						</Button>
					</div>
					<div>
						{house.images?.length > 0 ? (
							<div className='grid grid-cols-4 gap-3'>
								{house.images.map((image, index) => (
									<Card key={house.id + index} className='cursor-pointer'>
										{house.images.length > 0 ? (
											<img
												key={index}
												src={image}
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
												onPress={() => deleteHouseImage(house.id, image)}>
												<TrashIcon className='h-5 w-5' />
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						) : (
							<p>No images related to this house</p>
						)}
					</div>
					<div className='flex justify-between'>
						<Button variant='solid' type='submit' color='primary'>
							Save Changes
						</Button>

						{house.maps_link ? (
							<Button
								variant='bordered'
								onPress={() => window.open(house.maps_link, '_blank')}>
								Open on Maps
							</Button>
						) : null}
						{house.street_view ? (
							<Button
								variant='bordered'
								onPress={() => window.open(house.street_view, '_blank')}>
								Open on Street View
							</Button>
						) : null}
						<Button
							variant='solid'
							color='danger'
							onPress={() => {
								deleteHouse(house.id);
							}}>
							Delete
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
