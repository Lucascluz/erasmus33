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
				{/* Background with textured paper and subtle overlay */}
				<div
					className='fixed top-0 left-0 w-full h-full z-0'
					style={{
						backgroundImage: "url('/misc/textured-mulberry-paper.jpg')",
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundAttachment: 'fixed',
					}}>
					{/* Subtle overlay for better readability */}
					<div className='w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-gray-900/20'></div>
				</div>

				<main className='min-h-screen flex flex-col relative z-10 w-full'>
					{/* Full width navbar with backdrop blur */}
					<div className='w-full backdrop-blur-sm bg-black/10 sticky top-0 z-20'>
						<Navbar />
					</div>

					{/* Centered page content with improved spacing and backdrop */}
					<div className='flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 flex-1'>
						<div className='w-full max-w-7xl py-8 flex-1 flex flex-col'>
							<div className='flex-1'>
								<Providers>{children}</Providers>
							</div>
						</div>

						{/* Enhanced footer with subtle styling */}
						<footer className='w-full mt-auto py-8'>
							<div className='max-w-7xl mx-auto text-center'>
								<div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10'>
									<p className='text-white/70 text-sm'>
										© 2025 Erasmus33. Experience Guarda like never before.
									</p>
									<div className='flex justify-center items-center mt-2 space-x-4'>
										<span className='text-white/50 text-xs'>Powered by Next.js</span>
										<span className='text-white/30'>•</span>
										<span className='text-white/50 text-xs'>Styled with Tailwind CSS</span>
									</div>
								</div>
							</div>
						</footer>
					</div>
				</main>
			</body>
		</html>
	);
}
