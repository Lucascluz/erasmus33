'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@heroui/button';
import Link from 'next/link';
import { Card, CardHeader } from '@heroui/card';
import { Room } from '@/interfaces/room';

export default function AdminRoomsPage() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchRooms = async () => {
			const { data, error } = await supabase.from('rooms').select('*');
			if (error) console.error('Error fetching rooms:', error);
			else setRooms(data);
			console.log(data);
		};
		fetchRooms();
	}, []);

	return (
		<div className='container mx-auto py-6'>
			<h1 className='text-2xl font-bold mb-4'>Manage Rooms</h1>
			<Link href='/admin/rooms/new'>
				<Button>Add New Room</Button>
			</Link>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
				{rooms.map((room) => (
					<Card
						key={room.id}
						onPress={() => router.push(`/admin/rooms/${room.id}`)}
						className='cursor-pointer'>
						<CardHeader>Room {room.id}</CardHeader>
						{room.images.length > 0 ? (
							<img
								src={room.images[0]}
								alt={room.id.toString()}
								className='w-full h-48 object-cover rounded'
							/>
						) : (
							<div className='w-full h-48 flex justify-center items-center'>
								<span className='text-gray-500'>No Image Available</span>
							</div>
						)}
						<div className='flex justify-between p-3'>
							<Button
								variant='solid'
								onPress={() => {
									router.push(`/admin/rooms/edit/${room.id}`);
								}}>
								Edit
							</Button>
						</div>
						<div className='flex justify-between p-3'>
							<p>Room type: {room.type}</p>
							<p>Total Rooms: {room.beds_left}</p>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
