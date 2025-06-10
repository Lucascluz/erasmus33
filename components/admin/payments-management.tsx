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
	Select,
	SelectItem,
} from '@heroui/react';

export default function PaymentsManagement() {
	return (
		<Card>
			<CardHeader className='flex justify-between'>
				<h3 className='text-lg font-semibold'>Payments Management</h3>
				<Select label='Filter by' placeholder='All payments' className='max-w-xs'>
					<SelectItem key='all'>All payments</SelectItem>
					<SelectItem key='completed'>Completed</SelectItem>
					<SelectItem key='pending'>Pending</SelectItem>
					<SelectItem key='failed'>Failed</SelectItem>
				</Select>
			</CardHeader>
			<CardBody>
				<Table aria-label='Payments table'>
					<TableHeader>
						<TableColumn>ID</TableColumn>
						<TableColumn>USER</TableColumn>
						<TableColumn>PROPERTY</TableColumn>
						<TableColumn>AMOUNT</TableColumn>
						<TableColumn>DATE</TableColumn>
						<TableColumn>STATUS</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow key='1'>
							<TableCell>P001</TableCell>
							<TableCell>John Doe</TableCell>
							<TableCell>Beachfront Villa</TableCell>
							<TableCell>$1,050</TableCell>
							<TableCell>Mar 10, 2023</TableCell>
							<TableCell>Completed</TableCell>
							<TableCell>
								<Button size='sm' color='primary'>
									Details
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	);
}
