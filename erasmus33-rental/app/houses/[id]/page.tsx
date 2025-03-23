"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { supabase } from "@/lib/supabase";
import { House } from "@/interfaces/house";
import { Image } from "@heroui/image";

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
        setImageDisplay(data?.images[1] ?? "");
      }
    };
    fetchHouse();
  }, [id]);

  if (!house) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          House {house.number}
        </h1>
        <Button onPress={() => router.push("/houses")} variant="bordered">
          Back to Houses
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 justify-between align-center">
            <Image
              className="w-full h-48 object-cover rounded"
              height={480}
              src={imageDisplay}
              width={960}
            />
            {house.images?.length > 0 ? (
              <div className="grid grid-cols-6 gap-3 ">
                {house.images.map((image, index) => (
                  <Card
                    className="p-2 justify-center"
                    isHoverable
                    isPressable
                    onPress={() => setImageDisplay(image)}
                    key={(house.id ?? "unknown") + index}
                  >
                    <Image
                      className="w-full h-auto object-cover rounded"
                      alt={`House ${index}`}
                      src={image}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <p>No images related to this house</p>
            )}
          </div>
          <p>Address</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Street
              </span>
              <p>{house.street}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Number
              </span>
              <p>{house.number}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Postal Code
              </span>
              <p>{house.postal_code}</p>
            </div>
          </div>

          <div>
            <p>{house.description}</p>
          </div>

          <div className="flex justify-between">
            {house.google_maps ? (
              <Button
                onPress={() => window.open(house.google_maps, "_blank")}
                variant="bordered"
              >
                Open on Maps
              </Button>
            ) : null}
            {house.street_view ? (
              <Button
                onPress={() => window.open(house.street_view, "_blank")}
                variant="bordered"
              >
                Open on Street View
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
