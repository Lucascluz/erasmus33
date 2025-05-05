'use client';

import { Button, Card, CardFooter, Input, Spinner } from '@heroui/react';
import { SaveIcon, TrashIcon } from 'lucide-react';
import ImageCropper from '../ui/image-cropper';
import { FormImagesModal } from '../ui/form-images-modal';
import { useHouseForm } from '@/hooks/useHouseForm';

export default function HouseForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
    const {
        hasLoaded,
        loading,
        house,
        displayedImageUrls,
        setHouse,
        handleImageRemove,
        handleImageAdd,
        handleSubmit,
        handleDelete,
    } = useHouseForm({ mode, id });

    if (!hasLoaded) {
        return (
            <div className='flex justify-center h-screen'>
                <Spinner size='lg' color='primary' />
            </div>
        );
    }

    return (
        <Card className='p-4'>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='grid grid-cols-6 gap-4'>
                    <Input
                        className='col-span-3'
                        label='Street'
                        value={house.street}
                        onValueChange={(value) => setHouse({ ...house, street: value })}
                    />
                    <Input
                        className='col-span-1'
                        label='Number'
                        type='number'
                        value={String(house.number)}
                        onValueChange={(value) => setHouse({ ...house, number: Number(value)})}
                    />
                    <Input
                        className='col-span-2'
                        label='Postal Code'
                        value={house.postal_code}
                        onValueChange={(value) => setHouse({ ...house, postal_code: value })}
                    />
                </div>
                <Input
                    label='Description'
                    value={house.description}
                    onValueChange={(value) => setHouse({ ...house, description: value })}
                />

                <Card className='p-4'>
                    <ImageCropper aspectRatio='16/9' callback={handleImageAdd} />
                    <FormImagesModal
                        images={displayedImageUrls}
                        onRemoveImage={(url) => handleImageRemove(displayedImageUrls.indexOf(url))}
                    />
                </Card>

                <CardFooter className='flex justify-between'>
                    <Button color='primary' type='submit' isLoading={loading} startContent={<SaveIcon className='w-5 h-5' />}>
                        Submit
                    </Button>
                    {mode === 'edit' && (
                        <Button color='danger' type='button' startContent={<TrashIcon className='w-5 h-5' />} onPress={handleDelete}>
                            Delete
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}
