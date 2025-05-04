import { Button, Card, CardHeader } from '@heroui/react';
import { type Room } from '@/interfaces/room';

export default function RoomInfoCard({ room }: { room: Room }) {
	return (
		<div className='flex flex-col gap-4'>
			<Card className='rounded-2xl shadow-xl p-4 space-y-2'>
				<CardHeader className='flex flex-col text-sm font-bold'>
					<div className='flex justify-between items-center gap-2'>
						<div>Room {room.number}</div>
						<div>House {room.house_number}</div>
					</div>
				</CardHeader>
				<div className='text-sm text-muted-foreground'>
					Tipo: {`${room.type} room`}
				</div>
				{room.type == 'single' ? (
					<div className='text-sm text-muted-foreground'>
						Disponibilidade: {room.is_available ? 'Disponivel' : 'Não disponivel'}
					</div>
				) : (
					<div className='text-sm text-muted-foreground'>
						Disponibilidade: {room.beds - room.renters.length} vagas disponíveis
					</div>
				)}
			</Card>
			<Card className='rounded-2xl shadow-xl p-4'>
				<div className='flex flex-col gap-2'>
					<label className='text-sm text-muted-foreground'>Descrição:</label>
					<p className='text-sm'>{room.description}</p>
				</div>
			</Card>
			<Card className='items-center rounded-2xl shadow-xl p-4 space-y-2'>
				<div className='text-lg font-bold text-primary'>€{room.price} / mês</div>
				<p className='text-xs text-gray-600'>Contas não inclusas</p>
				<Button className='w-full'>Solicitar Aluguel</Button>
			</Card>
		</div>
	);
}
