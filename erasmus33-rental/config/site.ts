export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'Next.js + HeroUI',
	description: 'Make beautiful websites regardless of your design experience.',
	navItems: [
		{
			label: 'Houses',
			href: '/houses',
		},
		{
			label: 'Rooms',
			href: '/rooms',
		},
		{
			label: 'About us',
			href: '/about',
		},
	],
	
	links: {
		whatsapp: 'https://wa.me/351938554599',
	},
};
