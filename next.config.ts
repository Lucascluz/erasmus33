import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// ...existing code...
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'gkpotoixqcjijozesfee.supabase.co',
			},
		],
	},
};

export default nextConfig;
