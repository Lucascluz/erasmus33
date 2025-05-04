import BackButton from '@/components/admin/back-button';
import RoomFormNew from '@/components/rooms/room-new-form';

export default async function NewRoomPage() {
	return (
		<div className='max-w-3xl mx-auto'>
			<div className='justify-between flex items-center'>
				<BackButton />
				<h1 className='text-3xl font-bold'>New Room</h1>
			</div>
			<RoomFormNew />
		</div>
	);
}
