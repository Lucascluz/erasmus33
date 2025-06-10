'use client';

import { useState, useEffect, useCallback } from 'react';
import RoomCard from '@/components/rooms/room-card';
import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/client';
import { Card, CardBody } from '@heroui/react';
import { Home } from 'lucide-react';
import RoomsFilter from '@/components/rooms/rooms-filter';

// Loading component for better UX
function RoomsGridSkeleton() {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
			{Array.from({ length: 8 }).map((_, i) => (
				<Card key={i} className='bg-content1/50 animate-pulse'>
					<div className='h-48 bg-content2/50' />
					<CardBody className='p-4 space-y-3'>
						<div className='h-4 bg-content2/50 rounded w-3/4' />
						<div className='h-3 bg-content2/50 rounded w-1/2' />
						<div className='h-4 bg-content2/50 rounded w-1/3' />
					</CardBody>
				</Card>
			))}
		</div>
	);
}

// Error fallback component
function RoomsError({ error }: { error?: string }) {
	return (
		<Card className='bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800/50'>
			<CardBody className='text-center p-8 space-y-4'>
				<div className='bg-danger/10 p-3 rounded-full w-fit mx-auto'>
					<Home className='h-8 w-8 text-danger' />
				</div>
				<div>
					<h3 className='text-lg font-semibold text-danger mb-2'>Error Loading Rooms</h3>
					<p className='text-foreground-600 mb-4'>
						{error || 'We\'re having trouble loading the rooms. Please try refreshing the page.'}
					</p>
					<button
						onClick={() => window.location.reload()}
						className='px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger-600 transition-colors'
					>
						Retry
					</button>
				</div>
			</CardBody>
		</Card>
	);
}

// Empty state component
function EmptyRooms() {
	return (
		<Card className='bg-content1/95 backdrop-blur-sm border border-divider'>
			<CardBody className='text-center p-12 space-y-4'>
				<div className='bg-primary/10 p-4 rounded-full w-fit mx-auto'>
					<Home className='h-12 w-12 text-primary' />
				</div>
				<div>
					<h3 className='text-xl font-semibold text-foreground mb-2'>No Rooms Found</h3>
					<p className='text-foreground-600 max-w-md mx-auto'>
						No rooms match your current filters. Try adjusting your search criteria.
					</p>
				</div>
			</CardBody>
		</Card>
	);
}

export default function RoomsPage() {
	const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch initial rooms data
	useEffect(() => {
		const fetchRooms = async () => {
			try {
				setLoading(true);
				setError(null);
				const supabase = createClient();
				const { data: rooms, error } = await supabase
					.from('rooms')
					.select('*')
					.order('house_number', { ascending: true })
					.order('number', { ascending: true });

				if (error) {
					console.error('Supabase error:', error);
					setError('Error loading rooms from database');
					return;
				}

				setFilteredRooms(rooms || []);
			} catch (err) {
				console.error('Network error:', err);
				setError('Network error - please check your connection');
			} finally {
				setLoading(false);
			}
		};

		fetchRooms();
	}, []);

	// Handle filter changes
	const handleFiltersChange = useCallback((rooms: Room[]) => {
		setFilteredRooms(rooms);
	}, []);
	// Render content based on state
	const renderContent = () => {
		if (loading) {
			return <RoomsGridSkeleton />;
		}

		if (error) {
			return <RoomsError error={error} />;
		}

		if (filteredRooms.length === 0) {
			return <EmptyRooms />;
		}

		return (
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{filteredRooms.map((room: Room) => (
					<RoomCard key={room.id} room={room} />
				))}
			</div>
		);
	};

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			{/* Minimal Header */}
			<div className='flex items-center gap-3'>
				<div className='bg-primary/10 p-2 rounded-lg'>
					<Home className='h-6 w-6 text-primary' />
				</div>
				<div>
					<h1 className='text-4xl font-bold text-primary'>Rooms</h1>
				</div>
			</div>

			{/* Filter Component */}
			<RoomsFilter onFiltersChange={handleFiltersChange} />

			{/* Rooms Grid */}
			{renderContent()}
		</div>
	);
}
