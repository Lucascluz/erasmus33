'use client'

import BackButton from '@/components/admin/back-button';
import RoomForm from '@/components/rooms/room-form';
import { useParams } from 'next/navigation';

export default function RoomEditPage() {

	const { id } = useParams() as { id: string };

	return (
		<div className='max-w-3xl mx-auto'>
			<div className='justify-between flex items-center'>
				<BackButton />
				<h1 className='text-3xl font-bold'>Editing Room</h1>
			</div>
			<RoomForm mode='edit' id={id} />
		</div>
	);
}
