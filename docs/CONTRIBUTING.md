# Contributing to Erasmus33

Thank you for your interest in contributing to Erasmus33! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/erasmus33.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Follow the existing code style and conventions
- Use TypeScript for all new files
- Write meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic

### Naming Conventions

- **Components**: PascalCase (e.g., `HouseCard.tsx`)
- **Files**: kebab-case (e.g., `house-details.tsx`)
- **Functions**: camelCase (e.g., `fetchHouses`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
}

// 3. Component
export function Component({ title }: ComponentProps) {
  // 4. State and hooks
  const [state, setState] = useState();

  // 5. Functions
  const handleClick = () => {
    // ...
  };

  // 6. Return JSX
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Commit Messages

Follow the conventional commits specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add search filter for available rooms`

## Pull Request Process

1. **Update Documentation**: If you add new features, update the README.md
2. **Test Your Changes**: Ensure your code works as expected
3. **Follow Code Style**: Run `pnpm lint` before submitting
4. **Describe Your Changes**: Provide a clear description in the PR
5. **Link Issues**: Reference any related issues in your PR description

## What to Contribute

### Ideas for Contributions

- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **New Features**: Add new functionality
- 📝 **Documentation**: Improve or add documentation
- 🎨 **UI/UX**: Enhance the user interface
- ♿ **Accessibility**: Improve accessibility features
- 🌍 **Internationalization**: Add language support
- ⚡ **Performance**: Optimize existing code
- 🧪 **Tests**: Add or improve test coverage

### What NOT to Contribute

- Breaking changes without discussion
- Changes to business logic without approval
- Unrelated features or scope creep
- Code that violates our guidelines

## Questions?

If you have questions or need help, feel free to:
- Open an issue for discussion
- Reach out to the maintainers

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Keep discussions professional

Thank you for contributing to Erasmus33! 🎉
