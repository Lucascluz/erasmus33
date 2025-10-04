# 📂 Project Organization

## Root Directory Structure

```
erasmus33/
├── 📁 app/              # Application pages and routes
├── 📁 components/       # React components
├── 📁 docs/            # Documentation files
├── 📁 lib/             # Utilities and types
├── 📁 public/          # Static assets
├── 📁 .vscode/         # Editor configuration
│
├── 📄 .env             # Environment variables (not in git)
├── 📄 .env.example     # Environment template
├── 📄 .gitignore       # Git ignore rules
│
├── 📄 package.json     # Dependencies and scripts
├── 📄 tsconfig.json    # TypeScript config
├── 📄 next.config.ts   # Next.js config
├── 📄 tailwind.config.ts  # Tailwind config
├── 📄 eslint.config.mjs   # ESLint config
│
├── 📄 README.md        # Main documentation
└── 📄 LICENSE          # MIT License

docs/
├── QUICKSTART.md       # 5-minute setup guide
├── CONTRIBUTING.md     # Contribution guidelines
├── CHANGELOG.md        # Version history
└── IMPROVEMENTS.md     # Project improvements log
```

## Configuration Files Explained

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler settings |
| `next.config.ts` | Next.js framework configuration |
| `tailwind.config.ts` | Tailwind CSS theme and plugins |
| `eslint.config.mjs` | Code linting rules |
| `postcss.config.mjs` | CSS processing configuration |
| `components.json` | shadcn/ui component configuration |
| `middleware.ts` | Next.js middleware for auth |

## Essential Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Run production server
pnpm lint     # Check code quality
```

## What Was Removed

To reduce clutter, the following were removed:
- ❌ `.prettierrc` - Code formatter config
- ❌ `.prettierignore` - Prettier ignore rules
- ❌ `.editorconfig` - Editor configuration

Documentation moved to `docs/` folder:
- ✅ `CHANGELOG.md`
- ✅ `CONTRIBUTING.md`
- ✅ `QUICKSTART.md`
- ✅ `IMPROVEMENTS.md`

## Philosophy

**Simple is better than complex.**

The project focuses on:
- ✨ Clean root directory
- 📚 Organized documentation
- ⚡ Essential configuration only
- 🎯 Clear file purposes
