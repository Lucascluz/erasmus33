'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import RoomGallery from '@/components/rooms/room-gallery';
import RoomInfoCard from '@/components/rooms/room-info-card';
import { Room } from '@/interfaces/room';
import { Profile } from '@/interfaces/profile';
import { Spinner } from '@heroui/react';

export default function RoomViewPage() {
	
	const { id } = useParams();
	const [room, setRoom] = useState<Room | null>(null);
	const [user, setUser] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!id || typeof id !== 'string') {
				setError('Invalid ID.');
				setLoading(false);
				return;
			}

			const supabase = createClient();

			// Fetch room data
			const { data: roomData, error: roomError } = await supabase
				.from('rooms')
				.select('*')
				.eq('id', id)
				.single();

			if (roomError || !roomData) {
				setError('Room not found.');
			} else {
				setRoom(roomData as Room);
			}

			// Fetch user profile
			const { data: { user: authUser } } = await supabase.auth.getUser();
			if (authUser) {
				const { data: profileData } = await supabase
					.from('profiles')
					.select('*')
					.eq('user_id', authUser.id)
					.single();

				if (profileData) {
					setUser(profileData as Profile);
				}
			}

			setLoading(false);
		};

		fetchData();
	}, [id]);

	if (loading) {
		return (
			<div className='flex justify-center h-screen'>
				<Spinner size='lg' color='primary' />
			</div>
		);
	}

	if (!room) {
		return (
			<div className='flex justify-center h-screen'>
				<p className='text-red-500'>{error}</p>
			</div>
		);
	}

	return (
		<>
			<div className='mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<div className='lg:col-span-3 xl:col-span-3'>
					<RoomGallery images={room.images} />
				</div>				<div className='lg:col-span-1 xl:col-span-1'>
					<RoomInfoCard room={room} user={user} />
				</div>
			</div>
		</>
	);
}
