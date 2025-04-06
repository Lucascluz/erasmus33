import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';

export default function AnalyticsReports() {
	return (
		<div>
			<h2 className='text-2xl font-bold py-8'>Analytics & Reports</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
				<Card>
					<CardHeader>
						<h3 className='text-lg font-semibold'>Booking Statistics</h3>
					</CardHeader>
					<CardBody>
						<div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
							<p className='text-gray-500'>Booking chart will be displayed here</p>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardHeader>
						<h3 className='text-lg font-semibold'>Revenue Overview</h3>
					</CardHeader>
					<CardBody>
						<div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
							<p className='text-gray-500'>Revenue chart will be displayed here</p>
						</div>
					</CardBody>
				</Card>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardHeader>
						<h3 className='text-lg font-semibold'>Top Properties</h3>
					</CardHeader>
					<CardBody>
						<div className='h-48 flex items-center justify-center bg-gray-100 rounded-lg'>
							<p className='text-gray-500'>
								Top properties chart will be displayed here
							</p>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardHeader>
						<h3 className='text-lg font-semibold'>User Growth</h3>
					</CardHeader>
					<CardBody>
						<div className='h-48 flex items-center justify-center bg-gray-100 rounded-lg'>
							<p className='text-gray-500'>User growth chart will be displayed here</p>
						</div>
					</CardBody>
				</Card>

				<Card>
					<CardHeader>
						<h3 className='text-lg font-semibold'>Occupancy Rate</h3>
					</CardHeader>
					<CardBody>
						<div className='h-48 flex items-center justify-center bg-gray-100 rounded-lg'>
							<p className='text-gray-500'>
								Occupancy rate chart will be displayed here
							</p>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
