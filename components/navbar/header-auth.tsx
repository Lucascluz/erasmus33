import Link from 'next/link';

import { Avatar, Button, Dropdown, DropdownTrigger } from '@heroui/react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import ProfileDropdown from '@/components/navbar/profile-dropdown';

export default async function AuthButton({
	user_id,
}: {
	user_id: string | null;
}) {
	if (user_id) {
		const supabase = createClient();
		const { data: profile, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('user_id', user_id)
			.single();

		if (error) {
			console.error('Error fetching user profile:', error);
			return redirect('/sign-in');
		}

		return (
			<Dropdown placement='bottom-end'>
				<DropdownTrigger>
					<div className='flex items-center rounded-md gap-2 cursor-pointer'>
						<Avatar src={profile.picture_url} alt={'Profile picture'} />
						<div className='flex flex-col'>
							<span className='text-sm text-white font-semibold'>
								{profile.first_name}
							</span>
							<span className='text-xs text-gray-400 font-normal'>
								{profile.last_name}
							</span>
						</div>
					</div>
				</DropdownTrigger>
				<ProfileDropdown id={user_id} role={profile.role} />{' '}
			</Dropdown>
		);
	} else
		return (
			<div className='flex gap-2'>
				<Button variant='flat'>
					<Link href='/sign-in'>Sign in</Link>
				</Button>
				<Button color='primary' variant='flat'>
					<Link href='/sign-up'>Sign up</Link>
				</Button>
			</div>
		);
}
