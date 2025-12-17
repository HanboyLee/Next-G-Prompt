# Code Style Guidelines for next-g-prompt

## Project Overview
**Product Name:** next-g-prompt (nano-banana Pro Prompt Generator)
**Description:** A professional-grade prompt generation tool.

This document defines the coding standards and style guidelines for `next-g-prompt`, ensuring consistency and maintainability across the codebase.

### Technical Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Auth:** NextAuth.js
- **Data:** SWR + Prisma

## Style Guide Sections

### 1. File Organization

#### Directory Structure
We follow a feature-based and Next.js App Router standard structure.

```
/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route groups for layout isolation
│   ├── api/                # API Routes
│   ├── dashboard/          # Feature routes
│   └── page.tsx
├── components/
│   ├── ui/                 # Shadcn UI primitives (do not modify manually usually)
│   ├── dashboard/          # Feature-specific components
│   └── providers.tsx       # Global providers
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── utils.ts            # Common helpers (cn, etc.)
│   └── validations/        # Zod schemas
├── store/                  # Zustand stores
└── prisma/
    └── schema.prisma
```

#### Naming Conventions for Files
- **Components:** `PascalCase.tsx` (e.g., `PromptEditor.tsx`)
- **Utilities:** `kebab-case.ts` or `camelCase.ts` (e.g., `date-utils.ts`)
- **Pages/Layouts:** Next.js keywords (`page.tsx`, `layout.tsx`, `loading.tsx`)

#### Module Organization
1. **Inputs:** React/Next imports.
2. **External Libraries:** (Lucide, Framer, etc.).
3. **Internal Components:** Absolute imports/aliases.
4. **Utils/Hooks:** Lib helpers and custom hooks.
5. **Types:** Interface/Type imports.

### 2. Code Formatting
We adhere to `Prettier` defaults with specific overrides.

- **Indentation:** 2 spaces.
- **Line Length:** 100 characters (soft limit), 80 for comments.
- **Quotes:** Double quotes `"` for JSX/Strings (Prettier default).
- **Semicolons:** Always use semicolons.
- **Trailing Commas:** ES5 (objects, arrays, functions parameters).

```bash
# .prettierrc
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": false,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 3. Naming Conventions

- **Variables:** `camelCase` (e.g., `isLoading`, `userData`).
- **Booleans:** Prefix with `is`, `has`, `should` (e.g., `isVisible`).
- **Functions:** `camelCase` (e.g., `handleSubmit`, `fetchPrompts`).
- **Components:** `PascalCase` (e.g., `Button`, `UserProfile`).
- **Interfaces/Types:** `PascalCase`. No `I` prefix for interfaces.
- **Constants:** `UPPER_SNAKE_CASE` for environment/global constants.
- **Files:** `PascalCase` for components, `kebab-case` for general files.

### 4. TypeScript Guidelines

- **Strict Mode:** Always on. `noImplicitAny` must be respected.
- **Types vs Interfaces:** Use `interface` for extendable object definitions (props, data models). Use `type` for unions, intersections, and primitives.
- **Explicit Returns:** Define return types for complex functions.
- **Async/Await:** Prefer `async/await` over `.then()`.
- **Null Handling:** Use optional chaining `user?.name` and nullish coalescing `variable ?? default`.

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// Good
type Status = "idle" | "loading" | "success" | "error";
```

### 5. Component Guidelines

- **Functional Components:** Always use Arrow Functions for consistency.
- **Props:** Destructure props in the function signature.
- **Export:** Named exports preferred over default exports for components to ensure better refactoring support.
- **Hooks:** Keep custom logic in `hooks/` if reused.

```tsx
// components/example-component.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExampleProps {
  title: string;
  className?: string;
}

export const ExampleComponent = ({ title, className }: ExampleProps) => {
  const [active, setActive] = useState(false);

  return (
    <div className={cn("p-4", className)}>
      <h1>{title}</h1>
    </div>
  );
};
```

### 6. Documentation Standards

- **JSDoc:** Required for utility functions and complex hooks.
- **Comments:** Explain *why*, not *what*. Code should be self-documenting.
- **TODOs:** Format as `// TODO(username): description`.

```typescript
/**
 * Calculates the estimated token count for a given text.
 * Uses a heuristic of 4 characters per token.
 * 
 * @param text The input prompt text
 * @returns Estimated number of tokens
 */
export const estimateTokens = (text: string): number => { ... }
```

### 7. Testing Standards

- **Unit Tests:** Jest + React Testing Library.
- **Naming:** `Component.test.tsx` or `Component.spec.tsx`.
- **Structure:** Arrange -> Act -> Assert.
- **Mocking:** Mock API calls using internal mock handlers or Jest mocks.

### 8. Performance Guidelines

- **Server Components:** Use Server Components by default. Add `"use client"` only when interactivity (hooks, event listeners) is needed.
- **Images:** Use `next/image` with proper `width`/`height` or `fill`.
- **Zustand:** meaningful selectors to avoid unnecessary re-renders.
  ```typescript
  // Select only what you need
  const prompts = usePromptStore((state) => state.prompts);
  ```
- **SWR:** Use logical keys for caching.

### 9. Security Guidelines

- **Inputs:** Validate ALL user inputs using Zod schemas on the server (Server Actions/APIs).
- **Environment:** Access `process.env` only in server files or via `NEXT_PUBLIC_` for client exposure (use sparsely).
- **Auth:** Protect routes using Middleware or Server-side checks with NextAuth session.

### 10. Development Workflow

- **Branch Naming:** `type/short-description`
  - `feat/add-prompt-editor`
  - `fix/login-error`
  - `chore/update-deps`
- **Commits:** Conventional Commits
  - `feat: add markdown support to editor`
  - `fix: resolve hydration error in navbar`
- **PRs:** Require 1 review and passing CI checks (lint + typecheck).

### 11. Tech-Specific Specifics

#### Tailwind & Shadcn
- Use `cn()` utility for class merging.
- Avoid `@apply` in CSS modules; prefer utility classes in JSX.
- Customize theme in `tailwind.config.ts`.

#### Prisma
- Do not import `PrismaClient` in Client Components.
- Use the singleton pattern in `lib/db.ts` to prevent connection exhaustion in dev (Next.js hot reload).
