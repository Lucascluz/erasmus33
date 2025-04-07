import { signInAction } from './actions';
import { Button, Input } from '@heroui/react';
import Link from 'next/link';

export default async function Login() {
	return (
		<div className='flex flex-col justify-center items-center h-screen'>
			<form className='flex-1 flex flex-col min-w-64 justy'>
				<h1 className='text-2xl font-medium'>Sign in</h1>
				<p className='text-sm text-foreground'>
					Don't have an account?{' '}
					<Link className='text-foreground font-medium underline' href='/sign-up'>
						Sign up
					</Link>
				</p>
				<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
					<label htmlFor='email'>Email</label>
					<Input name='email' placeholder='you@example.com' required />
					<div className='flex justify-between items-center'>
						<label htmlFor='password'>Password</label>
						<Link
							className='text-xs text-foreground underline'
							href='/forgot-password'>
							Forgot Password?
						</Link>
					</div>
					<Input
						type='password'
						name='password'
						placeholder='Your password'
						required
					/>
					<Button color='primary' type={'submit'} formAction={signInAction}>
						Sign in
					</Button>
				</div>
			</form>
		</div>
	);
}
