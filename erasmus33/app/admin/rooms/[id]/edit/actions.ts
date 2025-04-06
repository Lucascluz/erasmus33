export const handleRoomEditAction = async (formData: FormData) => {
    // Lucas vai lidar com update no Supabase/storage
    console.log('Editing room:', Object.fromEntries(formData.entries()));
};