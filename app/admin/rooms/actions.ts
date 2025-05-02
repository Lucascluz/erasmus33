'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImagesToStorage(roomId: string, files: File[]) {
	const supabase = await createClient();
	const urls: string[] = [];

	for (const file of files) {
		const fileName = `${roomId}/${uuidv4()}`;
		const { error: uploadError } = await supabase.storage
			.from('room_images')
			.upload(fileName, file, {
				cacheControl: '3600',
				upsert: true,
			});

		if (uploadError) {
			console.error('Error uploading image:', uploadError);
			continue;
		}

		const { data } = supabase.storage
			.from('room_images')
			.getPublicUrl(fileName);

		if (!data) {
			console.error('Error getting public URL:', data);
			continue;
		}

		urls.push(data.publicUrl);
	}

	return urls;
}

