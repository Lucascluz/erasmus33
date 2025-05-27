'use client';

import { useEffect, useState } from 'react';
import { useParams, redirect } from 'next/navigation';
import { placeHolders } from '@/assets/images';
import BackButton from '@/components/admin/back-button';
import { SubmitButton } from '@/components/submit-button';
import { Profile } from '@/interfaces/profile';
import { createClient } from '@/utils/supabase/client';
import {
    Card,
    CardHeader,
    CardFooter,
    Image,
    Input,
    Switch,
    Button,
} from '@heroui/react';

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const supabase = createClient();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
                setIsActive(data.is_active);
            }
            setLoading(false);
        }

        if (id) fetchProfile();
    }, [id]);

    if (loading || !profile) {
        return (
            <>
                <div className='flex items-center justify-between pb-2'>
                    <BackButton />
                    <h1 className='text-3xl font-bold'>Edit Profile</h1>
                </div>
                <Card className='p-6 mx-auto max-w-4xl w-full'>
                    <CardHeader>
                        <h2 className='text-lg font-semibold'>Loading Profile...</h2>
                    </CardHeader>
                    <CardFooter>
                        <SubmitButton disabled>Loading...</SubmitButton>
                    </CardFooter>
                </Card>
            </>
        );
    }

    return (
        <>
            <div className='flex items-center justify-between pb-2'>
                <BackButton />
                <h1 className='text-3xl font-bold'>Edit Profile</h1>
            </div>

            <Card className='p-6 mx-auto max-w-4xl w-full'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Profile Picture */}
                    <Card className='flex flex-col items-center justify-center'>
                        <Image
                            src={profile.picture_url ?? placeHolders.profilePicture.src}
                            width={200}
                            className='rounded-full'
                            alt='Profile Picture'
                        />
                    </Card>

                    {/* Profile Info */}
                    <div className='flex flex-col gap-4 md:col-span-2'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <Input
                                label='First Name'
                                type='text'
                                name='first_name'
                                value={profile.first_name ?? ''}
                                disabled
                            />
                            <Input
                                label='Last Name'
                                type='text'
                                name='last_name'
                                value={profile.last_name ?? ''}
                                disabled
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <Input
                                label='Email'
                                type='email'
                                name='email'
                                value={profile.email ?? ''}
                                disabled
                                required
                            />
                            <Input
                                label='Phone Number'
                                type='tel'
                                name='phone_number'
                                value={profile.phone_number ?? ''}
                                disabled
                            />
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <Input
                                label='Country'
                                type='text'
                                name='country'
                                value={profile.country ?? ''}
                                disabled
                            />
                            <Input
                                label='Preferred Language'
                                name='preferred_language'
                                value={
                                    profile.preferred_language === 'pt'
                                        ? 'Portuguese'
                                        : profile.preferred_language === 'en'
                                            ? 'English'
                                            : 'Other'
                                }
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <CardFooter className='mt-6 justify-between flex flex-col md:flex-row gap-4'>
                    <Button
                        variant='solid'
                        color='primary'
                        size='lg'
                        onPress={async () => {
                            const { error } = await supabase
                                .from('profiles')
                                .update({ is_active: isActive })
                                .eq('user_id', id);

                            if (error) {
                                console.error('Error updating profile:', error);
                            } else {
                                redirect('/admin');
                            }
                        }}
                    >
                        Save
                    </Button>

                    <div className='flex items-center gap-2'>
                        <label htmlFor='is_active' className='text-sm font-medium'>
                            {isActive ? 'Active' : 'Inactive'}
                        </label>
                        <Switch
                            id='is_active'
                            isSelected={isActive}
                            onValueChange={setIsActive}
                            size='lg'
                        />
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
