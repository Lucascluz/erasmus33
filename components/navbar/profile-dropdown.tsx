'use client';

import { DropdownItem, DropdownMenu } from '@heroui/react';
import { signOutAction } from '@/app/actions';

export default function ProfileDropdown({ id, role }: {id: string, role: string }) {
	return (
		<DropdownMenu aria-label='Static Actions'>
			<DropdownItem
				key="profile"
				color="primary"
				href={`/protected/profile/${id}`}	
			>
				Profile
			</DropdownItem>
			<DropdownItem
				key="signout"
				color="danger"
				onPress={signOutAction}
			>
				Sign-Out
			</DropdownItem>
			{role === 'admin' ? (
				<DropdownItem
					key="admin"
					color="primary"
					href="/admin"
				>
					Admin
				</DropdownItem>
			) : null}
		</DropdownMenu>
	);
}
