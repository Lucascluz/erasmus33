'use server'

import { House } from "@/interfaces/house";
import { uploadImagesToStorage } from "../actions";
import { createClient } from "@/utils/supabase/server";

export async function updateHouse(house: House, newHouseImagesFiles: File[], deletedImageUrls: string[]) {
    const supabase = await createClient();

    // Update images in storage and get URLs
    if (!house.id) {
        throw new Error("House ID is undefined");
    }

    const urls = await uploadImagesToStorage(house.id, newHouseImagesFiles);

    // Update house in database
    const { error: houseError } = await supabase
        .from('houses')
        .update({
            ...house,
            images: [...house.images, ...urls],
        })
        .eq('id', house.id);

    if (houseError) {
        console.error('Error updating house:', houseError);
        throw houseError;
    }

    // Delete deleted images from storage
    let filesToDelete: string[] = [];

    // Loop through the deleted image URLs and extract the file names
    for (const imageUrl of deletedImageUrls) {
        // Extract the file name from the URL
        const filePath = imageUrl.split('/').slice(-2).join('/');
        filesToDelete.push(filePath);
    }

    // Remove the files from storage
    const { error: deleteError } = await supabase.storage
        .from('houses')
        .remove(filesToDelete);

    if (deleteError) {
        console.error('Error deleting image:', deleteError);
    }
}

