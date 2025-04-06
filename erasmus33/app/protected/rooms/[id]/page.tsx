import RoomGallery from '@/components/rooms/room-gallery';
import RoomInfoCard from '@/components/rooms/room-info-card';
import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/server';

export default async function RoomPage(context: { params: { id: string } }) {
	const { params } = context;
	const supabase = await createClient();

	const id = params.id;
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
