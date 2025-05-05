'use client'

import BackButton from '@/components/admin/back-button';
import HouseForm from '@/components/houses/house-form';
import { useParams } from 'next/navigation';

export default function HouseNewPage() {

    const { id } = useParams() as { id: string };

    return (
        <div className='max-w-3xl mx-auto'>
            <div className='flex items-center justify-between pb-2'>
                <BackButton />
                <h1 className='text-3xl font-bold'>Edit House</h1>
            </div>
            <HouseForm mode={'edit'} id={id} />
        </div>
    );
}
