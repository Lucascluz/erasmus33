'use client';

import { useCallback, useState } from 'react';
import { House } from '@/interfaces/house';
import { Button, Card, CardFooter, Image, Input, Spinner } from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { TrashIcon } from 'lucide-react';
import { v4 } from 'uuid';
import zod, { set } from 'zod';
import { createHouse } from '@/app/admin/houses/new/actions';

const emptyHouse: House = {
	id: v4(),
	street: '',
	number: 0,
	postal_code: '',
	total_rooms: 0,
	description: '',
	google_maps: '',
	images: [],
	full_rooms: 0
};

export default function HouseFormNew() {
	const [house, setHouse] = useState<House>(emptyHouse);

	const [houseImagesFiles, setHouseImagesFiles] = useState<File[]>([]);
	const [displayedImageUrls, setDisplayedImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const updateUi = useCallback(
		async (file: File) => {
			const tempUrl = URL.createObjectURL(file);
			setDisplayedImageUrls((prev) => [...prev, tempUrl]);
			setHouseImagesFiles((prev) => [...prev, file]);
		},
		[setDisplayedImageUrls, setHouseImagesFiles]
	);


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();

		// Vailidate the form
		const schema = zod.object({
			street: zod.string().min(1, 'Street is required'),
			number: zod.number().min(1, 'Number is required'),
			postal_code: zod.string().min(1, 'Postal code is required'),
			total_rooms: zod.number().min(1, 'Total rooms is required'),
			description: zod.string().min(1, 'Description is required'),
		});
		const result = schema.safeParse(house);
		if (!result.success) {
			console.error('Validation error:', result.error.format());
			setLoading(false);
			return;
		}

		// Update the house
		await createHouse(house, houseImagesFiles)
		redirect('/admin');
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Spinner size='lg' color='primary' />
			</div>
		);
	}

	return (
		<Card className='p-4'>
			<form className='space-y-4' onSubmit={handleSubmit}>
				<div className='grid grid-cols-2 gap-4'>
					<Input
						type='text'
						label='Street'
						value={house.street}
						onChange={(e) => {
							const mapsAddress = e.target.value
								.replace(/\s+/g, '+')
								.concat(`+${house.number}`);
							setHouse({
								...house,
								street: e.target.value,
								google_maps: `https://www.google.com/maps/place/${mapsAddress}`,
							});
						}}
					/>
					<Input
						type='number'
						label='Number'
						value={house.number.toString()}
						onChange={(e) => setHouse({ ...house, number: Number(e.target.value) })}
					/>
					<Input
						type='text'
						label='Postal Code'
						value={house.postal_code}
						onChange={(e) => setHouse({ ...house, postal_code: e.target.value })}
					/>
					<Input
						type='number'
						label='Total Rooms'
						value={house.total_rooms.toString()}
						onChange={(e) =>
							setHouse({ ...house, total_rooms: Number(e.target.value) })
						}
					/>
				</div>
				<Input
					type='text'
					label='Description'
					value={house.description}
					onChange={(e) => setHouse({ ...house, description: e.target.value })}
				/>
				<ImageCropper aspectRatio='16/9' callback={updateUi} />
				<div className='grid grid-cols-4 gap-4'>
					{displayedImageUrls.map((image, index) => (
						<Card key={index} className='w-full overflow-hidde items-end'>
							<Image
								src={image}
								alt={`House Image ${index + 1}`}
								className='w-full object-cover rounded-md'
								children={null}
							/>
							<TrashIcon
								className='h-5 w-5 m-2 hover:text-danger cursor-pointer'
								onClick={() => {
									setDisplayedImageUrls((prev) => prev.filter((_, i) => i !== index));
									setHouseImagesFiles((prev) => prev.filter((_, i) => i !== index));
								}}
							/>
						</Card>
					))}
				</div>
				<CardFooter className='flex justify-between'>
					<Button className='p-2' color='primary' type='submit'>
						Submit
					</Button>
					<Button
						className='p-2'
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
