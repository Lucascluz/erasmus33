'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { Profile } from '@/interfaces/profile'; // Adjust the import path if needed

export const signUpAction = async (formData: FormData) => {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get('origin');

	if (!email || !password) {
		return encodedRedirect(
			'error',
			'/sign-up',
			'Email and password are required'
		);
	}

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		console.error(error.code + ' ' + error.message);
		return encodedRedirect('error', '/sign-up', error.message);
	}

	const userId = data.user?.id;

	if (!userId) {
		console.error('User ID not found after sign up');
		return encodedRedirect(
			'error',
			'/sign-up',
			'Unexpected error during sign up.'
		);
	}

	// Handle image upload
	let pictureUrl: string | undefined = undefined;
	const profilePicture = formData.get('profile_picture') as File | null;

	if (profilePicture && profilePicture.size > 0) {
		const filePath = `public/${userId}`;
		const { error: uploadError } = await supabase.storage
			.from('profile_pictures')
			.upload(filePath, profilePicture, {
				upsert: true,
			});

		if (uploadError) {
			console.error('Image upload error:', uploadError.message);
			return encodedRedirect(
				'error',
				'/sign-up',
				'Error uploading profile image.'
			);
		}

		const { data: publicUrlData } = supabase.storage
			.from('profile_pictures')
			.getPublicUrl(filePath);

		pictureUrl = publicUrlData.publicUrl;
	}

	// Build and insert profile
	const profile: Profile = {
		user_id: userId,
		email,
		first_name: formData.get('first_name')?.toString() ?? '',
		last_name: formData.get('last_name')?.toString() ?? '',
		phone_number: formData.get('phone_number')?.toString() ?? '',
		picture_url: pictureUrl,
		country: formData.get('country')?.toString() ?? '',
		preferred_language: (formData.get('preferred_language')?.toString() ??
			'en') as 'pt' | 'en',
		role: (formData.get('role')?.toString() ?? 'user') as 'user',
		is_active: false,
	};

	const { error: profileError } = await supabase
		.from('profiles')
		.insert(profile);

	if (profileError) {
		console.error('Profile creation error:', profileError.message);
		return encodedRedirect(
			'error',
			'/sign-up',
			'Account created but failed to save profile.'
		);
	}

	return { success: true };
};
