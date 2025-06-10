'use client';

import Image from 'next/image';
import { Card, CardBody, Chip } from '@heroui/react';
import { Room } from '@/interfaces/room';
import { redirect } from 'next/navigation';
import { Home, Users, Euro, MapPin, Bed, CheckCircle } from 'lucide-react';

export default function RoomCard({ room }: { room: Room }) {
	const availableSpots = room.type === 'single'
		? (room.is_available ? 1 : 0)
		: room.beds - room.renters.length;

	const isAvailable = room.type === 'single' ? room.is_available : availableSpots > 0;

	return (
		<Card
			isHoverable
			isPressable
			onPress={() => redirect(`/protected/rooms/${room.id}`)}
			className='bg-content1/95 backdrop-blur-sm border border-divider shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden cursor-pointer group'>

			{/* Image Section */}
			<div className='relative w-full h-48 overflow-hidden'>
				{room.images[0] ? (
					<Image
						src={room.images[0]}
						alt={`Room ${room.number} in House ${room.house_number}`}
						fill
						className='object-cover group-hover:scale-110 transition-transform duration-500'
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority={false}
					/>
				) : (
					<div className='w-full h-full bg-content2 flex items-center justify-center'>
						<div className='text-center space-y-2'>
							<Home className='h-8 w-8 text-foreground-400 mx-auto' />
							<span className='text-foreground-500 text-sm'>No image available</span>
						</div>
					</div>
				)}

				{/* Availability Badge */}
				<div className='absolute top-3 right-3'>
					{isAvailable ? (
						<Chip color='success' variant='solid' size='sm' className='font-medium'>
							Available
						</Chip>
					) : (
						<Chip color='warning' variant='solid' size='sm' className='font-medium'>
							Occupied
						</Chip>
					)}
				</div>

				{/* House Number Badge */}
				<div className='absolute top-3 left-3'>
					<Chip
						variant='solid'
						color='primary'
						startContent={<MapPin className='h-3 w-3' />}
						size='sm'
						className='font-medium'
					>
						House {room.house_number}
					</Chip>
				</div>
			</div>

			{/* Content Section */}
			<CardBody className='p-4 space-y-4'>
				{/* Room Title */}
				<div className='space-y-1'>
					<h2 className='font-bold text-lg text-foreground flex items-center gap-2'>
						<Home className='h-4 w-4 text-primary' />
						Room {room.number}
					</h2>
					<p className='text-sm text-foreground-500 capitalize'>
						{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
					</p>
				</div>

				{/* Room Details */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-1 bg-content2/50 px-2 py-1 rounded-lg'>
							<Bed className='h-3 w-3 text-foreground-600' />
							<span className='text-xs text-foreground-600 font-medium'>
								{room.beds} bed{room.beds > 1 ? 's' : ''}
							</span>
						</div>
						<div className='flex items-center gap-1 bg-content2/50 px-2 py-1 rounded-lg'>
							<Users className='h-3 w-3 text-foreground-600' />
							<span className='text-xs text-foreground-600 font-medium'>
								{room.type === 'single' ? 'Single' : `${availableSpots} available`}
							</span>
						</div>
					</div>
				</div>

				{/* Price Section */}
				<div className='flex items-center justify-between pt-2 border-t border-divider/50'>
					<div className='flex items-center gap-2'>
						<div className={`${isAvailable ? 'bg-success/10' : 'bg-warning/10'} p-1.5 rounded-lg`}>
							<Euro className={`h-4 w-4 ${isAvailable ? 'text-success' : 'text-warning'}`} />
						</div>
						<div>
							<span className={`text-xl font-bold ${isAvailable ? 'text-success' : 'text-warning'}`}>
								€{room.price}
							</span>
							<span className='text-sm text-foreground-500 ml-1'>/ month</span>
						</div>
					</div>

					{room.type !== 'single' && (
						<Chip
							color={availableSpots > 0 ? 'primary' : 'warning'}
							variant='flat'
							size='sm'
							className='font-medium'
						>
							{availableSpots} spot{availableSpots !== 1 ? 's' : ''} left
						</Chip>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
