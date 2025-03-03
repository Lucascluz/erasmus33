'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Alternative for App Router
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardHeader } from '@heroui/card';
import { House } from '@/interfaces/house';

export default function HousePage() {
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
				.from('images')
				.upload(filePath, file);
			if (error) {
				console.error('Error uploading image:', error);
				continue;
			}

			const { data } = supabase.storage.from('images').getPublicUrl(filePath);
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
				postal_code: updatedHouse.postalCode,
				mapsLink: updatedHouse.mapsLink,
				streetView: updatedHouse.streetView,
				total_rooms: updatedHouse.totalRooms,
				available_rooms: updatedHouse.availableRooms,
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

	if (!house) return <div>Loading...</div>;

	return (
		<div className='container mx-auto py-6'>
			<h1 className='text-2xl font-bold mb-4'>Editing House {house.id}</h1>
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
							value={house.postalCode ?? ''}
							onChange={(e) => setHouse({ ...house, postalCode: e.target.value })}
							maxLength={7}
						/>
					</div>
					<p>Google maps</p>
					<div className='grid grid-cols-2 gap-4'>
						<Input
							label='Maps Link'
							type='url'
							value={house.mapsLink ?? ''}
							onChange={(e) => setHouse({ ...house, mapsLink: e.target.value })}
						/>
						<Input
							label='Street View Link'
							type='url'
							value={house.streetView ?? ''}
							onChange={(e) => setHouse({ ...house, streetView: e.target.value })}
						/>
					</div>

					<p>Rooms info</p>
					<div className='grid grid-cols-2 gap-4'>
						<Input
							label='Total Rooms'
							type='number'
							value={house.totalRooms ? house.totalRooms.toString() : '0'}
							onChange={(e) =>
								setHouse({ ...house, totalRooms: parseInt(e.target.value, 10) || 0 })
							}
						/>
						<Input
							label='Available Rooms'
							type='text'
							value={house.availableRooms ? house.availableRooms.join(', ') : ''}
							onChange={(e) =>
								setHouse({
									...house,
									availableRooms: e.target.value
										.split(',')
										.map((num) => parseInt(num, 10) || 0),
								})
							}
						/>
					</div>

					<div>
						<label>Upload New Images</label>
						<input
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
							<div className='grid grid-cols-3 gap-4'>
								{house.images.map((image, index) => (
									<img
										key={index}
										src={image}
										alt={`House Image ${index}`}
										className='w-full h-48 object-cover rounded'
									/>
								))}
							</div>
						) : (
							<p>No images available</p>
						)}
					</div>
					<Button variant='solid' type='submit'>
						Save Changes
					</Button>
				</form>
			</Card>
			<div className='mt-4'>
				{house.mapsLink && (
					<Button
						variant='bordered'
						onPress={() => window.open(house.mapsLink, '_blank')}>
						Open Maps
					</Button>
				)}
				{house.streetView && (
					<Button
						variant='bordered'
						onPress={() => window.open(house.streetView, '_blank')}>
						Open Street View
					</Button>
				)}
			</div>
		</div>
	);
}
