import '@/styles/globals.css';
import { Providers } from './providers';
import Navbar from '@/components/navbar/navbar';
import { Metadata } from 'next';
import { images } from '@/assets/images';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';

export const metadata: Metadata = {
	title: {
		default: 'Erasmus33',
		template: `%s - Erasmus33`,
	},
	description:
		'Erasmus33 is a platform for Erasmus students to find their perfect stay in Guarda',
	icons: {
		icon: images.logo.src,
	},
};

const publicLinks = [
	{ name: 'About', href: '/about' },
	{ name: 'Houses', href: '/protected/houses' },
	{ name: 'Rooms', href: '/protected/rooms' },
];

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className='dark overflow-x-hidden' suppressHydrationWarning>
			<body
				className={clsx(
					'min-h-screen bg-background font-sans antialiased overflow-x-hidden',
					fontSans.variable
				)}>
				<div
					className='fixed top-0 left-0 w-full h-full z-0'
					style={{
						backgroundImage: `url(${images.kathedrale.src})`,
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
					}}>
					<div className='w-full h-full bg-black/60'></div>
				</div>

				<main className='min-h-screen flex flex-col relative z-10 w-full'>
					{/* Full width navbar */}
					<div className='w-full'>
						<Navbar links={publicLinks} />
					</div>

					{/* Centered page content with responsive padding */}
					<div className='flex flex-col items-center w-full px-4 sm:px-6 lg:px-8'>
						<div className='w-full max-w-4xl py-8'>
							<Providers>{children}</Providers>
						</div>
						<footer className='w-full'></footer>
					</div>
				</main>
			</body>
		</html>
	);
}
