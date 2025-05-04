'use client';

import { useCallback, useEffect, useState } from 'react';
import { Room } from '@/interfaces/room';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Chip,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Spinner,
} from '@heroui/react';
import ImageCropper from '../ui/image-cropper';
import { redirect } from 'next/navigation';
import { ArrowLeftCircleIcon, ArrowLeftIcon, Disc2Icon, Disc3Icon, DiscIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { House } from '@/interfaces/house'; // Adjust the path as needed
import { createClient } from '@/utils/supabase/client';
import { deleteRoom, updateRoom } from '@/app/admin/rooms/edit/actions';
import zod from 'zod';
import { Arrow } from '@radix-ui/react-dropdown-menu';

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
                    setDisplayedImageUrls(roomData.images || []);
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

    const handleImageDelete = useCallback(
        (url: string) => {
            setLoading(true);
            setDisplayedImageUrls((prev) => prev.filter((image) => image !== url));
            setDeletedImageUrls((prev) => [...prev, url]);
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

    const handleDelete = async () => {
        setLoading(true);
        await deleteRoom(room!);
        redirect('/admin');
    }

    if (!room) {
        return (
            <div className='flex justify-center h-screen'>
                <Spinner size='lg' color='primary' />
            </div>
        );
    }

    return (
        <Card className='p-6 max-w-3xl mx-auto'>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='grid grid-cols-2 gap-4'>
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
                <div className='grid grid-cols-3 gap-4'>
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
                    <Checkbox isSelected={room.is_available} onValueChange={() => setRoom({ ...room, is_available: !room.is_available })}>
                        {room.is_available ? 'Available' : 'Not Available'}
                    </Checkbox>
                </div>
                <Input
                    type='text'
                    label='Description'
                    value={room.description}
                    onChange={(e) => setRoom({ ...room, description: e.target.value })}
                />

                <Card className='p-2'>
                    <CardHeader>
                        <ImageCropper aspectRatio='16/9' callback={updateUi} />
                    </CardHeader>
                    <CardBody>
                        <FormImagesModal images={displayedImageUrl} onRemoveImage={handleImageDelete} />
                    </CardBody>
                </Card>

                <CardFooter className='flex justify-between'>
                    <Button className='p-2 rounded-md' color='primary' type='submit' isLoading={loading} startContent={<SaveIcon className='h-5 w-5' />}>
                        Update
                    </Button>
                    <RoomDeleteModal onDelete={handleDelete} />
                </CardFooter>
            </form>
        </Card>
    );
}

const RoomDeleteModal = ({ onDelete }: { onDelete: () => void }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                className='p-2'
                color='danger'
                type='button'
                isLoading={isLoading}
                disabled={isLoading}
                
                startContent={<TrashIcon className='h-5 w-5' />}
                onPress={() => setIsOpen(true)}>
                Delete
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size='lg'>
                <ModalContent className='max-w-2xl'>
                    <ModalHeader>Deleting Room</ModalHeader>
                    <ModalBody className='flex flex-col items-center'>
                        <p>Are you sure you want to delete this room?</p>
                        <p>This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter className='flex justify-between'>
                        <Button color='primary' onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button color='danger' onPress={onDelete}>
                            Sure
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const FormImagesModal = ({ images, onRemoveImage }: { images: string[], onRemoveImage: (url: string) => void }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className='grid grid-cols-4 gap-4'>
            {images.map((image, index) => (
                <Card key={index} className='w-full overflow-hidden items-end' isPressable onPress={() => {
                    console.log(image);
                    setSelectedImage(image);
                    setIsOpen(true);
                }}>
                    <Image
                        src={image}
                        alt={`Room Image ${index + 1}`}
                        className='w-full object-cover rounded-md'
                        isZoomed
                    />
                </Card>
            ))}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size='xl' className='overflow-hidden'>
                <ModalContent className='max-w-2xl'>

                        <Image
                            src={selectedImage!}
                            alt='Selected Room Image'
                            className='w-full object-cover rounded-md'
                        />

                    <ModalFooter className='flex justify-between'>	
                        <Button color='primary' onPress={() => setIsOpen(false)} className='mr-2' startContent={<ArrowLeftIcon className='h-5 w-5' />}>
                            Back
                        </Button>

                        <Button color='danger' startContent={<TrashIcon className='h-5 w-5' />} className='mb-2' isLoading={false} disabled={false}
                        onPress={() => {
                            if (selectedImage) {
                                onRemoveImage(selectedImage);
                            }
                            setIsOpen(false);
                        }}>
                            Delete Image
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    )
}
