'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

export default function AuthPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAuth = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const { error } = isSignUp
			? await supabase.auth.signUp({ email, password })
			: await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			setError(error.message);
		} else {
			alert('Check your email for verification!');
		}

		setLoading(false);
	};

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='w-full max-w-md space-y-8 rounded-lg'>
				<h2 className='text-center text-2xl font-bold'>
					{isSignUp ? 'Sign Up' : 'Sign In'}
				</h2>
				{error && <p className='text-red-500 text-center'>{error}</p>}
				<form className='space-y-4' onSubmit={handleAuth}>
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
						{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
					</button>
				</form>
				<p className='text-center text-sm text-gray-600'>
					{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
					<button
						onClick={() => setIsSignUp(!isSignUp)}
						className='font-medium text-indigo-600 hover:underline'>
						{isSignUp ? 'Sign In' : 'Sign Up'}
					</button>
				</p>
			</div>
		</div>
	);
}
