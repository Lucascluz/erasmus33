import ManagementTabs from '@/components/admin/management-tabs';
import { createClient } from '@/utils/supabase/server';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Profile } from '@/interfaces/profile';
import { House } from '@/interfaces/house';
import { Room } from '@/interfaces/room';

export default async function AdminDashboard() {
	const supabase = await createClient();

	// Fetching data for the dashboard
	const { data: profiles } = await supabase.from('profiles').select('*');
	const { data: houses } = await supabase.from('houses').select('*');
	const { data: rooms } = await supabase.from('rooms').select('*');

	return (
		<Card className='p-4'>
			<CardHeader className='flex justify-between items-center m-2'>
				<h1 className='text-3xl font-bold'>Admin Dashboard</h1>
			</CardHeader>
			<CardBody className='container mx-auto py-4 px-2'>
				{/* Management Tabs */}
				<ManagementTabs
					profiles={profiles as Profile[]}
					houses={houses as House[]}
					rooms={rooms as Room[]}
				/>
			</CardBody>
		</Card>
	);
}
