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
} from '@heroui/react';
import { CheckIcon, EyeIcon, PencilIcon, XIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { House } from '@/interfaces/house';

export default function HouseManagement({ houses }: { houses: House[] }) {
	return (
		<Card className='w-full p-2'>
			<CardHeader className='flex justify-between'>
				<h3 className='text-lg font-semibold'>House Management</h3>
				<Button
					color='primary'
					onPress={() => {
						redirect('/admin/houses/new');
					}}>
					Add New House
				</Button>
			</CardHeader>
			<CardBody>
				<Table aria-label='House table'>
					<TableHeader>
						<TableColumn className='text-center'>STREET</TableColumn>
						<TableColumn className='text-center'>NUMBER</TableColumn>
						<TableColumn className='text-center'>ROOMS</TableColumn>
						<TableColumn className='text-center'>VACANCIES</TableColumn>
						<TableColumn className='text-center'>RENTING</TableColumn>
					</TableHeader>
					<TableBody>
						{houses.map((house) => (
							<TableRow key={house.id} className='items-center'>
								<TableCell className='text-center'>{house.street}</TableCell>
								<TableCell className='text-center'>{house.number}</TableCell>
								<TableCell className='text-center'>{house.total_rooms}</TableCell>
								<TableCell className='text-center align-middle'>
									{house.total_rooms - house.full_rooms > 0 ? (
										<CheckIcon className='text-success mx-auto' />
									) : (
										<XIcon className='text-danger mx-auto' />
									)}
								</TableCell>
								<TableCell className='text-center'>
									<div className='flex gap-4 justify-center'>
										<EyeIcon
											className='h-5 w-5 hover:text-primary cursor-pointer'
											onClick={() => {
												redirect(`/admin/houses/${house.id}`);
											}}
										/>
										<PencilIcon
											className='h-5 w-5 hover:text-primary cursor-pointer'
											onClick={() => {
												redirect(`/admin/houses/${house.id}/edit`);
											}}
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
