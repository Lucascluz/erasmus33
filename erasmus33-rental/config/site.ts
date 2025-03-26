export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Erasmus 33",
  description:
    "We are the best option for those looking for an incredible stay and experience in the city of Guarda!",
  navItems: [
    {
      label: "Houses",
      href: "/houses",
    },
    {
      label: "Rooms",
      href: "/rooms",
    },
  ],
  navAdminItems: [
    {
      label: "Houses",
      href: "/admin/houses",
    },
    {
      label: "Rooms",
      href: "/admin/rooms",
    },
    {
      label: "Users",
      href: "/admin/users",
    },
  ],

  links: {
    whatsapp: "https://wa.me/351938554599",
  },
};
