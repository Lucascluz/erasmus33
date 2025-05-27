"use client";

import { placeHolders } from "@/assets/images";
import { SubmitButton } from "@/components/submit-button";
import { Profile } from "@/interfaces/profile";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardFooter, Select, SelectItem, Image, Input } from "@heroui/react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {

    const { id } = useParams();

    const supabase = createClient();

    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                redirect('/sign-in');
            } else {
                setProfile(data);
            }
        }

        fetchProfile();
    }, [id, supabase]);

    if (profile) return (
        <Card className='p-6 mx-auto max-w-4xl w-full'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='flex flex-col items-center justify-center'>
                    <Image
                        src={profile.picture_url ?? placeHolders.profilePicture.src}
                        width={200}
                        className='rounded-full'
                    />
                </Card>

                <div className='flex flex-col gap-4 md:col-span-2'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            label='Email'
                            type='email'
                            name='email'
                            required
                            value={profile.email ?? ""}
                            disabled
                        />
                        <Input
                            label='Phone Number'
                            type='phone_number'
                            name='phone_number'
                            value={profile.phone_number}
                            disabled
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            label='First Name'
                            type='text'
                            name='first_name'
                            value={profile.first_name}
                            disabled
                        />
                        <Input
                            label='Last Name'
                            type='text'
                            name='last_name'
                            value={profile.last_name}
                            disabled
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            label='Country'
                            type='text'
                            name='country'
                            value={profile.country}
                            disabled
                        />
                        <Input
                            label='Preferred Language'
                            name='preferred_language'
                            value={profile.preferred_language == "pt" ? "Portuguese" : profile.preferred_language == "en" ? "English" : "Other"}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </Card>
    ); else {
        return (
            <Card className='p-6 mx-auto max-w-4xl w-full'>
                <CardHeader>
                    <h2 className='text-lg font-semibold'>Loading Profile...</h2>
                </CardHeader>
                <CardFooter>
                    <SubmitButton disabled>Loading...</SubmitButton>
                </CardFooter>
            </Card>
        );
    }
}