'use client';

import { useCallback, useEffect, useState } from 'react';
import { House } from '@/interfaces/house';
import { Button, Card, CardFooter, Image, Input } from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { TrashIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
	handleCreateHouseBase,
	updateHouseImages,
} from '@/app/admin/houses/actions';

type HouseFormProps = {
	initialData?: House | null;
};

export default function HouseForm({ initialData }: HouseFormProps) {
	const [house, setHouse] = useState<House>(
		initialData || {
			street: '',
			number: 0,
			postal_code: '',
			description: '',
			google_maps: '',
			street_view: '',
			total_rooms: 0,
			full_rooms: 0,
			images: [],
		}
	);

	const [houseImagesFiles, setHouseImagesFiles] = useState<File[]>([]);
	const [houseImagesUrls, setHouseImagesUrls] = useState<string[]>([]);

	useEffect(() => {
		if (initialData) {
			setHouse(initialData);
			setHouseImagesUrls(initialData.images);
		}
	}, [initialData]);

	const updateUi = useCallback(
		async (file: File) => {
			const tempUrl = URL.createObjectURL(file);
			setHouseImagesUrls((prev) => [...prev, tempUrl]);
			setHouseImagesFiles((prev) => [...prev, file]);
		},
		[setHouseImagesUrls, setHouseImagesFiles]
	);

	async function uploadImagesToStorage(id: string, files: File[]) {
		const supabase = await createClient();

		const urls: string[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const { data, error } = await supabase.storage
				.from('house_images')
				.upload(`${id}/${i}`, file, { upsert: true });

			if (error) {
				console.error('Erro ao subir imagem:', error);
				continue;
			}

			const { data: publicUrlData } = supabase.storage
				.from('house_images')
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
		const houseId = await handleCreateHouseBase(house);
		if (!houseId) {
			alert('Erro ao criar a casa');
			return;
		}

		// 2. Faz upload das imagens
		const urls = await uploadImagesToStorage(houseId, houseImagesFiles);

		// 3. Atualiza a casa com as URLs
		await updateHouseImages(houseId, urls);

		// 4. Redireciona
		redirect('/admin');
	};

	return (
		<Card className='p-4'>
			<form className='space-y-4' onSubmit={handleSubmit}>
				<div className='grid grid-cols-4 gap-4'>
					<Input
						type='text'
						label='Street'
						value={house.street}
						onChange={(e) => setHouse({ ...house, street: e.target.value })}
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
					{houseImagesUrls.map((image, index) => (
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
									setHouseImagesUrls((prev) => prev.filter((_, i) => i !== index));
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
