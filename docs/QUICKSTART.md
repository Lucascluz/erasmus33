# 🚀 Quick Start Guide

Get Erasmus33 up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 20+ installed ([Download](https://nodejs.org/))
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git installed
- [ ] A Supabase account ([Sign up](https://supabase.com/))

## Step-by-Step Setup

### 1️⃣ Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/Lucascluz/erasmus33.git
cd erasmus33

# Install dependencies
pnpm install
```

### 2️⃣ Setup Supabase (2 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the project to be ready
4. Go to **Settings** → **API**
5. Copy your:
   - Project URL
   - Anon/Public key

### 3️⃣ Configure Environment (30 seconds)

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Supabase credentials
# Use your favorite editor (nano, vim, code, etc.)
nano .env
```

Replace the placeholder values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4️⃣ Setup Database (1 minute)

In your Supabase dashboard, go to the **SQL Editor** and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create houses table
CREATE TABLE houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID REFERENCES houses(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL,
  is_available BOOLEAN DEFAULT true,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Add basic policies (adjust as needed)
CREATE POLICY "Public houses are viewable by everyone"
  ON houses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public rooms are viewable by everyone"
  ON rooms FOR SELECT
  USING (is_available = true);
```

### 5️⃣ Run the App (30 seconds)

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

## 🔑 First Steps

1. **Create an account**: Click "Sign Up" and register with your email
2. **Check your email**: Verify your account
3. **Explore**: Browse houses and rooms
4. **Admin access**: Contact the administrator to grant admin privileges

## 🆘 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Supabase connection issues
- Double-check your `.env` variables (no typos!)
- Ensure there are no extra spaces in the values
- Verify your Supabase project is active
- Check that you copied the correct URL and key

### Port 3000 already in use
```bash
# Use a different port
pnpm dev -- -p 3001
```

### TypeScript errors
```bash
# Check for type errors
pnpm type-check
```

## 📚 Next Steps

- [ ] Read the full [README.md](./README.md)
- [ ] Review [CONTRIBUTING.md](./CONTRIBUTING.md) if you want to contribute
- [ ] Customize the theme in `app/globals.css`
- [ ] Add your first house listing (admin required)
- [ ] Configure Supabase Storage for image uploads

## 💡 Pro Tips

- Use the **Theme Switcher** in the navbar for dark mode
- Install recommended VSCode extensions for better DX
- Run `pnpm lint` before committing changes
- Keep your `.env` file secure and never commit it

## 🤝 Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Look for similar issues in the GitHub repository
- Open a new issue with your question

---

**Happy coding! 🚀**
