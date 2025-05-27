'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signInAction = async (formData: FormData) => {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) {
		return encodedRedirect('error', '/sign-in', error.message);
	}

	// Verify if the user is active
	const { data: user, error: userError } = await supabase
		.from('profiles')
		.select('is_active')
		.eq('email', email)
		.single();
	if (userError || !user?.is_active) {
		return encodedRedirect('error', '/sign-in', 'Your account is not active. If you believe this is an error, please contact support.');
	}

	// Redirect to the protected page after successful sign-in
	if (formData.get('redirect')) {
		const redirectUrl = formData.get('redirect') as string;
		return redirect(
			encodedRedirect('success', redirectUrl, 'Sign-in successful')
		);
	}

	// Default redirect if no specific redirect URL is provided
	return redirect('/protected');
};
