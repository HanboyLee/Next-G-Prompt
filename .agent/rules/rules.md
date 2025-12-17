---
trigger: always_on
---

# Antigravity AI Rules for next-g-prompt

You are an expert software architect working on `next-g-prompt`, a professional-grade prompt generation tool.

## Project Context
- **Name:** next-g-prompt
- **Description:** nano-banana Pro Prompt Generator
- **Stack:**
  - **Framework:** Next.js (App Router)
  - **Styles:** Tailwind CSS + shadcn/ui
  - **State:** Zustand
  - **Auth:** NextAuth.js
  - **Data:** SWR + Prisma
  - **Language:** TypeScript

## Code Generation Rules

### 1. Project Structure
- **App Router:** All routes go in `app/`. Use `(groups)` for layout isolation.
- **Components:**
  - `components/ui`: Shadcn primitives (treat as read-only library code unless customizing).
  - `components/dashboard`: Feature-specific components.
  - `components/shared`: Reusable components across features.
- **Lib:**
  - `lib/db.ts`: Prisma singleton.
  - `lib/utils.ts`: Helper functions (must include `cn`).
  - `lib/validations`: Zod schemas for forms and API validation.
- **Store:** Global client state in `store/` using Zustand.

### 2. Code Style
- **Formatting:** Use Prettier defaults. 2 spaces indentation. Semicolons on.
- **Naming:**
  - Components: `PascalCase` (e.g., `PromptCard.tsx`).
  - Hooks: `useCamelCase` (e.g., `usePromptStore.ts`).
  - Utils: `camelCase` or `kebab-case`.
- **CSS:**
  - Use Tailwind utility classes.
  - **ALWAYS** use the `cn(...)` utility for conditional classes or merging props.
  - Do not use arbitrary values `w-[123px]` unless absolutely necessary; use theme tokens.

### 3. Component Guidelines
- **Server vs Client:**
  - Default to **Server Components**.
  - Add `"use client"` at the top only when using hooks (`useState`, `useEffect`, custom hooks) or event listeners.
- **Composition:**
  - Keep Client Components leaves of the tree when possible.
  - Pass Server Components as `children` to Client Components to avoid de-optimizing the subtree.
- **Props:**
  - Define interfaces for props, e.g., `interface PromptCardProps`.
  - Avoid `React.FC`; just use `({ prop }: Props) => JSX.Element`.

### 4. Type System
- **Strictness:** `noImplicitAny` is non-negotiable.
- **Inference:**
  - Use Prisma generated types for database models: `import { type Prompt } from "@prisma/client"`.
  - Infer Zod types: `type LoginSchema = z.infer<typeof loginSchema>`.
- **Avoid:** Do not use `any`. Use `unknown` if type is truly ambiguous, then narrow it.

### 5. API & Data Integration
- **Patterns:**
  - Use **Server Actions** for form submissions and mutations where possible.
  - Use **SWR** for client-side polling or revalidation requirements.
  - Use **Route Handlers** (`app/api/`) for external webhooks or strictly RESTful endpoints.
- **Error Handling:**
  - Return typed objects `{ success: boolean, data?: T, error?: string }` from Server Actions.
  - Use `try/catch` in async functions.

### 6. State Management
- **Zustand:**
  - Use for complex client-side global state (e.g., active editor settings, split-pane sizing).
  - Store logic should be testable and separate from UI.
- **URL State:**
  - Prefer URL search params (`useSearchParams`) for shareable state (e.g., filters, search queries).

### 7. Testing Requirements
- **Unit:** Test utilities and state logic (Zustand stores) with Jest/Vitest.
- **Integration:** Test critical user flows (Login -> Create Prompt) using Playwright or strong component testing.
- **Coverage:** Focus on strictly typed business logic over UI snapshot testing.

### 8. Security Guidelines
- **Validation:**
  - **ALWAYS** validate inputs with **Zod** before processing, both on Client (forms) and Server (Actions/API).
- **Auth:**
  - Verify `auth()` session in every Server Action or Route Handler.
  - Use database constraints (Row Level Security logic in Prisma queries) to ensure users can only access their own data.

### 9. Performance Rules
- **Images:** Use `next/image`.
- **Fonts:** Use `next/font` with `variable` strategy.
- **Bundles:**
  - Import heavy libraries (like syntax highlighters) dynamically using `next/dynamic` or `React.lazy`.
  - Avoid barrel files (`index.ts` re-exports) in `components/` if it causes tree-shaking issues.

### 10. Documentation
- **JSDoc:** Add comments to complex logic, specifically "Why" it was done this way.
- **Readme:** Keep `README.md` updated with setup instructions.

## Best Practices
- **Self-Documenting:** Variable names should explain intent (`isPromptLoading` vs `loading`).
- **Simplify:** Don’t over-engineer. Start simple (standard HTML forms) and upgrade to interactive (React Hook Form) as needed.
- **Refactor:** If a component exceeds 200 lines, consider breaking it down.
