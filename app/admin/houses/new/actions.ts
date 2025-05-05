'use server'

import { House } from "@/interfaces/house";
import { uploadImagesToStorage } from "../actions";
import { createClient } from "@/utils/supabase/server";

export async function createHouse(house: House, houseImagesUrls?: string[]) {

    // Update images in storage and get URLs
    if (!house.id) {
        throw new Error("House ID is undefined");
    }

    // Create the house record in the database
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("houses")
        .insert({
            ...house,
            images: houseImagesUrls,
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error creating house:", error);
        throw new Error("Error creating house: " + error.message);
    }
}