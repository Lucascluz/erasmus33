'use client';

import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Form,
	Image,
	Input,
	Select,
	SelectItem,
} from '@heroui/react';

import ImageCropper from '../ui/image-cropper';
import { TrashIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createRoom } from '@/app/admin/rooms/new/actions';
import { useRoomForm } from '@/hooks/useRoomForm';
import { roomTypes } from '@/interfaces/room';
import { useState } from 'react';
import { FormImagesModal } from '../ui/form-images-modal';

export default function RoomFormNew() {
	const {
		room,
		loading,
		roomImagesFiles,
		roomImagesUrls,
		housesData,
		setRoom,
		setLoading,
		updateImagePreview,
		removeImage,
		validateRoom,
	} = useRoomForm();

	const handleChangeHouse = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedHouse = housesData.find((house) => house.id === e.target.value);
		if (selectedHouse) {

			const id = selectedHouse.id;
			const number = Number(selectedHouse.number);

			setRoom({
				...room,
				house_id: id,
				house_number: number,
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		if (!validateRoom()) {
			setLoading(false);
			return;
		}

		await createRoom(room, roomImagesFiles);
		redirect('/admin');

	};

	return (
		<Card className='p-4'>
			<form className='space-y-4' onSubmit={handleSubmit}>
				<div className='grid grid-cols-2 gap-4'>
					<Select
						isRequired
						label='House'
						disabled={loading}
						onChange={handleChangeHouse}>
						{housesData.map((house) => (
							<SelectItem key={house.id}>
								{`House ${house.number}`}
							</SelectItem>
						))}
					</Select>
					<Select
						isRequired
						label='Type'
						disabled={loading}
						defaultSelectedKeys={[room.type]}
						onChange={(e) => {
							const selected = roomTypes.find(t => t.id === e.target.value);
							setRoom({
								...room,
								type: e.target.value,
								beds: selected?.beds || 1,
							});
						}}>
						{roomTypes.map((type) => (
							<SelectItem key={type.id}>{type.name}</SelectItem>
						))}
					</Select>
				</div>
				<div className='grid grid-cols-3 gap-4'>
					<Input
						isRequired
						type='text'
						label='Room Number'
						disabled={loading}
						value={room.number.toString()}
						onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value) })}
					/>
					<Input
						isRequired
						type='number'
						label='Price'
						disabled={loading}
						value={room.price.toString()}
						onChange={(e) => setRoom({ ...room, price: parseFloat(e.target.value) })}
					/>
					<Checkbox isSelected={room.is_available} onValueChange={() => setRoom({ ...room, is_available: !room.is_available })}>
						{room.is_available ? 'Available' : 'Not Available'}
					</Checkbox>
				</div>
				<Input
					type='text'
					label='Description'
					disabled={loading}
					value={room.description}
					onChange={(e) => setRoom({ ...room, description: e.target.value })}
				/>

				<Card className='p-2'>
					<CardHeader>
						<ImageCropper aspectRatio='16/9' callback={updateImagePreview} />
					</CardHeader>
					<CardBody>
						<FormImagesModal images={roomImagesUrls} onRemoveImage={(url) => removeImage(roomImagesUrls.indexOf(url))} />
					</CardBody>
				</Card>

				<CardFooter className='flex justify-between'>
					<Button type='submit' color='primary' isLoading={loading}>Confirm</Button>
				</CardFooter>
			</form>
		</Card >
	);
}
