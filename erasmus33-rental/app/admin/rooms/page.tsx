"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Card, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";

import { Room } from "@/interfaces/room";
import { supabase } from "@/lib/supabase";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) console.error("Error fetching rooms:", error);
      else setRooms(data);
      console.log(data);
    };

    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Rooms</h1>
      <Link href="/admin/rooms/new">
        <Button>Add New Room</Button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            isHoverable
            isPressable
            isFooterBlurred
            isBlurred
            className="flex flex-col items-center border-none w-full"
            onPress={() => router.push(`/admin/rooms/edit/${room.id}`)}
          >
            <CardHeader className="justify-between w-full">
              House {room.number}
              <Button
                as="a"
                className="text-tiny text-white bg-black/20"
                color="default"
                radius="lg"
                size="sm"
                variant="flat"
                onPress={() => router.push(`/rooms/${room.id}`)}
              >
                <EyeIcon />
              </Button>
            </CardHeader>
            {room.images ? (
              <Image
                removeWrapper
                className="w-full h-48 object-cover"
                src={room.images[0]}
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
