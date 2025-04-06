import RoomForm from '@/components/rooms/room-form';
import { handleCreateRoomAction } from './actions';
import { createClient } from '@/utils/supabase/server';

export default async function NewRoomPage() {
	const supabase = await createClient();

	const { data: usersData, error: userError } = await supabase
		.from('profiles')
		.select('user_id, first_name, last_name, picture_url');

	if (userError) console.error('Error fetching users:', userError);

	// Map database fields to component props
	const users =
		usersData?.map((user) => ({
			id: user.user_id,
			first_name: user.first_name,
			last_name: user.last_name,
			profile_picture: user.picture_url,
		})) || [];

	const { data: housesData, error: houseError } = await supabase
		.from('houses')
		.select('id, number');

	if (houseError) console.error('Error fetching houses:', houseError.message);

	// Map database fields to component props
	const houses =
		housesData?.map((house) => ({
			id: house.id,
			number: house.number,
		})) || [];

	if (houses.length == 0)
		return <div>Register a house before trying to register a room!</div>;

	return (
		<div className='max-w-3xl mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6'>Create New Room</h1>
			<RoomForm dto={{users, houses}} onSubmit={handleCreateRoomAction} />{' '}
			{/* Pass handleCreateRoomAction */}
		</div>
	);
}
