import RoomCardAdmin from '@/components/rooms/room-card-admin';
import Link from 'next/link';
import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@heroui/react';

export default async function AdminRoomsPage() {
	const supabase = await createClient();

	// Exemplo de verificação de admin (você pode adaptar com base na sua auth)
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('user', user?.id)
		.single();

	if (profile?.role !== 'admin') {
		return redirect('/denied');
	}

	const { data: rooms, error } = await supabase
		.from('rooms')
		.select('*')
		.order('house_number', { ascending: true });

	if (error) return <div>Erro ao carregar quartos.</div>;

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
				<h1 className='text-3xl font-bold'>Gerenciar Quartos</h1>
				<Link href='/admin/rooms/new'>
					<Button>Criar Novo Quarto</Button>
				</Link>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
				{rooms?.map((room: Room) => <RoomCardAdmin key={room.id} room={room} />)}
			</div>
		</div>
	);
}
