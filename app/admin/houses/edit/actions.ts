'use server'

import { House } from "@/interfaces/house";
import { createClient } from "@/utils/supabase/server";

export async function updateHouse(house: House, newHouseImagesUrls: string[], deletedImageUrls: string[]) {
    const supabase = await createClient();

    // Update images in storage and get URLs
    if (!house.id) {
        throw new Error("House ID is undefined");
    }

    // Update house in database
    const { error: houseError } = await supabase
        .from('houses')
        .update({
            ...house,
            images: house.images.concat(newHouseImagesUrls),
        })
        .eq('id', house.id);

    if (houseError) {
        console.error('Error updating house:', houseError);
        throw houseError;
    }

    // Extract the file paths from the URLs
    if (deletedImageUrls && deletedImageUrls.length > 0) {
        const deletedImagePaths = deletedImageUrls.map((url) => {
            const urlParts = url.split('/');
            return house.id + "/" + urlParts[urlParts.length - 1];
        });

        // Delete deleted images from storage
        const { error: deleteError } = await supabase.storage
            .from('house_images')
            .remove(deletedImagePaths);

        if (deleteError) {
            console.error('Error deleting images:', deleteError);
            throw deleteError;
        }
    }
}

export async function deleteHouse(house: House) {
    const supabase = await createClient();

    // Delete house from database
    const { error: houseError } = await supabase
        .from('houses')
        .delete()
        .eq('id', house.id);

    if (houseError) {
        console.error('Error deleting house:', houseError);
        throw houseError;
    }

    // Extract the file paths from the URLs
    const deletedImagePaths = house.images.map((url) => {
        const urlParts = url.split('/');
        return house.id + "/" + urlParts[urlParts.length - 1];
    });

    // Delete deleted images from storage
    const { error: deleteError } = await supabase.storage
        .from('house_images')
        .remove(deletedImagePaths);

    if (deleteError) {
        console.error('Error deleting images:', deleteError);
        throw deleteError;
    }
}

