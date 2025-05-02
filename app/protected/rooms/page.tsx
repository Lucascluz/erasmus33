import BackButton from '@/components/back-button';
import RoomCard from '@/components/rooms/room-card';
import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/server';

export default async function RoomsPage() {
	const supabase = await createClient();

	const { data: rooms, error } = await supabase.from('rooms').select('*');

	if (error) return <div>Erro ao carregar quartos.</div>;

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='flex items-center justify-between'>
				<BackButton />
				<h1 className='text-3xl font-bold'>Explore Quartos</h1>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
				{rooms?.map((room: Room) => <RoomCard key={room.id} room={room} />)}
			</div>
		</div>
	);
}
