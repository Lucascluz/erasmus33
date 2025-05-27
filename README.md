<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

# Erasmus33 Project

This document outlines the technology stack and design techniques employed in the Erasmus33 project.

## Technology Stack

The project is built using a modern, robust, and scalable technology stack:

*   **Framework**: [Next.js](https://nextjs.org/) (using the App Router and Turbopack for development)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Authentication**: [Supabase](https://supabase.io/) (leveraging Supabase for database, authentication, and server-side logic via SSR utilities)
*   **Styling**:
    *   [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
    *   [PostCSS](https://postcss.org/): Used for transforming CSS with JavaScript.
*   **UI Components & Libraries**:
    *   [Radix UI](https://www.radix-ui.com/): For unstyled, accessible UI primitives (Checkbox, Dropdown Menu, Label, Slot).
    *   [Shadcn/ui (Pattern)](https://ui.shadcn.com/): While not explicitly a dependency, the project follows a similar pattern of building custom UI components (see `components/ui/`) using Tailwind CSS and Radix UI primitives.
    *   [Heroicons](https://heroicons.com/): A set of high-quality SVG icons.
    *   [Lucide React](https://lucide.dev/): Another library for beautiful and consistent icons.
*   **State Management & Animations**:
    *   [Framer Motion](https://www.framer.com/motion/): For declarative animations.
*   **Form Handling & Validation**:
    *   [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations): Used for server-side data mutations and form submissions.
    *   [Zod](https://zod.dev/): For schema declaration and validation, ensuring data integrity.
*   **Image Handling**:
    *   [React Image Crop](https://www.npmjs.com/package/react-image-crop): For client-side image cropping functionalities.
*   **Theming**:
    *   [next-themes](https://github.com/pacocoursey/next-themes): For easy implementation of light/dark mode and other theme switching.
*   **Utilities**:
    *   `clsx`: A tiny utility for constructing `className` strings conditionally.
    *   `tailwind-merge`: Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.
    *   `uuid`: For generating unique identifiers.

## Design Techniques & Architectural Patterns

The project incorporates several modern design techniques and architectural patterns to ensure maintainability, scalability, and a good developer experience:

*   **Component-Based Architecture**: The UI is built using a modular approach with reusable React components, organized within the `components/` directory. This includes general UI elements, feature-specific components (e.g., `houses/`, `rooms/`), and administrative components.
*   **Next.js App Router**: Leverages the latest Next.js routing paradigm for defining layouts, pages, and API routes (e.g., `app/auth/callback/route.ts`). This includes:
    *   **Layouts**: Shared UI structures defined in `layout.tsx` files (e.g., `app/layout.tsx`, `app/(auth-pages)/layout.tsx`).
    *   **Route Groups**: Used to organize routes without affecting the URL path (e.g., `(auth-pages)`).
*   **Server Actions**: Utilized for handling form submissions and data mutations directly within server components or through client components, simplifying data flow and reducing the need for separate API endpoints for many operations (see `actions.ts` files).
*   **Separation of Concerns**:
    *   **UI Components**: Focused on presentation.
    *   **Server Actions**: Handle business logic and data manipulation.
    *   **Custom Hooks (`hooks/`)**: Encapsulate reusable stateful logic (e.g., `useHouseForm.ts`, `useRoomForm.ts`).
    *   **Utility Functions (`lib/`, `utils/`)**: Provide common helper functions.
    *   **Type Definitions (`interfaces/`)**: Centralized TypeScript interfaces for data structures.
*   **Authentication & Authorization**:
    *   Robust authentication flow managed by Supabase, including sign-in, sign-up, password reset, and email confirmation.
    *   Clear distinction between public pages, authentication-related pages (`app/(auth-pages)/`), and protected routes (`app/protected/`).
    *   Middleware (`middleware.ts`, `utils/supabase/middleware.ts`) is likely used to protect routes and manage user sessions.
*   **Modular Feature Design**: Features like "houses", "rooms", and "users" are organized into their own directories, often containing their specific actions, components, and pages.
*   **Environment Variable Management**: Includes checks for necessary environment variables (`utils/supabase/check-env-vars.ts`) to ensure the application runs correctly.
*   **Theming Support**: Designed with theme switching capabilities (e.g., light/dark mode) using `next-themes` and a `theme-switcher` component.
*   **Responsive Design**: Implied by the use of Tailwind CSS, which is a mobile-first framework.
*   **Atomic Design Principles (inspired)**: The `components/ui/` directory, containing elements like `button.tsx`, `input.tsx`, `label.tsx`, suggests an approach where small, reusable UI primitives are built and then composed into more complex components.

This combination of technologies and design principles aims to create a high-quality, maintainable, and user-friendly web application.
