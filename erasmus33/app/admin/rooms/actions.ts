'use server';

import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/server';

export const handleCreateRoomBase = async (
	room: Room
): Promise<string | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('rooms')
		.insert({
			number: room.number,
			house_id: room.house_id,
			house_number: room.house_number,
			price: room.price,
			description: room.description,
			type: room.type,
			beds: room.beds,
			renters: room.renters,
			is_available: room.is_available,
		})
		.select('id')
		.single();

	if (error || !data?.id) {
		console.error('Erro ao criar a quarto:', error);
		return null;
	}

	return data.id;
};

export const updateRoomImages = async (id: string, imageUrls: string[]) => {
	const supabase = await createClient();

	const { error } = await supabase
		.from('rooms')
		.update({ images: imageUrls })
		.eq('id', id);

	if (error) {
		console.error('Erro ao atualizar as imagens da quarto:', error);
	} else {
		console.log('Imagens atualizadas com sucesso');
	}
};
