'use server'

import { Room } from "@/interfaces/room";
import { createClient } from "@/utils/supabase/server";

export async function updateRoom(room: Room, newRoomImagesUrls: string[], deletedImageUrls: string[]) {
    const supabase = await createClient();

    // Update room in database
    const { error: roomError } = await supabase
        .from('rooms')
        .update({
            ...room,
            images: [...room.images, ...newRoomImagesUrls],
        })
        .eq('id', room.id);

    if (roomError) {
        console.error('Error updating room:', roomError);
        throw roomError;
    }

    // Delete images from storage if they exist
    if (deletedImageUrls.length > 0) {
        // Extract the file paths from the URLs
        const deletedImagePaths = deletedImageUrls.map((url) => {
            const urlParts = url.split('/');
            return room.id + "/" + urlParts[urlParts.length - 1];
        });

        // Delete deleted images from storage
        const { error: deleteError } = await supabase.storage
            .from('room_images')
            .remove(deletedImagePaths);

        if (deleteError) {
            console.error('Error deleting images:', deleteError);
            throw deleteError;
        }
    }
}

export async function deleteRoom(room: Room) {
    const supabase = await createClient();

    // Delete room from database
    const { error: roomError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', room.id);

    if (roomError) {
        console.error('Error deleting room:', roomError);
        throw roomError;
    }

    // Delete images from storage if they exist
    if (room.images.length > 0) {
        // Extract the file paths from the URLs
        const deletedImagePaths = room.images.map((url) => {
            const urlParts = url.split('/');
            return room.id + "/" + urlParts[urlParts.length - 1];
        });

        // Delete deleted images from storage
        const { error: deleteError } = await supabase.storage
            .from('room_images')
            .remove(deletedImagePaths);

        if (deleteError) {
            console.error('Error deleting images:', deleteError);
            throw deleteError;
        }
    }
}

