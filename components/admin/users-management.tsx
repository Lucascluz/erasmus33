"use client"

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
} from '@heroui/react';
import { Profile } from '@/interfaces/profile';
import {
	CheckIcon,
	EyeIcon,
	PencilIcon,
	XIcon,
} from 'lucide-react';
import { redirect } from 'next/navigation';

export default function UsersManagement({ profiles }: { profiles: Profile[] }) {

	return (
		<Card className='w-full p-2'>
			<CardHeader className='flex justify-between'>
				<h3 className='text-lg font-semibold'>Users Management</h3>
			</CardHeader>
			<CardBody>
				<Table aria-label='Users table'>
					<TableHeader>
						<TableColumn className='text-center'>NAME</TableColumn>
						<TableColumn className='text-center'>PHONE</TableColumn>
						<TableColumn className='text-center'>EMAIL</TableColumn>
						<TableColumn className='text-center'>ACTIVE</TableColumn>
						<TableColumn className='text-center'>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						{profiles.map((profile) => (
							<TableRow key={profile.user_id}>
								<TableCell className='text-center'>
									<p>{profile.first_name}</p>
									<p className='text-gray-500 text-sm'>{profile.last_name}</p>
								</TableCell>
								<TableCell className='text-center'>
									<p>{profile.phone_number}</p>
								</TableCell>
								<TableCell className='text-center'>{profile.email}</TableCell>
								<TableCell className='justify-center flex'>
									{profile.is_active ? (
										<CheckIcon className='text-success mx-auto' />
									) : (
										<XIcon className='text-danger mx-auto' />
									)}
								</TableCell>
								<TableCell className='text-center'>
									<div className='flex gap-4 justify-center'>
										<EyeIcon
											className='h-5 w-5 hover:text-primary cursor-pointer'
											onClick={() => redirect(`/protected/profile/${profile.user_id}`)}
										/>
										<PencilIcon
											className='h-5 w-5 cursor-pointer hover:text-primary'
											onClick={() => redirect(`/admin/users/edit/${profile.user_id}`)}
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
