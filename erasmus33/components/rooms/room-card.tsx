'use client';

import Image from 'next/image';
import { Card } from '@heroui/react';
import { Room } from '@/interfaces/room';
import { redirect } from 'next/navigation';

export default function RoomCard({ room }: { room: Room }) {
	return (
		<Card
			isHoverable
			isPressable
			onPress={() => redirect(`/protected/rooms/${room.id}`)}
			className='block rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer'>
			<div className='relative w-full h-48'>
				{room.images[0] ? (
					<Image
						src={room.images[0]}
						alt='Imagem do quarto'
						fill
						className='object-cover'
					/>
				) : (
					<div className='w-full h-full bg-gray-200 flex items-center justify-center'>
						<span className='text-gray-500'>Sem imagem</span>
					</div>
				)}
			</div>
			<div className='p-4 space-y-1'>
				<h2 className='font-semibold text-lg'>
					Casa {room.house_number} - Quarto {room.number}
				</h2>
				<p className='text-muted-foreground text-sm'>
					{room.type} · {room.beds} camas estando {room.renters.length - room.beds}{' '}
					disponiveis
				</p>

				{room.is_available ? (
					<p className='text-primary font-bold'>€{room.price}/mês</p>
				) : (
					<span className='text-red-500 font-bold'>Indisponível</span>
				)}
			</div>
		</Card>
	);
}
