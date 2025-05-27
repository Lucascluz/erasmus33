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

export default async function Navbar() {
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
            <NavbarContent className='sm:basis-full' justify='start'>
                <NavbarItem key={'home'} className='hidden md:block'>
                    <Link className='text-white hover:text-gray-400 cursor-pointer' href={'/'}>
                        {'Home'}
                    </Link>
                </NavbarItem>
                <NavbarItem key={'houses'}>
                    <Link
                        className='text-white hover:text-gray-400 cursor-pointer'
                        href={'/protected/houses'}>
                        {'Houses'}
                    </Link>
                </NavbarItem>
                <NavbarItem key={'rooms'}>
                    <Link
                        className='text-white hover:text-gray-400 cursor-pointer'
                        href={'/protected/rooms'}>
                        {'Rooms'}
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarItem>
                <AuthButton user_id={user?.id ?? null} />
            </NavbarItem>
        </HeroUiNavbar>
    );
}