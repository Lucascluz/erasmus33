'use server'

import { Room } from "@/interfaces/room";
import { createClient } from "@/utils/supabase/server";

export async function createRoom(room: Room, roomImagesUrls: string[]) {
    const supabase = await createClient();

    // Create room in database
    const { error: roomError } = await supabase
        .from('rooms')
        .insert({
            ...room,
            images: roomImagesUrls,
        });

    if (roomError) {
        console.error('Error creating room:', roomError);
        throw roomError;
    }
}