'use client'

import { Button, Card, CardHeader } from '@heroui/react';
import { type House } from '@/interfaces/house';

export default function HouseInfoCard({ house }: { house: House }) {
	return (
		<div className='flex flex-col gap-4'>
			<Card className='rounded-2xl shadow-xl p-1'>
				<CardHeader className='flex flex-col'>
					<div className='flex justify-between items-center gap-2'>
						<h1 className='text-lg font-bold'>House {house.number}</h1>
					</div>
				</CardHeader>
			</Card>
			<Card className='rounded-2xl shadow-xl p-4'>
				<div className='flex flex-col gap-2'>
					<label className='text-sm text-muted-foreground font-bold'>
						Descrição:
					</label>
					<p className='text-sm'>{house.description}</p>
				</div>
			</Card>
			<Card className='rounded-2xl shadow-xl p-6'>
				<div className='flex flex-col gap-2'>
					<label className='text-sm text-muted-foreground font-bold'>
						Endereço:
					</label>
					<p className='text-sm'>{`${house.street} ${house.number}`}</p>
				</div>
				<Button
					variant='bordered'
					className='mt-4'
					onPress={() => window.open(house.google_maps, '_blank')}>
					Ver no Google Maps
				</Button>
			</Card>
		</div>
	);
}
