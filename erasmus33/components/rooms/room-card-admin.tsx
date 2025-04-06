'use client';

import Image from 'next/image';
import { Card, CardHeader } from '@heroui/react';
import { Room } from '@/interfaces/room';
import { redirect } from 'next/navigation';

export default function RoomCardAdmin({ room }: { room: Room }) {
	return (
		<Card
			isHoverable
			isPressable
			onPress={() => redirect(`/protected/rooms/${room.id}`)}
			className='block rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer'>
				<CardHeader>
					<div className='flex justify-between items-center'>
						<span className='text-muted-foreground text-sm'>Casa {room.house_number}</span>
						{!room.is_available && (
							<span className='text-red-500 text-xs font-medium'>Indisponível</span>
						)}
					</div>
				</CardHeader>
			<div className='relative w-full h-48'>
				<Image
					src={room.images[0]}
					alt='Imagem do quarto'
					fill
					className='object-cover'
				/>
			</div>
			<div className='p-4 space-y-1'>
				<h2 className='font-semibold text-lg'>
					Casa {room.house_number} - Quarto {room.number}
				</h2>
				<p className='text-muted-foreground text-sm'>
					{room.type} · {room.beds} camas estando {room.renters.length - room.beds}{' '}
					disponiveis
				</p>
				<p className='text-primary font-bold'>€{room.price}/mês</p>
				{!room.is_available && (
					<span className='text-red-500 text-xs font-medium'>Indisponível</span>
				)}
				<p className='text-sm text-muted-foreground'>Clique para editar</p>
			</div>
		</Card>
	);
}
