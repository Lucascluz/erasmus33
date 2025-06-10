import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
	// This `try/catch` block is only here for the interactive tutorial.
	// Feel free to remove once you have Supabase connected.
	try {
		// Create an unmodified response
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_ANON!,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value }) =>
							request.cookies.set(name, value)
						);
						response = NextResponse.next({
							request,
						});
						cookiesToSet.forEach(({ name, value, options }) =>
							response.cookies.set(name, value, options)
						);
					},
				},
			}
		);

		// This will refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/server-side/nextjs
		const user = await supabase.auth.getUser();

		// protected routes
		if (request.nextUrl.pathname.startsWith('/protected') && user.error) {
			return NextResponse.redirect(new URL('/sign-in', request.url));
		}

		// admin routes (the role validation occurs in the server component)
		if (request.nextUrl.pathname.startsWith('/admin') && user.error) {
			return NextResponse.redirect(new URL('/sign-in', request.url));
		}

		return response;
	} catch (e) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables or network issues.
		console.error('Supabase middleware error:', e);

		// For protected routes, redirect to sign-in if there's a connection issue
		if (request.nextUrl.pathname.startsWith('/protected')) {
			return NextResponse.redirect(new URL('/sign-in', request.url));
		}

		// For admin routes, redirect to sign-in if there's a connection issue
		if (request.nextUrl.pathname.startsWith('/admin')) {
			return NextResponse.redirect(new URL('/sign-in', request.url));
		}

		// For other routes, allow them to proceed
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
