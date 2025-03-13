'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardFooter } from '@heroui/card';
import { House } from '@/interfaces/house';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function HouseCreatePage() {
	const router = useRouter();

	const [house, setHouse] = useState<House | null>(null);
	const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);
	const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const params = useParams(); // For App Router
	const id = params?.id; // Get ID from URL

	// Create a blank house object
	useEffect(() => {
		// Incializa o objeto da casa vazio
		setHouse({
			id: 0,
			street: '',
			number: '',
			postal_code: '',
			maps_link: '',
			street_view: '',
			total_rooms: 0,
			available_rooms: [],
			images: [],
		});

		// Garante que sempre que sempre que um arquivo for adicinado a UI atualiza
		if (newImageFiles && newImageFiles.length > 0) {
			updateHouseImagesUI();
		}
	}, [newImageFiles]);

	async function updateHouseImagesUI() {
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

	async function deleteHouseImageFromUI(imageUrl: string) {
		// Optimistically update UI
		setNewImageUrls(newImageUrls.filter((url) => url !== imageUrl));
		console.log(newImageUrls);
	}

	// Insert house data in the database
	const insertHouseData = async (event: React.FormEvent<HTMLFormElement>) => {
		if (!house) return;
		event.preventDefault();
		setLoading(true);

		// Creating a new row with the house data:
		console.log('Creating a new row with the house data:', house);
		const { data, error: insError } = await supabase
			.from('houses')
			.insert({
				street: house.street,
				number: house.number,
				postal_code: house.postal_code,
				maps_link: house.maps_link,
				street_view: house.street_view,
				total_rooms: house.total_rooms,
				available_rooms: house.available_rooms,
			})
			.select('id') // Select the ID of the new row
			.single();
		
		const newHouseId = data ? data.id : null;

		if (insError) {
			console.error(
				'Error creating house regsiter:',
				insError.message,
				insError.details
			);
		} else {
			console.log('Row created successfully!');
		}

		// Upload images to the storage bucket
		for (const file of Array.from(newImageFiles || [])) {
			// Construct the file path in storage
			const filePath = `house_${newHouseId}/${file.name}`;

			// Upload the file to Supabase storage
			const { error: uplError } = await supabase.storage
				.from('house_images')
				.upload(filePath, file);

			if (uplError || !newHouseId) {
				console.error('Error uploading image:', uplError?.message);
				continue;
			}

			// Get the public URL of the uploaded image
			const { data: publicURL } = supabase.storage
				.from('house_images')
				.getPublicUrl(filePath);

			// Insert the image URL in the database
			if (publicURL) {
				const { error: imgError } = await supabase
					.from('houses')
					.update({ images: [...house.images, publicURL] })
					.eq('id', newHouseId);

				if (imgError) {
					console.error('Error updating image URL:', imgError.message);
				} else {
					console.log('Image uploaded successfully:', publicURL);
					setHouse({ ...house, images: [...house.images, publicURL.publicUrl] });
				}
			}
		}
		setLoading(false);
	};

	if (!house) return <div>Loading...</div>;

	return (
		<div className='container mx-auto py-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold mb-4'>Registering a new house</h1>
				<Button variant='bordered' onPress={() => router.push('/admin/houses')}>
					Back to Houses
				</Button>
			</div>

			<Card className='p-4'>
				<form onSubmit={insertHouseData} className='space-y-4'>
					<p>Adress</p>
					<div className='grid grid-cols-3 gap-4'>
						<Input
							required
							label='Street'
							type='text'
							value={house.street ?? ''}
							onChange={(e) => setHouse({ ...house, street: e.target.value })}
						/>
						<Input
							required
							label='Number'
							type='text'
							value={house.number ?? ''}
							onChange={(e) => setHouse({ ...house, number: e.target.value })}
							maxLength={5}
						/>
						<Input
							required
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
							required
							label='Number of Rooms'
							type='number'
							value={house.total_rooms ? house.total_rooms.toString() : '0'}
							onChange={(e) =>
								setHouse({ ...house, total_rooms: parseInt(e.target.value, 10) || 0 })
							}
						/>
						<Input
							required
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
								if (e.target.files) {
									const files = e.target.files; // Variável temporária
									console.log('New images selected:', files);
									setNewImageFiles(files);
								}
							}}
						/>
					</div>
					<div>
						{newImageUrls?.length > 0 ? (
							<div className='grid grid-cols-4 gap-3'>
								{newImageUrls.map((imageURL, index) => (
									<Card key={house.id + index} className='cursor-pointer'>
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
												onPress={() => deleteHouseImageFromUI(imageURL)}>
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
							Confirm Creation
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
					</div>
				</form>
			</Card>
		</div>
	);
}
