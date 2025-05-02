'use client'

import BackButton from '@/components/back-button';
import RoomFormEdit from '@/components/rooms/room-form-edit';
import { useParams } from 'next/navigation';

export default function RoomEditPage() {

	const { id } = useParams() as { id: string };

	return (
		<div className='max-w-3xl mx-auto p-6'>
			<div>
				<BackButton />
				<h1 className='text-3xl font-bold mb-6'>Edit Room</h1>
			</div>
			<RoomFormEdit id={id} />
		</div>
	);
}
