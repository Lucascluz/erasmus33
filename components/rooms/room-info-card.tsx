import { Button, Card, CardHeader, CardBody, Chip, Divider } from '@heroui/react';
import {
	Home,
	Users,
	MessageCircle,
	Info,
	MapPin,
	Bed
} from 'lucide-react';
import { type Room } from '@/interfaces/room';
import { type Profile } from '@/interfaces/profile';

interface RoomInfoCardProps {
	room: Room;
	user?: Profile | null;
}

export default function RoomInfoCard({ room, user }: RoomInfoCardProps) {
	const handleWhatsAppClick = () => {
		const phoneNumber = '+351938554599';

		let message;
		if (room.type === 'single' && !room.is_available) {
			// Message for unavailable single rooms
			message = user
				? `Hello! I'm interested in Room ${room.number} in House ${room.house_number}, but I see it's currently unavailable. Could you please let me know when it might become available? My details: Name: ${user.first_name} ${user.last_name}, Email: ${user.email}, Phone: ${user.phone_number}, Country: ${user.country}. Thank you!`
				: `Hello! I'm interested in Room ${room.number} in House ${room.house_number}, but I see it's currently unavailable. Could you please let me know when it might become available? Thank you!`;
		} else {
			// Message for available rooms or shared rooms
			message = user
				? `Hello! I would like to formally request to rent Room ${room.number} in House ${room.house_number}. My details: Name: ${user.first_name} ${user.last_name}, Email: ${user.email}, Phone: ${user.phone_number}, Country: ${user.country}. Thank you for your consideration.`
				: `Hello! I would like to formally request to rent Room ${room.number} in House ${room.house_number}. Please contact me to discuss the rental terms. Thank you.`;
		}

		const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, '_blank');
	};
	return (<div className='flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0'>
		{/* Room Header Card */}
		<Card className='bg-content1/95 backdrop-blur-sm border border-divider shadow-xl hover:shadow-2xl transition-all duration-300'>
			<CardHeader className='pb-3'>
				<div className='flex items-center justify-between w-full'>
					<div className='flex items-center gap-3'>
						<div className='bg-primary/10 p-2 rounded-lg'>
							<Home className='h-5 w-5 text-primary' />
						</div>
						<div>
							<h2 className='text-xl font-bold text-foreground'>
								Room {room.number}
							</h2>
							<p className='text-sm text-foreground-500'>
								{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
							</p>
						</div>
					</div>
					<Chip
						variant='flat'
						color='primary'
						startContent={<MapPin className='h-3 w-3' />}
						size='md'
						className='font-medium'
					>
						House {room.house_number}
					</Chip>
				</div>
			</CardHeader>
			<CardBody className='pt-0 space-y-4'>
				{/* Room Details */}
				<div className='grid grid-cols-2 gap-3'>
					<div className='flex items-center gap-2 bg-content2 p-3 rounded-lg'>
						<Bed className='h-4 w-4 text-foreground-600' />
						<div>
							<p className='text-xs text-foreground-500 font-medium'>Beds</p>
							<p className='text-sm font-semibold text-foreground'>{room.beds}</p>
						</div>
					</div>
					<div className='flex items-center gap-2 bg-content2 p-3 rounded-lg'>
						<Users className='h-4 w-4 text-foreground-600' />
						<div>
							<p className='text-xs text-foreground-500 font-medium'>Type</p>
							<p className='text-sm font-semibold text-foreground capitalize'>{room.type}</p>
						</div>
					</div>
				</div>				{/* Availability Status */}
			</CardBody>
		</Card>			{/* Description Card */}
		<Card className='bg-content1/95 backdrop-blur-sm border border-divider shadow-xl hover:shadow-2xl transition-all duration-300'>
			<CardHeader className='pb-2'>
				<div className='flex items-center gap-2'>
					<div className='bg-secondary/10 p-2 rounded-lg'>
						<Info className='h-4 w-4 text-secondary' />
					</div>
					<h3 className='font-semibold text-foreground'>Room Description</h3>
				</div>
			</CardHeader>
			<CardBody className='pt-0'>
				<p className='text-sm text-foreground-600 leading-relaxed bg-content2/50 p-3 rounded-lg'>
					{room.description || 'This comfortable room offers a great living experience with all necessary amenities for students.'}
				</p>
			</CardBody>
		</Card>			{/* Pricing & Action Card */}
		<Card className={`${room.type === 'single' && !room.is_available
			? 'bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 border border-danger-200 dark:border-danger-800/50'
			: 'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border border-success-200 dark:border-success-800/50'
			} shadow-xl hover:shadow-2xl transition-all duration-300`}>
			<CardBody className='text-center space-y-6 p-6'>
				{/* Price Section */}
				<div className='space-y-3'>
					<div className='bg-content1/70 rounded-2xl p-4 shadow-sm border border-divider/50'>
						<div className='flex items-baseline justify-center gap-1'>
							<span className={`text-4xl font-bold ${room.type === 'single' && !room.is_available ? 'text-danger' : 'text-success'}`}>
								€{room.price}
							</span>
							<span className='text-lg text-foreground-600 font-medium'>/ month</span>
						</div>
					</div>
				</div>

				<Divider className={`${room.type === 'single' && !room.is_available ? 'bg-danger/20' : 'bg-success/20'}`} />

				{/* WhatsApp Button */}
				<Button
					className={`w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${room.type === 'single' && !room.is_available
						? 'bg-gradient-to-r from-danger-500 to-danger-600 text-white'
						: 'bg-gradient-to-r from-success-500 to-success-600 text-white'
						}`}
					size='lg'
					startContent={<MessageCircle className='h-5 w-5' />}
					onPress={handleWhatsAppClick}
				>
					{room.type === 'single' && !room.is_available
						? 'Ask About Availability'
						: 'Request Rental via WhatsApp'
					}
				</Button>
			</CardBody>
		</Card>
	</div>
	);
}
