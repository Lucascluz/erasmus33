'use client';

import { useHouseForm } from '@/hooks/useHouseForm';
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Spinner } from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { createHouse } from '@/app/admin/houses/new/actions';
import { FormImagesModal } from '../ui/form-images-modal';
import { SaveIcon } from 'lucide-react';

export default function HouseFormNew() {
	const {
		house,
		houseImagesFiles,
		displayedImageUrls,
		loading,
		error,
		setHouse,
		updateUi,
		removeImage,
		setLoading,
		validate,
	} = useHouseForm();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		if (!validate()) {
			setLoading(false);
			return;
		}

		await createHouse(house, houseImagesFiles);
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
				<div className='grid grid-cols-6 gap-4'>
					<Input
						className='col-span-3'
						type='text'
						label='Street'
						value={house.street}
						onChange={(e) => setHouse({ ...house, street: e.target.value })}
					/>
					<Input
						className='col-span-1'
						type='number'
						label='Number'
						value={house.number.toString()}
						onChange={(e) => setHouse({ ...house, number: Number(e.target.value) })}
					/>
					<Input
						className='col-span-2'
						type='text'
						label='Postal Code'
						value={house.postal_code}
						onChange={(e) => setHouse({ ...house, postal_code: e.target.value })}
					/>
				</div>
				<Input
					type='text'
					label='Description'
					value={house.description}
					onChange={(e) => setHouse({ ...house, description: e.target.value })}
				/>

				<Card className='p-2'>
					<CardHeader>
						<ImageCropper aspectRatio='16/9' callback={updateUi} />
					</CardHeader>
					<CardBody>
						<FormImagesModal images={displayedImageUrls} onRemoveImage={removeImage} />
					</CardBody>
				</Card>

				<CardFooter className='flex justify-between'>
					<Button className='p-2' color='primary' type='submit' isLoading={loading} startContent={<SaveIcon className='w-5 h-5'/>}>
						Submit
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
