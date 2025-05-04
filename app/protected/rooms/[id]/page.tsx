'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import RoomGallery from '@/components/rooms/room-gallery';
import RoomInfoCard from '@/components/rooms/room-info-card';
import { Room } from '@/interfaces/room';

export default function RoomViewPage() {

	const { id } = useParams();
	const [room, setRoom] = useState<Room | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRoom = async () => {
			if (!id || typeof id !== 'string') {
				setError('ID inválido.');
				setLoading(false);
				return;
			}

			const supabase = createClient();
			const { data, error } = await supabase
				.from('rooms')
				.select('*')
				.eq('id', id)
				.single();

			if (error || !data) {
				setError('Quarto não encontrado.');
			} else {
				setRoom(data as Room);
			}
			setLoading(false);
		};

		fetchRoom();
	}, [id]);

	if (loading) return <div>Carregando...</div>;
	if (error) return <div>{error}</div>;
	if (!room) return <div>Quarto não encontrado.</div>;

	return (
		<>
			<div className='mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<div className='lg:col-span-3 xl:col-span-3'>
					<RoomGallery images={room.images} />
				</div>
				<div className='lg:col-span-1 xl:col-span-1'>
					<RoomInfoCard room={room} />
				</div>
			</div>
		</>
	);
}
