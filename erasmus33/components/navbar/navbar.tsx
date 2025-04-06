import { images } from '@/assets/images';
import {
	Navbar as HeroUiNavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Avatar,
	Link,
} from '@heroui/react';

import AuthButton from './header-auth';
import { createClient } from '@/utils/supabase/server';

interface NavbarProps {
	links: { name: string; href: string }[];
}

export default async function Navbar({ links }: NavbarProps) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<HeroUiNavbar isBordered isBlurred maxWidth='full' position='sticky'>
			<NavbarBrand as='li' className='gap-2 max-w-fit'>
				<Link href='/'>
					<Avatar src={images.logo.src} />
				</Link>
			</NavbarBrand>
			<NavbarContent className='sm:basis-full' justify='center'>
				{links.map((link) => (
					<NavbarItem key={link.name}>
						<Link
							className='text-white hover:text-gray-400 cursor-pointer'
							href={link.href}>
							{link.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarItem>
				<AuthButton user_id={user?.id ?? null} />
			</NavbarItem>
		</HeroUiNavbar>
	);
}
