'use client';

import { useCallback, useState } from 'react';
import { House } from '@/interfaces/house';
import { v4 } from 'uuid';
import { z } from 'zod';

const emptyHouse: House = {
	id: v4(),
	street: '',
	number: 0,
	postal_code: '',
	description: '',
	images: [],
};

const houseSchema = z.object({
	street: z.string().min(1, 'Street is required'),
	number: z.number().min(1, 'Number is required'),
	postal_code: z.string().min(1, 'Postal code is required'),
	description: z.string().min(1, 'Description is required'),
	images: z.array(z.string()).optional(),
	full_rooms: z.number().optional(),
});

export const useHouseForm = () => {
	const [house, setHouse] = useState<House>(emptyHouse);
	const [houseImagesFiles, setHouseImagesFiles] = useState<File[]>([]);
	const [displayedImageUrls, setDisplayedImageUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateUi = useCallback((file: File) => {
		const tempUrl = URL.createObjectURL(file);
		setDisplayedImageUrls((prev) => [...prev, tempUrl]);
		setHouseImagesFiles((prev) => [...prev, file]);
	}, []);

	const removeImage = (url: string) => {
		setDisplayedImageUrls((prev) => prev.filter((image) => image !== url));
		setHouseImagesFiles((prev) => prev.filter((file) => file.name !== url.split('/').pop()));
	};

	const validate = () => {
        try {
            houseSchema.parse(house);
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError(error.errors[0].message);
            }
            return false;
        }
    };

	return {
		house,
		houseImagesFiles,
		displayedImageUrls,
		loading,
		error,
		setHouse,
		removeImage,
		updateUi,
		setLoading,
		validate,
	};
};
