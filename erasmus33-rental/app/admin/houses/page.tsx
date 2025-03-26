"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader } from "@heroui/card";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Image } from "@heroui/image";
import { House } from "@/interfaces/house";
import { supabase } from "@/lib/supabase";

export default function HousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHouses = async () => {
      const { data, error } = await supabase.from("houses").select("*");

      if (error) console.error("Error fetching houses:", error);
      else setHouses(data);
      console.log(data);
    };

    fetchHouses();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Houses</h1>
      <Button onPress={() => router.push(`/admin/houses/new`)}>
        New House
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {houses.map((house) => (
          <Card
            key={house.id}
            isHoverable
            isPressable
            isFooterBlurred
            isBlurred
            className="flex flex-col items-center border-none w-full"
            onPress={() => router.push(`/admin/houses/edit/${house.id}`)}
          >
            <CardHeader className="justify-between w-full">
              House {house.number}
              <Button
                as="a"
                className="text-tiny text-white bg-black/20"
                color="default"
                radius="lg"
                size="sm"
                variant="flat"
                onPress={() => router.push(`/houses/${house.id}`)}
              >
                <EyeIcon />
              </Button>
            </CardHeader>
            {house.images ? (
              <Image
                removeWrapper
                alt={house.street}
                className="w-full h-48 object-cover"
                src={house.images[0]}
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
