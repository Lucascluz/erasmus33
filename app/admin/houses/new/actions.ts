'use server'

import { House } from "@/interfaces/house";
import { uploadImagesToStorage } from "../actions";
import { createClient } from "@/utils/supabase/server";

export async function createHouse(house: House, houseImagesFiles: File[]) {

    // Upload images to storage and get URLs
    if (!house.id) {
        throw new Error("House ID is required to upload images.");
    }
    const urls = await uploadImagesToStorage(house.id, houseImagesFiles);

    // Create the house record in the database
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("houses")
        .insert({
            ...house,
            images: urls,
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error creating house:", error);
        throw new Error("Error creating house: " + error.message);
    }
}