<h1 align="center">🏠 Erasmus33</h1>

<p align="center">
  <strong>Student Housing Platform for Guarda, Portugal</strong>
</p>

<p align="center">
  Connecting Erasmus students with quality housing in Guarda, Portugal
</p>

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/Lucascluz/erasmus33.git
cd erasmus33
pnpm install

# Setup environment (copy .env.example to .env and add your Supabase credentials)
cp .env.example .env

# Run development server
pnpm dev
```

**📖 Need detailed setup instructions?** See [QUICKSTART.md](./docs/QUICKSTART.md)

## ✨ Features

**For Students**
- Browse houses and rooms with image galleries
- Secure authentication with email verification
- Advanced search and filtering
- Responsive design with dark mode

**For Administrators**
- Comprehensive admin dashboard
- Manage houses, rooms, and users
- Image upload and management

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router + Turbopack)
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS + shadcn/ui
- **Package Manager:** pnpm

   Copy the `.env.example` file to `.env` and update the values:

3. **Set up environment variables**

   Copy the `.env.example` file to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Then update the following values in `.env`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   > 📝 Get your Supabase credentials from your [Supabase project dashboard](https://supabase.com/dashboard) under Settings → API

4. **Set up the database**

   Run the SQL migrations in your Supabase project to set up the required tables:
   - `houses` table for property listings
   - `rooms` table for individual rooms
   - `profiles` table for user information
   
   Enable Row Level Security (RLS) policies for each table.


## 📁 Project Structure

```
app/          # Next.js App Router (pages & layouts)
components/   # React components
lib/          # Utilities, types, and Supabase clients
public/       # Static assets (images, logos)
```

## 🌐 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 📚 Documentation

- [Quick Start Guide](./docs/QUICKSTART.md) - 5-minute setup
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - How to contribute
- [Changelog](./docs/CHANGELOG.md) - Version history

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---

<p align="center">Made with ❤️ for Erasmus students in Guarda, Portugal</p>


## 📁 Project Structure

```
app/          # Next.js App Router (pages & layouts)
components/   # React components
lib/          # Utilities, types, and Supabase clients
public/       # Static assets (images, logos)
```

## � Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 📚 Documentation

- [Quick Start Guide](./docs/QUICKSTART.md) - 5-minute setup
- [Contributing Guidelines](./docs/CONTRIBUTING.md) - How to contribute
- [Changelog](./docs/CHANGELOG.md) - Version history

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---

<p align="center">Made with ❤️ for Erasmus students in Guarda, Portugal</p>
