import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { House } from '@/interfaces/house';
import { createHouse } from '@/app/admin/houses/new/actions';
import { deleteHouse, updateHouse } from '@/app/admin/houses/edit/actions';
import { redirect } from 'next/navigation';
import { uploadImagesToStorage } from '@/app/admin/houses/actions';
import { v4 } from 'uuid';
import { z } from 'zod';

const defaultHouse: House = {
	id: v4(),
	street: '',
	number: 0,
	postal_code: '',
	description: '',
	images: [],
};

export function useHouseForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
	const supabase = createClient();
	const [house, setHouse] = useState<House>(defaultHouse);
	const [displayedImageUrls, setDisplayedImageUrls] = useState<string[]>([]);
	const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
	const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(mode === 'create');

	useEffect(() => {
		if (mode === 'edit' && id) {
			const fetchHouse = async () => {
				const { data, error } = await supabase
					.from('houses')
					.select('*')
					.eq('id', id)
					.single();
				if (error) {
					console.error('Error fetching house:', error);
					return;
				}
				if (!data) {
					console.error('No house found with the given ID');
					return;
				}
				setHouse({ ...data, number: Number(data.number) });
				setDisplayedImageUrls(data.images || []);
				setHasLoaded(true);
			};
			fetchHouse();
		}
	}, [id, supabase]);

	const handleImageAdd = useCallback((file: File) => {
		const tempUrl = URL.createObjectURL(file);
		setDisplayedImageUrls((prev) => [...prev, tempUrl]);
		setNewImageFiles((prev) => [...prev, file]);
	}, []);

	const handleImageRemove = useCallback((index: number) => {
		setDeletedImageUrls((prev) => [...prev, displayedImageUrls[index]]);
		setDisplayedImageUrls((prev) => prev.filter((_, i) => i !== index));
		setHouse((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
	}, [displayedImageUrls]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		setHouse((prev) => ({ ...prev, number: Number(prev.number) }));

		// Validate the house object before proceeding
		if (!validateHouse(house)) {
			setLoading(false);
			return;
		}

		// Check is there are any new images to upload
		let newImageUrls: string[] = []; if (newImageFiles.length > 0) {
			newImageUrls = await uploadImagesToStorage(house.id, newImageFiles);
		}

		if (mode === 'create') {
			await createHouse(house, newImageUrls);
		} else if (mode === 'edit') {
			await updateHouse(house, newImageUrls, deletedImageUrls);
		}

		redirect('/admin');
	};

	const handleDelete = async () => {
		setLoading(true);
		await deleteHouse(house);
		redirect('/admin');
	};

	return {
		house,
		hasLoaded,
		loading,
		displayedImageUrls,
		setHouse,
		handleImageAdd,
		handleImageRemove,
		handleSubmit,
		handleDelete,
	};
}

const validateHouse = (house: House) => {
	// Verify that the house object has the required properties
	if (!house.street || !house.number || !house.postal_code) {
		console.error('Validation error: Missing required properties');
		return false;
	}

	const houseSchema = z.object({
		id: z.string().uuid(),
		street: z.string().min(1, 'Street is required'),
		number: z.number().min(1, 'Number is required'),
		postal_code: z.string().min(1, 'Postal code is required'),
		description: z.string().optional(),
		images: z.array(z.string()).optional(),
	});
	const parsedHouse = houseSchema.safeParse(house);
	if (!parsedHouse.success) {
		parsedHouse.error.errors.forEach((error) => {
			console.error('Validation error:', error.message);
		});
		return false;
	}
	return true;
}
