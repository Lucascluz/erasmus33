'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isRegsitered, setIsRegsitered] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const { error: spbError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (spbError) {
			setError(spbError.message);
		} else {
			setIsRegsitered(true);
			router.refresh();
			router.push('/'); // Redirect to home page
		}

		setLoading(false);
	};

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='w-full max-w-md space-y-8 rounded-lg'>
				<h2 className='text-center text-2xl font-bold'>
					{isRegsitered ? 'Sign Up' : 'Sign In'}
				</h2>
				{error && <p className='text-red-500 text-center'>{error}</p>}
				<form className='space-y-4' onSubmit={handleLogin}>
					<div>
						<label className='block text-sm font-medium'>Email</label>
						<div className='relative mt-1'>
							<EnvelopeIcon className='absolute left-3 top-2.5 h-5 w-5' />
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='w-full rounded-md border border-gray-300 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500'
							/>
						</div>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Password
						</label>
						<div className='relative mt-1'>
							<LockClosedIcon className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
							<input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className='w-full rounded-md border border-gray-300 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500'
							/>
						</div>
					</div>
					<button
						type='submit'
						className='w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700'
						disabled={loading}>
						{loading ? 'Processing...' : isRegsitered ? 'Sign Up' : 'Sign In'}
					</button>
				</form>
				<p className='text-center text-sm text-gray-600'>
					{isRegsitered ? 'Already have an account?' : "Don't have an account?"}{' '}
					<button
						onClick={() => setIsRegsitered(!isRegsitered)}
						className='font-medium text-indigo-600 hover:underline'>
						<p>Sign Up</p>
					</button>
				</p>
			</div>
		</div>
	);
}
