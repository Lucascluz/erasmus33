'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardFooter } from '@heroui/card';
import { House } from '@/interfaces/house';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function HousePage() {
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

	const handleImageUpload = async () => {
		if (!newImages || !house) return;
		setLoading(true);

		const images: string[] = [];
		for (let i = 0; i < newImages.length; i++) {
			const file = newImages[i];
			const filePath = `houses/${house.id}/${file.name}`;

			const { error } = await supabase.storage
				.from('house_images')
				.upload(filePath, file, { upsert: true });

			if (error) {
				console.error('Error uploading image:', JSON.stringify(error, null, 2));
			}

			const { data } = supabase.storage
				.from('house_images')
				.getPublicUrl(filePath);
			if (data?.publicUrl) {
				images.push(data.publicUrl);
			}
		}

		await updateHouse(images);
		setLoading(false);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await updateHouse();
	};

	const updateHouse = async (newImages: string[] = []) => {
		if (!house) return;
		const updatedHouse = { ...house, images: [...house.images, ...newImages] };

		const { data, error } = await supabase
			.from('houses')
			.update({
				street: updatedHouse.street,
				number: updatedHouse.number,
				postal_code: updatedHouse.postal_code,
				maps_link: updatedHouse.maps_link,
				street_view: updatedHouse.street_view,
				total_rooms: updatedHouse.total_rooms,
				available_rooms: updatedHouse.available_rooms,
				images: updatedHouse.images,
			})
			.eq('id', house.id)
			.select();

		console.log('Supabase Update Response:', { data, error });

		if (error) {
			console.error('Error updating house:', error.message, error.details);
		} else {
			alert('House updated successfully!');
			setHouse(updatedHouse);
		}
	};

	const deleteHouse = async (id: number) => {
		const { error } = await supabase.from('houses').delete().eq('id', id);
		if (error) {
			console.error('Error deleting house:', error);
		}
		router.push('/admin/houses');
	};

	if (!house) return <div>Loading...</div>;

	function deleteImage(id: number) {
		throw new Error('Function not implemented.');
	}

	return (
		<div className='container mx-auto py-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold mb-4'>Editing House {house.id}</h1>
				<Button variant='bordered' onPress={() => router.push('/admin/houses')}>
					Back to Houses
				</Button>
			</div>

			<Card className='p-4'>
				<form onSubmit={handleSubmit} className='space-y-4'>
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
							onChange={(e) => setNewImages(e.target.files)}
						/>
						<Button variant='solid' onPress={handleImageUpload} disabled={loading}>
							{loading ? 'Uploading...' : 'Upload Images'}
						</Button>
					</div>
					<div>
						{house.images?.length > 0 ? (
							<div className='grid grid-cols-4 gap-3'>
								{house.images.map((image, index) => (
									<Card
										key={house.id}
										onPress={() => router.push(`/admin/houses/${house.id}`)}
										className='cursor-pointer'>
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
												onPress={() => {
													deleteImage(house.id);
												}}>
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
						<Button variant='solid' type='submit'>
							Save Changes
						</Button>
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
			<div className='mt-4'>
				{house.maps_link && (
					<Button
						variant='bordered'
						onPress={() => window.open(house.maps_link, '_blank')}>
						Open Maps
					</Button>
				)}
				{house.street_view && (
					<Button
						variant='bordered'
						onPress={() => window.open(house.street_view, '_blank')}>
						Open Street View
					</Button>
				)}
			</div>
		</div>
	);
}
