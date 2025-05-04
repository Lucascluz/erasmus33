'use client'

import BackButton from '@/components/admin/back-button';
import HouseFormEdit from '@/components/houses/house-edit-form';
import { useParams } from 'next/navigation';

export default function HouseNewPage() {

    const { id } = useParams() as { id: string };

    return (
        <div className='max-w-3xl mx-auto p-6'>
            <div className='flex items-center justify-between p-4'>
                <BackButton />
                <h1 className='text-3xl font-bold'>Edit House</h1>
            </div>
            <HouseFormEdit id={id} />
        </div>
    );
}
