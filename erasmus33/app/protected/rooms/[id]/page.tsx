import RoomGallery from '@/components/rooms/room-gallery';
import RoomInfoCard from '@/components/rooms/room-info-card';
import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/server';
import { use } from 'react';

type Params = Promise<{ id: string }>;

export default async function RoomViewPage({ params }: { params: Params }) {
	const { id }: { id: string } = use(params); // fix this line

	const supabase = await createClient();

	if (!id) {
		return <div>Quarto não encontrado.</div>;
	}

	const { data: room, error } = await supabase
		.from('rooms')
		.select('*')
		.eq('id', id)
		.single();

	if (error || !room) {
		return <div>Quarto não encontrado.</div>;
	}

	console.log(room);

	return (
		<div className='mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='lg:col-span-2 xl:col-span-3'>
				<RoomGallery images={room.images} />
			</div>
			<div className='lg:col-span-2 xl:col-span-1'>
				<RoomInfoCard room={room as Room} />
			</div>
		</div>
	);
}
