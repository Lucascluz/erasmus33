import RoomForm from '@/components/rooms/room-form';
import { createClient } from '@/utils/supabase/server';

export default async function NewRoomPage() {
	const supabase = await createClient();

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
			<RoomForm usersData={profiles || []} housesData={houses || []} />
		</div>
	);
}
