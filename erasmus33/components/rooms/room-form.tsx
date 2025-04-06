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

type userData = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	profile_picture: string;
};

type houseData = {
	id: string;
	number: number;
};

type RoomFormProps = {
	dto: { users: userData[]; houses: houseData[] };
	initialData?: Room | null;
};

export default function RoomForm({ dto, initialData }: RoomFormProps) {
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
				console.error('Erro ao subir imagem:', error);
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

		// 1. Cria a casa
		const roomId = await handleCreateRoomBase(room);
		if (!roomId) {
			alert('Erro ao criar a casa');
			return;
		}

		// 2. Faz upload das imagens
		const urls = await uploadImagesToStorage(roomId, roomImagesFiles);

		// 3. Atualiza a casa com as URLs
		await updateRoomImages(roomId, urls);

		// 4. Redireciona
		redirect('/admin');
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
						<SelectItem key='single'>Single</SelectItem>
						<SelectItem key='shared'>Shared</SelectItem>
					</Select>

					<Input
						type='number'
						label='Beds'
						disabled={room.type === 'single'}
						value={room.type === 'single' ? '1' : room.beds.toString()}
						onChange={(e) => setRoom({ ...room, beds: parseInt(e.target.value) })}
					/>

					<Select
						label='House'
						value={room.house_id}
						onChange={(e) => {
							const selectedHouse = dto.houses.find(
								(house) => house.id === e.target.value
							);
							if (selectedHouse) {
								setRoom({
									...room,
									house_id: selectedHouse.id,
									house_number: selectedHouse.number,
								});
							}
						}}>
						{dto.houses.map((house) => (
							<SelectItem
								key={house.id}
								data-value={house.id}
								textValue={`Room ${house.number}`}>
								Room {house.number}
							</SelectItem>
						))}
					</Select>
					<Select
						label='Renters'
						value={room.renters.join(', ')}
						multiple
						onChange={(e) => {
							const selectedUsers = e.target.value.split(', ');
							setRoom({ ...room, renters: selectedUsers });
						}}>
						{dto.users.map((user) => (
							<SelectItem
								key={user.id}
								data-value={user.id}
								textValue={`${user.first_name} ${user.last_name}`}>
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
						<Card key={index} className='w-full overflow-hidde items-end'>
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
					<Button className='p-2 rounded-md ' color='primary' type='submit'>
						Submit
					</Button>
					<Button
						className=' p-2 rounded-md '
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
