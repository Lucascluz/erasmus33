"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { House } from "@/interfaces/house";

export default function HouseViewPage() {
  const router = useRouter();
  const [house, setHouse] = useState<House | null>(null);
  const params = useParams(); // For App Router
  const id = params?.id; // Get ID from URL

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
      }
    };
    fetchHouse();
  }, [id]);

  if (!house) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">
          Viewing House: {house.number} at {house.street}
        </h1>
        <Button variant="bordered" onPress={() => router.push("/admin/houses")}>
          Back to Houses
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <p>Address</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </label>
              <p id="street">{house.street}</p>
            </div>
            <div>
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-700"
              >
                Number
              </label>
              <p id="number">{house.number}</p>
            </div>
            <div>
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <p id="postal-code">{house.postal_code}</p>
            </div>
          </div>
          <p>Google Maps</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="maps-link"
                className="block text-sm font-medium text-gray-700"
              >
                Maps Link
              </label>
              <p id="maps-link">{house.google_maps}</p>
            </div>
            <div>
              <label
                htmlFor="street-view"
                className="block text-sm font-medium text-gray-700"
              >
                Street View Link
              </label>
              <p id="street-view">{house.street_view}</p>
            </div>
          </div>

          <p>Description</p>
          <div>
            <p>{house.description}</p>
          </div>

          <p>Images</p>
          <div>
            {house.images?.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {house.images.map((image, index) => (
                  <Card
                    key={(house.id ?? "unknown") + index}
                    className="cursor-pointer"
                  >
                    <Image
                      key={index}
                      src={image}
                      alt={`House ${index}`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded"
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <p>No images related to this house</p>
            )}
          </div>
          <div className="flex justify-between">
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
      </Card>
    </div>
  );
}
