'use server'

import { Room } from "@/interfaces/room";
import { createClient } from "@/utils/supabase/server";
import { uploadImagesToStorage } from "../actions";

export async function createRoom(room: Room, roomImagesFiles: File[]) {
    const supabase = await createClient();

    // Upload images to storage and get URLs
    if (!room.id) {
        throw new Error("Room ID is undefined");
    }
    const urls = await uploadImagesToStorage(room.id, roomImagesFiles);

    // Create room in database
    const { error: roomError } = await supabase
        .from('rooms')
        .insert({
            ...room,
            images: urls,
        });

    if (roomError) {
        console.error('Error creating room:', roomError);
        throw roomError;
    }
}