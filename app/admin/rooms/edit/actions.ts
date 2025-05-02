'use server'

import { Room } from "@/interfaces/room";
import { uploadImagesToStorage } from "../actions";
import { createClient } from "@/utils/supabase/server";

export async function updateRoom(room: Room, newRoomImagesFiles: File[], deletedImageUrls: string[]) {
    const supabase = await createClient();

    // Update images in storage and get URLs
    if (!room.id) {
        throw new Error("Room ID is undefined");
    }
    const urls = await uploadImagesToStorage(room.id, newRoomImagesFiles);

    // Update room in database
    const { error: roomError } = await supabase
        .from('rooms')
        .update({
            ...room,
            images: [...room.images, ...urls],
        })
        .eq('id', room.id);

    if (roomError) {
        console.error('Error updating room:', roomError);
        throw roomError;
    }

    // Delete deleted images from storage
    for (const imageUrl of deletedImageUrls) {
        const { error: deleteError } = await supabase.storage
            .from('rooms')
            .remove([imageUrl]);

        if (deleteError) {
            console.error('Error deleting image:', deleteError);
        }
    }
}

