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
import { House } from '@/interfaces/house';

export default function HousesManagement({ houses }: { houses: House[] }) {
	return (
		<Card>
			<CardHeader className='flex justify-between'>
				<h3 className='text-lg font-semibold'>Houses Management</h3>
				<Button color='primary'>Add New House</Button>
			</CardHeader>
			<CardBody>
				<Table aria-label='Houses table'>
					<TableHeader>
						<TableColumn>ID</TableColumn>
						<TableColumn>NAME</TableColumn>
						<TableColumn>LOCATION</TableColumn>
						<TableColumn>PRICE</TableColumn>
						<TableColumn>STATUS</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow key='1'>
							<TableCell>H001</TableCell>
							<TableCell>Beachfront Villa</TableCell>
							<TableCell>Miami, FL</TableCell>
							<TableCell>$350/night</TableCell>
							<TableCell>Available</TableCell>
							<TableCell>
								<div className='flex gap-2'>
									<Button size='sm' color='primary'>
										Edit
									</Button>
									<Button size='sm' color='danger'>
										Delete
									</Button>
								</div>
							</TableCell>
						</TableRow>
						<TableRow key='2'>
							<TableCell>H002</TableCell>
							<TableCell>Mountain Cabin</TableCell>
							<TableCell>Aspen, CO</TableCell>
							<TableCell>$275/night</TableCell>
							<TableCell>Booked</TableCell>
							<TableCell>
								<div className='flex gap-2'>
									<Button size='sm' color='primary'>
										Edit
									</Button>
									<Button size='sm' color='danger'>
										Delete
									</Button>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	);
}
