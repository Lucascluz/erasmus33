'use client';

import Image from 'next/image';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import { House } from '@/interfaces/house';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, MapPin, ChevronLeft, ChevronRight, Camera, ArrowRight } from 'lucide-react';

export default function HouseCard({ house }: { house: House }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const router = useRouter();
    const images = house.images || [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleViewRooms = () => {
        // Navigate to rooms page with house filter
        router.push(`/protected/rooms?house=${house.number}`);
    };

    return (
        <Card className='bg-content1/95 backdrop-blur-sm border border-divider shadow-xl overflow-hidden group'>
            {/* House Header */}
            <div className='p-4 pb-0'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 p-2 rounded-lg'>
                            <Home className='h-8 w-8 text-primary' />
                        </div>
                        <div className='space-y-1 pb-2'>
                            <h2 className='font-bold text-2xl text-foreground'>House {house.number}</h2>
                            <div className='flex items-center gap-1 text-foreground-500 '>
                                <MapPin className='h-4 w-4' />
                                <span className='text-sm'>{house.street}, {house.postal_code}</span>
                            </div>
                        </div>
                    </div>
                    {images.length > 0 && (
                        <Chip
                            variant='flat'
                            color='primary'
                            startContent={<Camera className='h-3 w-3' />}
                            size='sm'
                            className='font-medium'
                        >
                            {images.length} photos
                        </Chip>
                    )}
                </div>
            </div>

            {/* Image Carousel Section */}
            <div className='px-4 mb-4'>
                <div className='relative w-full h-[500px] overflow-hidden rounded-xl'>
                    {images.length > 0 ? (
                        <>
                            <Image
                                src={images[currentImageIndex]}
                                alt={`House ${house.number} - Image ${currentImageIndex + 1}`}
                                fill
                                className='object-cover transition-all duration-300'
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={currentImageIndex === 0}
                            />

                            {/* Navigation Buttons */}
                            {images.length > 1 && (
                                <>
                                    <Button
                                        isIconOnly
                                        size='sm'
                                        variant='solid'
                                        color='default'
                                        className='absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10'
                                        onPress={previousImage}
                                    >
                                        <ChevronLeft className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size='sm'
                                        variant='solid'
                                        color='default'
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10'
                                        onPress={nextImage}
                                    >
                                        <ChevronRight className='h-4 w-4' />
                                    </Button>
                                </>
                            )}

                            {/* Image Indicators */}
                            {images.length > 1 && (
                                <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10'>
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                                                ? 'bg-white scale-125'
                                                : 'bg-white/50 hover:bg-white/75'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Image Counter */}
                            {images.length > 1 && (
                                <div className='absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-lg text-xs font-medium'>
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='w-full h-full bg-content2 flex items-center justify-center rounded-xl'>
                            <div className='text-center space-y-2'>
                                <Home className='h-16 w-16 text-foreground-400 mx-auto' />
                                <span className='text-foreground-500'>No images available</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Description Section */}
            {house.description && (
                <CardBody className='pt-0 p-4 pb-4'>
                    <div className='space-y-2'>
                        <h4 className='font-semibold text-foreground'>About this house</h4>
                        <p className='text-sm text-foreground-600 leading-relaxed'>
                            {house.description}
                        </p>
                    </div>
                </CardBody>
            )}

            {/* View Rooms Button */}
            <div className='p-4 pt-0 pb-4'>
                <Button
                    color='primary'
                    variant='flat'
                    onPress={handleViewRooms}
                    endContent={<ArrowRight className='h-4 w-4' />}
                    className='w-full font-medium'
                >
                    View Rooms in House {house.number}
                </Button>
            </div>
        </Card>
    );
}
