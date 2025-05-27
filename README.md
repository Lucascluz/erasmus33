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
