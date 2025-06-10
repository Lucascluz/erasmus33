'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Select, SelectItem, Input, Chip } from '@heroui/react';
import { Filter, X, Search, Home, Users, Bed, Euro, MapPin } from 'lucide-react';
import { Room } from '@/interfaces/room';
import { createClient } from '@/utils/supabase/client';

interface FilterState {
    availability: string;
    house: string;
    roomType: string;
    priceRange: string;
    beds: string;
    search: string;
}

interface RoomsFilterProps {
    onFiltersChange?: (filteredRooms: Room[]) => void;
}

export default function RoomsFilter({ onFiltersChange }: RoomsFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        availability: 'all',
        house: 'all',
        roomType: 'all',
        priceRange: 'all',
        beds: 'all',
        search: ''
    });

    // Use ref to store the latest callback to avoid dependency issues
    const onFiltersChangeRef = useRef(onFiltersChange);
    useEffect(() => {
        onFiltersChangeRef.current = onFiltersChange;
    });

    // Fetch rooms data
    useEffect(() => {
        const fetchRooms = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('rooms')
                .select('*')
                .order('house_number', { ascending: true })
                .order('number', { ascending: true });

            if (data) {
                setRooms(data);
                setFilteredRooms(data);
            }
        };

        fetchRooms();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...rooms];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(room =>
                room.number.toString().includes(filters.search) ||
                room.house_number.toString().includes(filters.search) ||
                room.type.toLowerCase().includes(filters.search.toLowerCase()) ||
                (room.description && room.description.toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        // Availability filter
        if (filters.availability !== 'all') {
            filtered = filtered.filter(room => {
                const isAvailable = room.type === 'single'
                    ? room.is_available
                    : (room.beds - room.renters.length) > 0;

                return filters.availability === 'available' ? isAvailable : !isAvailable;
            });
        }

        // House filter
        if (filters.house !== 'all') {
            filtered = filtered.filter(room => room.house_number.toString() === filters.house);
        }

        // Room type filter
        if (filters.roomType !== 'all') {
            filtered = filtered.filter(room => room.type === filters.roomType);
        }

        // Beds filter
        if (filters.beds !== 'all') {
            filtered = filtered.filter(room => room.beds.toString() === filters.beds);
        }

        // Price range filter
        if (filters.priceRange !== 'all') {
            filtered = filtered.filter(room => {
                const price = room.price;
                switch (filters.priceRange) {
                    case 'under200': return price < 200;
                    case '200-300': return price >= 200 && price <= 300;
                    case '300-400': return price >= 300 && price <= 400;
                    case 'over400': return price > 400;
                    default: return true;
                }
            });
        }

        setFilteredRooms(filtered);
        onFiltersChangeRef.current?.(filtered);
    }, [filters, rooms]);

    // Get unique values for filter options
    const uniqueHouses = [...new Set(rooms.map(room => room.house_number))].sort((a, b) => a - b);
    const uniqueRoomTypes = [...new Set(rooms.map(room => room.type))];
    const uniqueBeds = [...new Set(rooms.map(room => room.beds))].sort((a, b) => a - b);

    // Create options arrays for selects
    const houseOptions = [
        { key: 'all', label: 'All Houses' },
        ...uniqueHouses.map(house => ({ key: house.toString(), label: `House ${house}` }))
    ];

    const roomTypeOptions = [
        { key: 'all', label: 'All Types' },
        ...uniqueRoomTypes.map(type => ({ key: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))
    ];

    const bedOptions = [
        { key: 'all', label: 'Any' },
        ...uniqueBeds.map(beds => ({ key: beds.toString(), label: `${beds} bed${beds > 1 ? 's' : ''}` }))
    ];

    // Handle filter change
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            availability: 'all',
            house: 'all',
            roomType: 'all',
            priceRange: 'all',
            beds: 'all',
            search: ''
        });
    };

    // Count active filters
    const activeFiltersCount = Object.entries(filters).filter(([, value]) =>
        value !== 'all' && value !== ''
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
                            <h3 className='font-semibold text-foreground'>Filters</h3>
                            <p className='text-xs text-foreground-500'>
                                {filteredRooms.length} of {rooms.length} rooms
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
                        <Button
                            size='sm'
                            variant='light'
                            onPress={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? 'Hide' : 'Show'} Filters
                        </Button>
                    </div>
                </div>

                {/* Search Bar - Always Visible */}
                <div className='mb-4'>
                    <Input
                        placeholder='Search rooms, houses, or descriptions...'
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

                {/* Collapsible Filter Options */}
                {isOpen && (
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                            {/* Availability Filter */}
                            <div className='space-y-2'>
                                <label className='text-xs font-medium text-foreground-600 flex items-center gap-1'>
                                    <Users className='h-3 w-3' />
                                    Availability
                                </label>
                                <Select
                                    size='sm'
                                    variant='bordered'
                                    selectedKeys={[filters.availability]}
                                    onSelectionChange={(keys) => handleFilterChange('availability', Array.from(keys)[0] as string)}
                                    classNames={{ trigger: 'bg-content2/50' }}
                                >
                                    <SelectItem key='all'>All Rooms</SelectItem>
                                    <SelectItem key='available'>Available</SelectItem>
                                    <SelectItem key='occupied'>Occupied</SelectItem>
                                </Select>
                            </div>

                            {/* House Filter */}
                            <div className='space-y-2'>
                                <label className='text-xs font-medium text-foreground-600 flex items-center gap-1'>
                                    <MapPin className='h-3 w-3' />
                                    House
                                </label>
                                <Select
                                    size='sm'
                                    variant='bordered'
                                    selectedKeys={[filters.house]}
                                    onSelectionChange={(keys) => handleFilterChange('house', Array.from(keys)[0] as string)}
                                    classNames={{ trigger: 'bg-content2/50' }}
                                >
                                    {houseOptions.map(option => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Room Type Filter */}
                            <div className='space-y-2'>
                                <label className='text-xs font-medium text-foreground-600 flex items-center gap-1'>
                                    <Home className='h-3 w-3' />
                                    Room Type
                                </label>
                                <Select
                                    size='sm'
                                    variant='bordered'
                                    selectedKeys={[filters.roomType]}
                                    onSelectionChange={(keys) => handleFilterChange('roomType', Array.from(keys)[0] as string)}
                                    classNames={{ trigger: 'bg-content2/50' }}
                                >
                                    {roomTypeOptions.map(option => (
                                        <SelectItem key={option.key} className='capitalize'>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Beds Filter */}
                            <div className='space-y-2'>
                                <label className='text-xs font-medium text-foreground-600 flex items-center gap-1'>
                                    <Bed className='h-3 w-3' />
                                    Beds
                                </label>
                                <Select
                                    size='sm'
                                    variant='bordered'
                                    selectedKeys={[filters.beds]}
                                    onSelectionChange={(keys) => handleFilterChange('beds', Array.from(keys)[0] as string)}
                                    classNames={{ trigger: 'bg-content2/50' }}
                                >
                                    {bedOptions.map(option => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Price Range Filter */}
                            <div className='space-y-2'>
                                <label className='text-xs font-medium text-foreground-600 flex items-center gap-1'>
                                    <Euro className='h-3 w-3' />
                                    Price Range
                                </label>
                                <Select
                                    size='sm'
                                    variant='bordered'
                                    selectedKeys={[filters.priceRange]}
                                    onSelectionChange={(keys) => handleFilterChange('priceRange', Array.from(keys)[0] as string)}
                                    classNames={{ trigger: 'bg-content2/50' }}
                                >
                                    <SelectItem key='all'>Any Price</SelectItem>
                                    <SelectItem key='under200'>Under €200</SelectItem>
                                    <SelectItem key='200-300'>€200 - €300</SelectItem>
                                    <SelectItem key='300-400'>€300 - €400</SelectItem>
                                    <SelectItem key='over400'>Over €400</SelectItem>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filters Summary */}
                        {activeFiltersCount > 0 && (
                            <div className='pt-4 border-t border-divider/50'>
                                <div className='flex flex-wrap gap-2'>
                                    {Object.entries(filters).map(([key, value]) => {
                                        if (value === 'all' || value === '') return null;

                                        let displayValue = value;
                                        if (key === 'house') displayValue = `House ${value}`;
                                        else if (key === 'beds') displayValue = `${value} bed${value !== '1' ? 's' : ''}`;
                                        else if (key === 'roomType') displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                                        else if (key === 'priceRange') {
                                            switch (value) {
                                                case 'under200': displayValue = 'Under €200'; break;
                                                case '200-300': displayValue = '€200-€300'; break;
                                                case '300-400': displayValue = '€300-€400'; break;
                                                case 'over400': displayValue = 'Over €400'; break;
                                            }
                                        }

                                        return (
                                            <Chip
                                                key={key}
                                                size='sm'
                                                variant='flat'
                                                color='primary'
                                                onClose={() => handleFilterChange(key as keyof FilterState, key === 'search' ? '' : 'all')}
                                            >
                                                {displayValue}
                                            </Chip>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
