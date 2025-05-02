import { signInAction } from './actions';
import { Button, Card, Input } from '@heroui/react';
import Link from 'next/link';

export default async function Login() {
	return (
			<Card className="w-full max-w-md p-8 shadow-xl rounded-2xl">
				<form className="flex flex-col gap-6" action={signInAction}>
					<div>
						<h1 className="text-3xl font-semibold text-center mb-1">Sign in</h1>
						<p className="text-sm text-muted-foreground text-center">
							Don't have an account?{' '}
							<Link
								className="text-primary font-medium underline hover:text-primary/80"
								href="/sign-up"
							>
								Sign up
							</Link>
						</p>
					</div>

					<div className="flex flex-col gap-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium mb-1">
								Email
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="you@example.com"
								required
							/>
						</div>

						<div>
							<div className="flex justify-between items-center mb-1">
								<label htmlFor="password" className="text-sm font-medium">
									Password
								</label>
								<Link
									className="text-xs text-muted-foreground underline hover:text-foreground"
									href="/forgot-password"
								>
									Forgot Password?
								</Link>
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Your password"
								required
							/>
						</div>

						<Button color="primary" type="submit" className="mt-4 w-full">
							Sign in
						</Button>
					</div>
				</form>
			</Card>
	);
}
