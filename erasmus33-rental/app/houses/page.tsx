"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@heroui/card";
import Image from "next/image";

import { supabase } from "@/lib/supabase";
import { House } from "@/interfaces/house";

export default function AdminHousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHouses = async (): Promise<void> => {
      const { data, error } = await supabase.from("houses").select("*");

      if (error) {
        console.error("Error fetching houses:", error);
      } else {
        setHouses(data);
      }
      console.log(data);
    };

    fetchHouses();
    console.log(houses);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Houses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {houses.map((house) => (
          <Card
            key={house.id}
            isHoverable
            isPressable
            className="cursor-pointer"
            onPress={() => router.push(`/houses/${house.id}`)}
          >
            <CardHeader>House {house.number}</CardHeader>
            {house.images && house.images.length > 0 ? (
              <Image
                alt={house.street}
                className="w-full h-48 object-cover"
                src={house.images[0]}
                layout="fill"
              />
            ) : (
              <div className="w-full h-48 flex justify-center items-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
