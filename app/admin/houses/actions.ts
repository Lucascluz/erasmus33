'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImagesToStorage(houseId: string, files: File[]) {
	const supabase = await createClient();
	const urls: string[] = [];

	for (const file of files) {
		const fileName = `${houseId}/${uuidv4()}`;
		console.log('Uploading file:', fileName);

		const { error: uploadError } = await supabase.storage
			.from('house_images')
			.upload(fileName, file, {
				cacheControl: '3600',
				upsert: true,
			});

		if (uploadError) {
			console.error('Error uploading image:', uploadError);
			continue;
		}

		console.log('File uploaded successfully:', fileName);

		console.log('Getting public URL for file:', fileName);
		const { data } = supabase.storage
			.from('house_images')
			.getPublicUrl(fileName);

		if (!data) {
			console.error('Error getting public URL:', data);
			continue;
		}
		console.log('Public URL:', data.publicUrl);

		urls.push(data.publicUrl);
	}

	console.log('All URLs:', urls);

	return urls;
}

