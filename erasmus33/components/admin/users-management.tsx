import React from 'react';
import {
	Card,
	CardHeader,
	CardBody,
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownItem,
	DropdownMenu,
} from '@heroui/react';
import { Profile } from '@/interfaces/profile';
import {
	EllipsisVertical,
	EyeIcon,
	Icon,
	PencilIcon,
	Trash,
} from 'lucide-react';

export default function UsersManagement({ profiles }: { profiles: Profile[] }) {
	return (
		<Card className='w-full p-2'>
			<CardHeader className='flex justify-between'>
				<h3 className='text-lg font-semibold'>Users Management</h3>
			</CardHeader>
			<CardBody>
				<Table aria-label='Users table'>
					<TableHeader>
						<TableColumn>NAME</TableColumn>
						<TableColumn>PHONE</TableColumn>
						<TableColumn>EMAIL</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						{profiles.map((profile) => (
							<TableRow key={profile.user_id}>
								<TableCell>
									<p>{profile.first_name}</p>
									<p className='text-gray-500 text-sm'>{profile.last_name}</p>
								</TableCell>
								<TableCell>
									<p>{profile.phone_number}</p>
									<p className='text-gray-500 text-sm'>{profile.pt_phone_number}</p>
								</TableCell>
								<TableCell>{profile.email}</TableCell>
								<TableCell>
									<div className='flex gap-4'>
										<EyeIcon
											className='h-5 w-5 text-accent cursor-pointer'
											href={`/admin/users/${profile.user_id}`}
										/>
										<PencilIcon
											className='h-5 w-5 text-primary cursor-pointer'
											href={`/admin/users/${profile.user_id}/edit`}
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	);
}
