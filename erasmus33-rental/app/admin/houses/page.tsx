"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Card, CardFooter, CardHeader } from "@heroui/card";
import { House } from "@/interfaces/house";

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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Houses</h1>
      <Link href="/admin/houses/new">
        <Button>New House</Button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {houses.map((house) => (
          <Card
            isHoverable
            key={house.id}
            onPress={() => router.push(`/admin/houses/edit/${house.id}`)}
            className="cursor-pointer"
          >
            <CardHeader>House {house.number}</CardHeader>
            {house.images.length > 0 ? (
              <img
                src={house.images[0]}
                alt={house.street}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex justify-center items-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <CardFooter>
              <div className="flex justify-between p-3">
                <Button
                  variant="solid"
                  onPress={() => {
                    router.push(`/admin/houses/edit/${house.id}`);
                  }}
                >
                  Edit
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
