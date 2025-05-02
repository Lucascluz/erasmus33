'use client';

import { useCallback, useEffect, useState } from 'react';
import { Room } from '@/interfaces/room';
import {
    Button,
    Card,
    CardFooter,
    Image,
    Input,
    Select,
    SelectItem,
} from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { TrashIcon } from 'lucide-react';
import { House } from '@/interfaces/house'; // Adjust the path as needed
import { createClient } from '@/utils/supabase/client';
import { updateRoom } from '@/app/admin/rooms/edit/actions';
import zod from 'zod';

const types = [
    { id: 'single', name: 'Single', beds: 1 },
    { id: 'double', name: 'Double', beds: 2 },
    { id: 'triple', name: 'Triple', beds: 3 },
    { id: 'quadruple', name: 'Quadruple', beds: 4 },
]

export default function RoomFormEdit({ id }: { id: string }) {
    const supabase = createClient();

    const [room, setRoom] = useState<Room | null>(null);

    const [housesData, setHousesData] = useState<House[]>([]);

    const [newImagesFiles, setNewImagesFiles] = useState<File[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
    const [displayedImageUrl, setDisplayedImageUrls] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchCurrentRoom = async () => {
            try {
                const { data: roomData, error: roomError } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (roomError) throw roomError;
                if (roomData) {
                    setRoom(roomData);
                }
            } catch (error) {
                console.error('Error loading room:', error);
            }
        }

        const fetchHouses = async () => {
            try {
                const { data: housesData, error: housesError } = await supabase
                    .from('houses')
                    .select('*');

                if (housesError) throw housesError;
                if (housesData) {
                    setHousesData(housesData);
                }
            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        }

        fetchCurrentRoom();
        fetchHouses();

        setLoading(false);
    }, []);

    const updateUi = useCallback(
        (file: File) => {
            setLoading(true);
            setNewImagesFiles((prev) => [...prev, file]);
            const tempUrl = URL.createObjectURL(file);
            setDisplayedImageUrls((prev) => [...prev, tempUrl]);
            setLoading(false);
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        // Validate room data
        const roomSchema = zod.object({
            number: zod.number().min(1, 'Room number must be greater than 0'),
            price: zod.number().min(0, 'Price must be greater than or equal to 0'),
            type: zod.string(),
            house_id: zod.string(),
            description: zod.string().optional(),
        });

        const validationResult = roomSchema.safeParse(room);
        if (!validationResult.success) {
            console.error('Validation errors:', validationResult.error.format());
            return;
        }

        // Update room data in the database
        if (room) {
            updateRoom(room, newImagesFiles, deletedImageUrls);
        }
        redirect('/admin/');
    };

    if (loading || !room) {
        return <p>Loading...</p>;
    }

    return (
        <Card className='p-6 max-w-3xl mx-auto'>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='grid grid-cols-2 gap-4'>
                    <Input
                        isRequired
                        type='text'
                        label='Room Number'
                        value={room.number.toString()}
                        onChange={(e) => setRoom({ ...room, number: parseInt(e.target.value) })}
                    />
                    <Input
                        isRequired
                        type='number'
                        label='Price'
                        value={room.price.toString()}
                        onChange={(e) => setRoom({ ...room, price: parseFloat(e.target.value) })}
                    />
                    <Select
                        isRequired
                        label='Type'
                        defaultSelectedKeys={[room.type]}
                        onChange={(e) => {
                            setRoom({ ...room, type: e.target.value, beds: types.find(type => type.id === e.target.value)?.beds || 1 });
                        }}>
                        {types.map((type) => (
                            <SelectItem key={type.id} >{type.name}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        isRequired
                        label='House'
                        defaultSelectedKeys={[room.house_id]}
                        onChange={(e) => {
                            setRoom({ ...room, house_id: e.target.value });
                        }}>
                        {housesData.map((house) => (
                            <SelectItem key={house.id}>
                                {`House ${house.number}`}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <Input
                    type='text'
                    label='Description'
                    value={room.description}
                    onChange={(e) => setRoom({ ...room, description: e.target.value })}
                />
                <ImageCropper aspectRatio='16/9' callback={updateUi} />
                <div className='grid grid-cols-4 gap-4'>
                    {displayedImageUrl.map((image, index) => (
                        <Card key={index} className='w-full overflow-hidden items-end'>
                            <Image
                                src={image}
                                alt={`Room Image ${index + 1}`}
                                className='w-full object-cover rounded-md'
                                children={null}
                            />
                            <TrashIcon
                                className='h-5 w-5 m-2 hover:text-danger cursor-pointer'
                                onClick={() => {
                                    setRoom({ ...room, images: room.images.filter((_, i) => i !== index) });
                                    setDeletedImageUrls((prev) => [...prev, image]);
                                    setDisplayedImageUrls((prev) => prev.filter((_, i) => i !== index));
                                }}
                            />
                        </Card>
                    ))}
                </div>
                <CardFooter className='flex justify-between'>
                    <Button className='p-2 rounded-md' color='primary' type='submit'>
                        Update
                    </Button>
                    <Button
                        className='p-2 rounded-md'
                        color='danger'
                        type='button'
                        onPress={() => redirect('/admin')}>
                        Cancel
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
