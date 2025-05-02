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
} from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { TrashIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { createRoom } from '@/app/admin/rooms/new/actions';
import { v4 } from 'uuid';
import zod from 'zod';

const types = [
	{ id: 'single', name: 'Single', beds: 1 },
	{ id: 'double', name: 'Double', beds: 2 },
	{ id: 'triple', name: 'Triple', beds: 3 },
	{ id: 'quadruple', name: 'Quadruple', beds: 4 },
]

const emptyRoom: Room = {
	id: v4(),
	number: 0,
	price: 150,
	type: 'single',
	house_id: '',
	house_number: 0,
	description: '',
	beds: 1,
	images: [],
	renters: [],
	is_available: false
};

export default function RoomFormNew() {
	const supabase = createClient();

	const [room, setRoom] = useState<Room>(emptyRoom);
	const [roomImagesFiles, setRoomImagesFiles] = useState<File[]>([]);
	const [roomImagesUrls, setRoomImagesUrls] = useState<string[]>([]);

	const [housesData, setHousesData] = useState<any[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchHouses = async () => {
			const { data: housesData, error } = await supabase
				.from('houses')
				.select('*');
			if (error) {
				console.error('Error fetching houses:', error);
			}
			if (housesData) {
				setHousesData(housesData);
			}
		}
		console.log(room.id)
		fetchHouses();
	}, []);

	const updateUi = useCallback(
		async (file: File) => {
			const tempUrl = URL.createObjectURL(file);
			setRoomImagesUrls((prev) => [...prev, tempUrl]);
			setRoomImagesFiles((prev) => [...prev, file]);
		},
		[setRoomImagesUrls, setRoomImagesFiles]
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();

		// Validate room data
		const roomSchema = zod.object({
			number: zod.number().min(1, 'Room number must be greater than 0'),
			price: zod.number().min(0, 'Price must be greater than or equal to 0'),
			type: zod.string(),
			house_id: zod.string(),
			house_number: zod.number(),
			description: zod.string().max(500, 'Description is too long'),
			beds: zod.number().min(1, 'Number of beds must be at least 1'),
		});
		
		try {
			roomSchema.parse(room);
		} catch (error) {
			if (error instanceof zod.ZodError) {
				error.errors.forEach((err) => {
					console.error(err.message);
				});
			}
			setLoading(false);
			return;
		}

		// Create a new room record in the database
		createRoom(room, roomImagesFiles)
			.then(() => {
				redirect('/admin');
			})
			.catch((error) => {
				console.error('Error creating room:', error);
				setLoading(false);
			});
	};


	if (loading || !room) {
		return <p>Loading...</p>;
	}

	return (
		<Card className='p-4'>
			<form className='space-y-4' onSubmit={handleSubmit}>
				<div className='grid grid-cols-2 gap-4'>
					<Input
						isRequired
						type='text'
						label='Room Number'
						value={room.number.toString()}
						onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value) })}
					/>
					<Input
						isRequired
						type='number'
						label='Price'
						value={room.price.toString()}
						onChange={(e) => setRoom({ ...room, price: parseFloat(e.target.value) })}
					/>
					<Select
						isRequired
						label='Type'
						defaultSelectedKeys={[room.type]}
						onChange={(e) => {
							setRoom({ ...room, type: e.target.value, beds: types.find(type => type.id === e.target.value)?.beds || 1 });
						}}>
						{types.map((type) => (
							<SelectItem key={type.id} >{type.name}</SelectItem>
						))}
					</Select>
					<Select
						isRequired
						label='House'
						defaultSelectedKeys={[room.house_id]}
						onChange={(e) => {
							setRoom({ ...room, house_id: e.target.value, house_number: parseInt(e.target.value) });
						}}>
						{housesData.map((house) => (
							<SelectItem key={house.id} >
								{`House ${house.number}`}
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
						Confirm
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
