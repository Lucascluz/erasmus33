'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Input, Chip } from '@heroui/react';
import { Filter, X, Search } from 'lucide-react';
import { House } from '@/interfaces/house';
import { createClient } from '@/utils/supabase/client';

interface FilterState {
    search: string;
}

interface HousesFilterProps {
    onFiltersChange?: (filteredHouses: House[]) => void;
}

export default function HousesFilter({ onFiltersChange }: HousesFilterProps) {
    const [houses, setHouses] = useState<House[]>([]);
    const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        search: ''
    });

    // Use ref to store the latest callback to avoid dependency issues
    const onFiltersChangeRef = useRef(onFiltersChange);
    useEffect(() => {
        onFiltersChangeRef.current = onFiltersChange;
    });

    // Fetch houses data
    useEffect(() => {
        const fetchHouses = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('houses')
                .select('*')
                .order('number', { ascending: true });

            if (data) {
                setHouses(data);
                setFilteredHouses(data);
            }
        };

        fetchHouses();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...houses];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(house =>
                house.number.toString().includes(filters.search) ||
                house.street.toLowerCase().includes(filters.search.toLowerCase()) ||
                house.postal_code.includes(filters.search) ||
                (house.description && house.description.toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        setFilteredHouses(filtered);
        onFiltersChangeRef.current?.(filtered);
    }, [filters, houses]);

    // Handle filter change
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: ''
        });
    };

    // Count active filters
    const activeFiltersCount = Object.entries(filters).filter(([, value]) =>
        value !== ''
    ).length;

    return (
        <Card className='bg-content1/95 backdrop-blur-sm border border-divider shadow-lg'>
            <CardBody className='p-4'>
                {/* Filter Header */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 p-2 rounded-lg'>
                            <Filter className='h-4 w-4 text-primary' />
                        </div>
                        <div>
                            <h3 className='font-semibold text-foreground'>Search Houses</h3>
                            <p className='text-xs text-foreground-500'>
                                {filteredHouses.length} of {houses.length} houses
                            </p>
                        </div>
                        {activeFiltersCount > 0 && (
                            <Chip size='sm' color='primary' variant='flat'>
                                {activeFiltersCount} active
                            </Chip>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        {activeFiltersCount > 0 && (
                            <Button
                                size='sm'
                                variant='light'
                                color='danger'
                                startContent={<X className='h-3 w-3' />}
                                onPress={clearFilters}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className='mb-4'>
                    <Input
                        placeholder='Search by house number, street, postal code, or description...'
                        value={filters.search}
                        onValueChange={(value) => handleFilterChange('search', value)}
                        startContent={<Search className='h-4 w-4 text-foreground-400' />}
                        variant='bordered'
                        size='sm'
                        classNames={{
                            input: 'text-sm',
                            inputWrapper: 'bg-content2/50'
                        }}
                    />
                </div>

                {/* Active Filters Summary */}
                {activeFiltersCount > 0 && (
                    <div className='pt-4 border-t border-divider/50'>
                        <div className='flex flex-wrap gap-2'>
                            {Object.entries(filters).map(([key, value]) => {
                                if (value === '') return null;

                                return (
                                    <Chip
                                        key={key}
                                        size='sm'
                                        variant='flat'
                                        color='primary'
                                        onClose={() => handleFilterChange(key as keyof FilterState, '')}
                                    >
                                        {value}
                                    </Chip>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
