'use client';

import { DropdownItem, DropdownMenu } from '@heroui/react';
import { signOutAction } from '@/app/actions';
import { color } from 'framer-motion';

export default function ProfileDropdown({ role }: { role: string }) {
	const userDropdownItems = [
		// {
		// 	key: 'profile',
		// 	label: 'Profile',
		// 	href: '/protected/profile',
		// 	action: null,
		// },
		// {
		// 	key: 'payments',
		// 	label: 'Payments',
		// 	href: '/protected/payments',
		// 	action: null,
		// },
		{
			key: 'signout',
			label: 'Sign-Out',
			href: null,
			action: signOutAction,
			color: 'danger' as 'danger',
		},
	];

	const adminDropdownItems = [
		...userDropdownItems,
		{
			key: 'admin',
			label: 'Admin',
			href: '/admin',
			action: null,
			color: 'primary' as 'primary',
		},
	];

	return (
		<DropdownMenu aria-label='Static Actions'>
			{(role === 'admin' ? adminDropdownItems : userDropdownItems).map(
				({ key, label, href, action, color }) => (
					<DropdownItem
						key={key}
						color={color}
						onPress={action ? action : undefined}
						href={href ?? undefined}>
						{label}
					</DropdownItem>
				)
			)}
		</DropdownMenu>
	);
}
