'use client';

import {
    Button,
    Card,
    CardFooter,
    Checkbox,
    Input,
    Select,
    SelectItem,
    Spinner,
} from '@heroui/react';
import { SaveIcon, TrashIcon } from 'lucide-react';
import ImageCropper from '../ui/image-cropper';
import { FormImagesModal } from '../ui/form-images-modal';
import { useRoomForm } from '@/hooks/useRoomForm';
import { roomTypes } from '@/interfaces/room';

export default function RoomForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
    const {
        room,
        housesData,
        hasLoaded,
        loading,
        displayedImageUrls,
        setRoom,
        handleImageAdd,
        handleImageRemove,
        handleSubmit,
        handleDelete,
    } = useRoomForm({ mode, id });

    return (
        <Card className='p-4 max-w-3xl mx-auto'>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='grid grid-cols-2 gap-4'>
                    <Select
                        isRequired
                        label='House'
                        disabled={loading}
                        defaultSelectedKeys={[room.house_id]}
                        onChange={(e) => {
                            const house = housesData.find(h => h.id === e.target.value);
                            if (house) {
                                setRoom({ ...room, house_id: house.id, house_number: Number(house.number) });
                            }
                        }}>
                        {housesData.map(house => (
                            <SelectItem key={house.id}>{`House ${house.number}`}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        isRequired
                        label='Type'
                        disabled={loading}
                        defaultSelectedKeys={[room.type]}
                        onChange={(e) => {
                            const selected = roomTypes.find(t => t.id === e.target.value);
                            setRoom({
                                ...room,
                                type: e.target.value,
                                beds: selected?.beds || 1,
                            });
                        }}>
                        {roomTypes.map((type) => (
                            <SelectItem key={type.id}>{type.name}</SelectItem>
                        ))}
                    </Select>
                </div>

                <div className='grid grid-cols-3 gap-4'>
                    <Input
                        isRequired
                        type='text'
                        label='Room Number'
                        disabled={loading}
                        value={room.number.toString()}
                        onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value) })}
                    />
                    <Input
                        isRequired
                        type='number'
                        label='Price'
                        disabled={loading}
                        value={room.price.toString()}
                        onChange={(e) => setRoom({ ...room, price: parseFloat(e.target.value) })}
                    />
                    <Checkbox
                        isSelected={room.is_available}
                        onValueChange={() => setRoom({ ...room, is_available: !room.is_available })}>
                        {room.is_available ? 'Available' : 'Not Available'}
                    </Checkbox>
                </div>

                <Input
                    type='text'
                    label='Description'
                    disabled={loading}
                    value={room.description}
                    onChange={(e) => setRoom({ ...room, description: e.target.value })}
                />

                <Card className='p-2'>
                        <ImageCropper aspectRatio='16/9' callback={handleImageAdd} />
                        <FormImagesModal images={displayedImageUrls} onRemoveImage={(url) => handleImageRemove(url)} />
                </Card>

                <CardFooter className='flex justify-between'>
                    <Button type='submit' color='primary' isLoading={loading} startContent={<SaveIcon className='h-5 w-5' />}>
                        {mode === 'create' ? 'Create' : 'Update'}
                    </Button>
                    {mode === 'edit' && (
                        <Button
                            color='danger'
                            type='button'
                            onPress={handleDelete}
                            startContent={<TrashIcon className='h-5 w-5' />}
                        >
                            Delete
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}
