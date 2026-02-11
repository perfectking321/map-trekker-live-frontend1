# Contributing to Map Trekker Live

First off, thank you for considering contributing to Map Trekker Live! It's people like you that make this project better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md):
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the proposed feature
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**
   - Ensure all existing tests pass
   - Add new tests for new features
   - Test in multiple browsers if applicable

4. **Commit your changes**
   - Use clear and meaningful commit messages
   - Follow conventional commit format:
     ```
     feat: add new feature
     fix: resolve bug in component
     docs: update README
     style: format code
     refactor: restructure component
     test: add unit tests
     chore: update dependencies
     ```

5. **Push to your fork** and submit a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

6. **In your pull request**:
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun
- Firebase account

### Local Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/map-trekker-live-frontend1.git
   cd map-trekker-live-frontend1
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # React components
│   ├── Auth/       # Authentication components
│   ├── Map/        # Map-related components
│   ├── ui/         # Reusable UI components (shadcn/ui)
│   └── ...
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components (routes)
├── services/       # API and external services
├── types/          # TypeScript type definitions
└── lib/            # Utility functions
```

## Style Guide

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Extract reusable logic into custom hooks

### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design for all screen sizes

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Hooks: `use-kebab-case.ts`
- Types: `kebab-case.ts`

## Testing

- Write unit tests for utility functions
- Write integration tests for critical user flows
- Test across different browsers and devices

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update type definitions when modifying data structures

## Questions?

Feel free to open an issue with the `question` label if you have any questions about contributing!

Thank you for contributing! 🎉
