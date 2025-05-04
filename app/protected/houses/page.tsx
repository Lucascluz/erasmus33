import HouseGallery from "@/components/houses/house-gallery";
import HouseInfoCard from "@/components/houses/house-info-card";
import { House } from "@/interfaces/house";
import { createClient } from "@/utils/supabase/server";
import { Card } from "@heroui/react";

export default async function HousesPage() {

    const supabase = await createClient();

    const { data: houses, error } = await supabase.from('houses').select('*');

    if (error) {
        console.error("Error fetching houses:", error);
        return <div>Error loading houses</div>;
    }

    if (!houses) {
        return <div>No houses available</div>;
    }

    return (
        <>
            <h1 className='text-3xl font-bold mb-6'>Explore Houses</h1>
            {houses.map((house: House) => (
                <Card isBlurred className='mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 p-2' key={house.id}>
                    <div className='lg:col-span-4'>
                        <HouseGallery images={house.images} />
                    </div>
                    <div className='lg:col-span-1'>
                        <HouseInfoCard house={house as House} />
                    </div>
                </Card>
            ))}
        </>
    );
}
