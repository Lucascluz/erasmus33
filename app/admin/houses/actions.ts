'use server';

import { House } from '@/interfaces/house';
import { createClient } from '@/utils/supabase/server';

export const handleCreateHouseBase = async (
	house: House
): Promise<string | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('houses')
		.insert({
			street: house.street,
			number: house.number,
			postal_code: house.postal_code,
			description: house.description,
			google_maps: house.google_maps,
			total_rooms: house.total_rooms,
			full_rooms: house.full_rooms,
		})
		.select('id')
		.single();

	if (error || !data?.id) {
		console.error('Erro ao criar a casa:', error);
		return null;
	}

	return data.id;
};

export const updateHouseImages = async (id: string, imageUrls: string[]) => {
	const supabase = await createClient();

	const { error } = await supabase
		.from('houses')
		.update({ images: imageUrls })
		.eq('id', id);

	if (error) {
		console.error('Erro ao atualizar as imagens da casa:', error);
	} else {
		console.log('Imagens atualizadas com sucesso');
	}
};
