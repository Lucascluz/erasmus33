"use server"

import { createClient } from '@/utils/supabase/server';

export async function handleProfileActivation(profileId: string, isActive: boolean) {

  const supabase = await createClient();

  // Update the profile's active status
  return supabase
    .from('profiles')
    .update({ is_active: !isActive })
    .eq('id', profileId);
}