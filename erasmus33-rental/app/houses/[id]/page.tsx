"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

import { supabase } from "@/lib/supabase";
import { House } from "@/interfaces/house";

export default function HouseViewPage() {
  const router = useRouter();

  const [house, setHouse] = useState<House | null>(null);
  const [imageDisplay, setImageDisplay] = useState<string>("");

  const params = useParams();
  const id = params?.id;

  // Fetch house data from Supabase
  useEffect(() => {
    if (!id) return;
    const fetchHouse = async () => {
      const { data, error } = await supabase
        .from("houses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching house:", error);
      } else {
        setHouse(data);
        setImageDisplay(data?.images[0] ?? "");
      }
    };

    fetchHouse();
  }, [id]);

  if (!house) return <div>Loading...</div>;

  return (
    <div className="mx-auto pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">House {house.number}</h1>
        <Button variant="bordered" onPress={() => router.push("/houses")}>
          Back to Houses
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="py-4">
            <div className="w-full aspect-w-16 aspect-h-9">
              <Image className="object-cover rounded px-4" src={imageDisplay} />
            </div>
            {house.images?.length > 0 && (
              <CardFooter className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                {house.images.map((image, index) => (
                  <Card
                    key={(house.id ?? "unknown") + index}
                    isHoverable
                    isPressable
                    className="p-2"
                    onPress={() => setImageDisplay(image)}
                  >
                    <Image
                      width={160}
                      height={90}
                      alt={`House ${index}`}
                      className="w-full h-auto object-cover rounded"
                      src={image}
                    />
                  </Card>
                ))}
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div>
              <p className="text-lg font-semibold">Description</p>
              <p className="px-4">{house.description}</p>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-lg font-semibold">Address</p>
            <div className="p-2">
              <span className="text-sm font-medium text-gray-700">Street</span>
              <p>{house.street}</p>
            </div>
            <div className="p-2">
              <span className="text-sm font-medium text-gray-700">Number</span>
              <p>{house.number}</p>
            </div>
            <div className="p-2">
              <span className="text-sm font-medium text-gray-700">
                Postal Code
              </span>
              <p>{house.postal_code}</p>
            </div>
          </Card>

          <div className="flex flex-col space-y-2">
            {house.google_maps && (
              <Button
                variant="bordered"
                onPress={() => window.open(house.google_maps, "_blank")}
              >
                Open on Maps
              </Button>
            )}
            {house.street_view && (
              <Button
                variant="bordered"
                onPress={() => window.open(house.street_view, "_blank")}
              >
                Open on Street View
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
