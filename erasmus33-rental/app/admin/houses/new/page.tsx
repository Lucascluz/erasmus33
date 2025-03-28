"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardFooter } from "@heroui/card";
import { TrashIcon } from "@heroicons/react/24/solid";

import { House } from "@/interfaces/house";
import { supabase } from "@/lib/supabase";
import ImageCropper from "@/components/image-cropper";

interface HouseImage {
  file: File;
  url: string;
}

export default function AdminHouseCreatePage() {
  const router = useRouter();

  // State for house details
  const [house, setHouse] = useState<House>({
    description: "",
    street: "",
    number: "",
    postal_code: "",
    google_maps: "",
    street_view: "",
    total_rooms: 0,
    available_rooms: [],
    images: [],
  });

  // State for new images and loading indicator
  const [newHouseImages, setNewHouseImages] = useState<HouseImage[]>([]);
  const [loading, setLoading] = useState(false);

  // Update UI with new image
  const updateHouseImagesUI = (file: File) => {
    const newUrl = URL.createObjectURL(file);
    setNewHouseImages((prevImages) => [...prevImages, { file, url: newUrl }]);
  };

  // Remove image from UI
  const deleteHouseImageFromUI = (imageUrl: string) => {
    setNewHouseImages((prevImages) =>
      prevImages.filter((image) => image.url !== imageUrl),
    );
  };

  // Handle form submission
  const insertHouseData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const houseId = await createHouseInDatabase();

      if (houseId && newHouseImages.length > 0) {
        await uploadHouseImages(houseId);
      }

      router.push("/admin/houses");
    } catch (error) {
      console.error("Error during house creation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create house in the database
  const createHouseInDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from("houses")
        .insert([
          {
            description: house.description,
            street: house.street,
            number: house.number,
            postal_code: house.postal_code,
            google_maps: house.google_maps,
            street_view: house.street_view,
            total_rooms: house.total_rooms,
            available_rooms: house.total_rooms
              ? new Array(house.total_rooms).fill(true)
              : [],
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      return data?.id || null;
    } catch (error) {
      console.error("Error creating house in database:", error);
      return null;
    }
  };

  // Upload images to storage and update database
  const uploadHouseImages = async (houseId: string) => {
    const uploadedImageUrls: string[] = [];

    try {
      await Promise.all(
        newHouseImages.map(async (image, index) => {
          const filePath = `${houseId}/${index}`; // Unique file path

          const { data: uplData, error: uplError } = await supabase.storage
            .from("house_images")
            .upload(filePath, image.file);

          if (uplError || !uplData) throw uplError;

          const { data: urlData } = supabase.storage
            .from("house_images")
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            uploadedImageUrls.push(urlData.publicUrl);
          }
        }),
      );

      if (uploadedImageUrls.length > 0) {
        const updatedImages = [...house.images, ...uploadedImageUrls]; // Merge images
        const { error } = await supabase
          .from("houses")
          .update({ images: updatedImages })
          .eq("id", houseId);

        if (error) throw error;

        setHouse((prevHouse) => ({ ...prevHouse, images: updatedImages })); // Update state
      }
    } catch (error) {
      console.error("Error uploading house images:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Registering a new house</h1>
        <Button variant="bordered" onPress={() => router.push("/admin/houses")}>
          Back to Houses
        </Button>
      </div>

      <Card className="p-4">
        <form className="space-y-4" onSubmit={insertHouseData}>
          {/* Address Section */}
          <p>Address</p>
          <div className="grid grid-cols-3 gap-4">
            <Input
              required
              label="Street"
              type="text"
              value={house.street}
              onChange={(e) => setHouse({ ...house, street: e.target.value })}
            />
            <Input
              required
              label="Number"
              maxLength={5}
              type="text"
              value={house.number}
              onChange={(e) => setHouse({ ...house, number: e.target.value })}
            />
            <Input
              required
              label="Postal Code"
              maxLength={7}
              type="text"
              value={house.postal_code}
              onChange={(e) =>
                setHouse({ ...house, postal_code: e.target.value })
              }
            />
          </div>

          {/* Google Maps Section */}
          <p>Google maps</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Maps Link"
              type="url"
              value={house.google_maps}
              onChange={(e) =>
                setHouse({ ...house, google_maps: e.target.value })
              }
            />
            <Input
              label="Street View Link"
              type="url"
              value={house.street_view}
              onChange={(e) =>
                setHouse({ ...house, street_view: e.target.value })
              }
            />
          </div>

          {/* Description Section */}
          <p>Description</p>
          <div>
            <Input
              label="Description"
              size="lg"
              type="text"
              value={house.description}
              onChange={(e) =>
                setHouse({ ...house, description: e.target.value })
              }
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex items-center space-x-4">
            <ImageCropper
              aspectRatio="16/9"
              isCircular={false}
              callback={(file) => {
                updateHouseImagesUI(file);
              }}
            />
            <p>Upload New Images</p>
          </div>
          <div>
            {newHouseImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {newHouseImages.map((image, index) => (
                  <Card key={index} className="cursor-pointer">
                    <img
                      alt={`House Image ${index}`}
                      className="w-full h-48 object-cover rounded"
                      src={image.url}
                    />
                    <CardFooter className="flex justify-end">
                      <Button
                        className="h-10"
                        color="danger"
                        variant="solid"
                        onPress={() => deleteHouseImageFromUI(image.url)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex justify-between">
            <Button color="primary" type="submit" variant="solid">
              Confirm Creation
            </Button>

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
        </form>
      </Card>
    </div>
  );
}
