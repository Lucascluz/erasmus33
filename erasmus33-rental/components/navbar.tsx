'use client';

import {
	Navbar as HeroUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from '@heroui/navbar';
import { Link } from '@heroui/link';
import { link as linkStyles } from '@heroui/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { Avatar } from '@heroui/avatar';
import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '@/lib/supabase'; // Ensure you have this file
import { Button } from '@heroui/button';
import { User } from '@supabase/supabase-js';

export const Navbar = () => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user || null);
			if (session?.user) {
				const { data, error } = await supabase
					.from('users')
					.select('role')
					.eq('id', session.user.id)
					.single();
				if (!error && data) {
					setRole(data.role);
				}
			}
		};

		fetchUser();
	}, []);

	return (
		<HeroUINavbar maxWidth='xl' position='sticky'>
			<NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
				<NavbarBrand as='li' className='gap-3 max-w-fit'>
					<NextLink className='flex justify-start items-center gap-4' href='/'>
						<Avatar
							className='w-12 h-12 text-large'
							src='https://scontent.flis6-1.fna.fbcdn.net/v/t39.30808-6/271729632_265800025651586_8565946951297877827_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=qAgWFgjrpsoQ7kNvgE28tOD&_nc_oc=AdjCJOJThhc5b3uhb7Ui6U59w9_js6_Nwb7gOprLEIPO_ztT8WUMF1yFpxl85r6rSAw&_nc_zt=23&_nc_ht=scontent.flis6-1.fna&_nc_gid=AgwEzPcwaMD1tNKJ7qTCU3p&oh=00_AYCJ9iqCxBNhJsEZhrF1lxHiUvEP0NNyKSDiU_2CVwf5ZA&oe=67CABFA8'
						/>
						<p className='font-bold text-inherit text-xl'>Erasmus 33</p>
					</NextLink>
				</NavbarBrand>
				<ul className='hidden lg:flex gap-4 justify-start ml-2'>
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: 'foreground' }),
									'data-[active=true]:text-primary data-[active=true]:font-medium'
								)}
								color='foreground'
								href={item.href}>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent
				className='hidden sm:flex basis-1/5 sm:basis-full'
				justify='end'>
				<NavbarItem className='hidden sm:flex gap-2'>
					<Link isExternal aria-label='WhatsApp' href={siteConfig.links.whatsapp}>
						<Icon
							icon='mdi:whatsapp'
							width={32}
							height={32}
							className='text-green-500'
						/>
					</Link>
				</NavbarItem>
				<NavbarItem className='hidden sm:flex gap-2'>
					<ThemeSwitch />
				</NavbarItem>
				{/* Profile/Auth Button */}
				<NavbarItem>
					<Button
						as={NextLink}
						href={user ? (role === 'admin' ? 'admin/profile' : '/profile') : '/auth'}
						color='primary'
						variant='solid'>
						{user ? 'Profile' : 'Login'}
					</Button>
				</NavbarItem>
			</NavbarContent>
		</HeroUINavbar>
	);
};
