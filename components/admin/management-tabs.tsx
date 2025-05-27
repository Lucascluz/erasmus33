'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import HousesManagement from './house-management';
import RoomsManagement from './rooms-management';
import UsersManagement from './users-management';
import { Room } from '@/interfaces/room';
import { House } from '@/interfaces/house';
import { Profile } from '@/interfaces/profile';

export default function ManagementTabs({
	profiles,
	houses,
	rooms,
}: {
	profiles: Profile[];
	houses: House[];
	rooms: Room[];
}) {
	return (
		<Tabs aria-label='Management options' className='mb-8'>
			<Tab key='houses' title='Houses'>
				<HousesManagement houses={houses} />
			</Tab>
			<Tab key='rooms' title='Rooms'>
				<RoomsManagement rooms={rooms} />
			</Tab>
			<Tab key='users' title='Users'>
				<UsersManagement profiles={profiles} />
			</Tab>
		</Tabs>
	);
}
