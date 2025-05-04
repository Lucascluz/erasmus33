'use client';

import { useCallback, useEffect, useState } from 'react';
import { House } from '@/interfaces/house';
import { Button, Card, CardFooter, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from '@heroui/react';
import { redirect } from 'next/navigation';
import { TrashIcon } from 'lucide-react';
import { deleteHouse, updateHouse } from '@/app/admin/houses/edit/actions';
import { createClient } from '@/utils/supabase/client';
import ImageCropper from '../ui/image-cropper';
import zod from 'zod';

export default function HouseFormEdit({ id }: { id: string }) {
	const supabase = createClient();

	const [house, setHouse] = useState<House>();

	const [newHouseImagesFiles, setNewHouseImageFiles] = useState<File[]>([]);
	const [displayedImageUrls, setDisplayedImageUrls] = useState<string[]>([]);
	const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchHouse = async () => {
			const { data, error } = await supabase
				.from('houses')
				.select('*')
				.eq('id', id)
				.single();
			setHouse(data);
			setDisplayedImageUrls(data.images);
		};
		fetchHouse();
	}, [id]);

	const updateUi = useCallback(
		async (file: File) => {
			const tempUrl = URL.createObjectURL(file);
			setDisplayedImageUrls((prev) => [...prev, tempUrl]);
			setNewHouseImageFiles((prev) => [...prev, file]);
		},
		[setDisplayedImageUrls, setNewHouseImageFiles]
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
			console.error(result.error.format());
			setLoading(false);
			return;
		}

		// Update the house
		if (house) {
			await updateHouse(house, newHouseImagesFiles, deletedImageUrls);
		} else {
			console.error('House is undefined');
			setLoading(false);
			return;
		}
		redirect('/admin');
	};

	const handleDelete = async () => {
		setLoading(true);
		await deleteHouse(house!);
		redirect('/admin');
	}


	if (!house) {
		return (
			<div className='flex justify-center h-screen'>
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
							setHouse({
								...house,
								street: e.target.value,
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
									setHouse({ ...house, images: house.images.filter((_, i) => i !== index) });
									setDeletedImageUrls((prev) => [...prev, image]);
									setDisplayedImageUrls((prev) => prev.filter((_, i) => i !== index));
								}}
							/>
						</Card>
					))}
				</div>
				<CardFooter className='flex justify-between'>
					<Button className='p-2' color='primary' type='submit' isLoading={loading}>
						Submit
					</Button>
					<HouseDeleteModal onDelete={handleDelete} />
				</CardFooter>
			</form>
		</Card>
	);
}

const HouseDeleteModal = ({ onDelete }: { onDelete: () => void }) => {

	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				className='p-2'
				color='danger'
				type='button'
				isLoading={isLoading}
				disabled={isLoading}
				endContent={<TrashIcon className='h-5 w-5' />}
				onPress={() => setIsOpen(true)} />

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size='lg'>
				<ModalContent className='max-w-2xl'>
					<ModalHeader>Delete House</ModalHeader>
					<ModalBody className='flex flex-col items-center'>
						<p>Are you sure you want to delete this house?</p>
						<p>This action cannot be undone.</p>
					</ModalBody>
					<ModalFooter className='flex justify-between'>
						<Button color='primary' onPress={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button color='danger' onPress={onDelete}>
							Sure
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}