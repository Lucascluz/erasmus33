'use client';

import { useState, useEffect } from 'react';
import HouseCard from '@/components/houses/house-card';
import { House } from '@/interfaces/house';
import { createClient } from '@/utils/supabase/client';
import { Card, CardBody } from '@heroui/react';
import { Home, Camera } from 'lucide-react';

// Loading component for better UX
function HousesGridSkeleton() {
    return (
        <div className='space-y-8'>
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className='bg-content1/50 animate-pulse'>
                    <div className='p-4 pb-0'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-content2/50 rounded-lg' />
                                <div className='space-y-2'>
                                    <div className='h-5 bg-content2/50 rounded w-24' />
                                    <div className='h-4 bg-content2/50 rounded w-32' />
                                </div>
                            </div>
                            <div className='h-6 bg-content2/50 rounded w-16' />
                        </div>                    </div>
                    <div className='px-4 mb-4'>
                        <div className='h-[500px] bg-content2/50 rounded-xl' />
                    </div>
                </Card>
            ))}
        </div>
    );
}

// Error fallback component
function HousesError({ error }: { error?: string }) {
    return (
        <Card className='bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800/50'>
            <CardBody className='text-center p-8 space-y-4'>
                <div className='bg-danger/10 p-3 rounded-full w-fit mx-auto'>
                    <Home className='h-8 w-8 text-danger' />
                </div>
                <div>
                    <h3 className='text-lg font-semibold text-danger mb-2'>Error Loading Houses</h3>
                    <p className='text-foreground-600 mb-4'>
                        {error || 'We\'re having trouble loading the houses. Please try refreshing the page.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className='px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger-600 transition-colors'
                    >
                        Retry
                    </button>
                </div>
            </CardBody>
        </Card>
    );
}

// Empty state component
function EmptyHouses() {
    return (
        <Card className='bg-content1/95 backdrop-blur-sm border border-divider'>
            <CardBody className='text-center p-12 space-y-4'>
                <div className='bg-primary/10 p-4 rounded-full w-fit mx-auto'>
                    <Camera className='h-12 w-12 text-primary' />
                </div>
                <div>
                    <h3 className='text-xl font-semibold text-foreground mb-2'>No Houses Found</h3>
                    <p className='text-foreground-600 max-w-md mx-auto'>
                        No houses are available to display at the moment.
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}

export default function HousesPage() {
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate total images across all houses
    const totalImages = houses.reduce((total, house) => total + (house.images?.length || 0), 0);

    // Fetch houses data
    useEffect(() => {
        const fetchHouses = async () => {
            try {
                setLoading(true);
                setError(null);
                const supabase = createClient();
                const { data: houses, error } = await supabase
                    .from('houses')
                    .select('*')
                    .order('number', { ascending: true });

                if (error) {
                    console.error('Supabase error:', error);
                    setError('Error loading houses from database');
                    return;
                }

                setHouses(houses || []);
            } catch (err) {
                console.error('Network error:', err);
                setError('Network error - please check your connection');
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, []);

    // Render content based on state
    const renderContent = () => {
        if (loading) {
            return <HousesGridSkeleton />;
        }

        if (error) {
            return <HousesError error={error} />;
        }

        if (houses.length === 0) {
            return <EmptyHouses />;
        } return (
            <div className='space-y-8'>
                {houses.map((house: House) => (
                    <HouseCard key={house.id} house={house} />
                ))}
            </div>
        );
    };

    return (
        <div className='max-w-5xl mx-auto space-y-8 p-4'>
            {/* Gallery Header */}
            <div className='text-center space-y-4'>
                <div className='flex items-center justify-center gap-3'>
                    <div className='bg-primary/10 p-3 rounded-xl'>
                        <Camera className='h-8 w-8 text-primary' />
                    </div>
                    <h1 className='text-4xl font-bold text-primary'>House Gallery</h1>
                </div>
            </div>

            {/* Houses Gallery */}
            {renderContent()}
        </div>
    );
}
