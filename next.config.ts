import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'gkpotoixqcjijozesfee.supabase.co',
			},
		],
	},
	experimental: {
		serverActions: {
		  bodySizeLimit: '100mb',
		},
	  },
};

export default nextConfig;
