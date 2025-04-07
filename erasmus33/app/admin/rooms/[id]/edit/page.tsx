import RoomForm from '@/components/rooms/room-form';
import { createClient } from '@/utils/supabase/server';
import { handleRoomEditAction } from './actions';
import { Room } from '@/interfaces/room';
import { Profile } from '@/interfaces/profile';
import { House } from '@/interfaces/house';

export default async function EditRoomPage({
	params,
}: {
	params: { id: string };
}) {
	const supabase = await createClient();

	const { data: room } = await supabase
		.from('rooms')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!room) return <div className='p-6 text-red-500'>Room not found.</div>;

	const { data: houses } = await supabase
		.from('houses')
		.select('id, number')
		.order('number', { ascending: true });

	const { data: profiles } = await supabase
		.from('profiles')
		.select('id, first_name, last_name, email, profile_picture')
		.order('first_name', { ascending: true });

	return (
		<div className='max-w-3xl mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6'>Edit Room</h1>
			<RoomForm
				initialData={room as Room}
				usersData={profiles || []}
				housesData={houses || []}
			/>
		</div>
	);
}
