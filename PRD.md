# next-g-prompt - Product Requirements Document

## Project Overview
**Product Name:** next-g-prompt (nano-banana Pro Prompt Generator)  
**Status:** Draft  
**Version:** 1.0  

next-g-prompt is a web-based, professional-grade prompt generation and management tool designed to streamline the workflow of prompt engineers, developers, and AI enthusiasts. It provides a structured environment to create, test, version, and organize prompts for various Large Language Models (LLMs).

## Project Context
- **Platform:** Web
- **Framework:** Next.js (App Router recommended)
- **Dependencies:**
  - **UI/Components:** shadcn/ui (shadcn-next), tailwind-next (Tailwind CSS)
  - **State Management:** zustand-next (Zustand)
  - **Authentication:** next-auth
  - **Data Fetching:** swr
  - **Database/ORM:** prisma-next (Prisma)

## Document Sections

### 1. Executive Summary
The "nano-banana Pro Prompt Generator" (next-g-prompt) aims to solve the inefficiency of ad-hoc prompt engineering. By creating a dedicated workspace for prompt creation, the platform empowers users to treat prompts as code—with versioning, reusability, and structure.

- **Target Audience:** AI Engineers, Content Creators, Developers integrating LLMs, and Prompt Engineering enthusiasts.
- **Key Value Propositions:** 
  - **Structured Editing:** Move beyond simple text areas with variable injection and predefined structures.
  - **Version Control:** Never lose a "good" prompt iteration.
  - **Optimization:** Tools to refine and expand short prompts into professional-grade instructions.
- **Success Metrics:** User adoption rate, number of saved prompts per user, frequency of library template usage.

### 2. Problem Statement
**Current Pain Points:**
- **Context Switching:** Users draft prompts in Notepad or Slack, losing formatting.
- **Lack of Consistency:** Hard to reproduce results without strict prompt templates.
- **Collaboration Friction:** Sharing prompts often means copy-pasting text without the associated metadata (model parameters, temperature).
- **"Blank Page" Syndrome:** Users often struggle to start writing complex prompts from scratch.

**Market Opportunity:**
As GenAI adoption grows, the need for tooling *around* the models (LLMOps) is exploding. A lightweight, web-based generator fills the gap between a chat interface and a full-blown enterprise evaluation platform.

### 3. Product Scope
**Core Features (MVP):**
- **User Authentication:** Secure login/signup via NextAuth (GitHub/Google).
- **Dashboard:** Overview of recent prompts and collections.
- **Pro Prompt Editor:** 
  - Dynamic variable support (e.g., `{{topic}}`).
  - Real-time character/token estimation (heuristic).
- **Prompt Library:** CRUD operations for prompts.
- **Tags & Categories:** Organize prompts by use-case (e.g., "Coding", "Marketing").

**Out of Scope (Phase 1):**
- Direct API integration with LLM providers (Running the prompt). *Focus is on generation first.*
- Public marketplace/community sharing (planned for Phase 2).
- Native mobile app.

### 4. Technical Requirements
**System Architecture:**
- **Frontend:** Next.js Server Components for layout/data, Client Components for the interactive editor.
- **Database:** PostgreSQL (managed) connected via Prisma ORM.
- **State Management:** Zustand for handling the active prompt editor state (variables, easy undo/redo simulation).
- **Styling:** Tailwind CSS with a custom theme defined in `shadcn/ui` components (Dark/Light mode support).

**Performance Criteria:**
- Dashboard load time < 1.0s.
- Editor interaction latency < 100ms.
- 99.9% Uptime for user data access.

**Security:**
- Role-based access control (RBAC) via NextAuth.
- Input sanitization to prevent XSS (especially in shared templates).
- CSRF protection enabled by default in Next.js.

### 5. Feature Specifications

#### 5.1 Authentication & User Profiles
- **Description:** Allow users to sign up, log in, and manage their profile.
- **User Stories:** "As a user, I want to log in with my credentials so that my work is saved privately."
- **Tech:** NextAuth v5.
- **Priority:** P0

#### 5.2 The Pro Editor
- **Description:** The core workspace. A split-screen or focused view where functionality meets creativity.
- **Components:**
  - **Main Input:** Textarea with syntax highlighting for `{{variables}}`.
  - **Sidebar:** Controls for "Tone", "Format" (Markdown/JSON), and "Role" presets.
  - **Variable Form:** Auto-generated input fields based on detected variables in the prompt text.
- **User Stories:** "As a prompter, I want to define a specific structure (Context -> Task -> Constraints) quickly."
- **Priority:** P0

#### 5.3 Prompt Management (CRUD)
- **Description:** Save, Read, Update, and Delete prompts.
- **Acceptance Criteria:** users can view a list of saved prompts, search by title, and delete old ones.
- **Tech:** Prisma + SWR for instant cache updates on the frontend.
- **Priority:** P1

#### 5.4 "Nano-Banana" Magic Enhancer
- **Description:** A utility that takes a short user input and expands it using a predefined "meta-prompt" logic (simulated or hardcoded templates initially) to make it "Pro".
- **User Stories:** "As a beginner, I want to type 'help me code' and get a detailed expert coding prompt."
- **Priority:** P2

### 6. Non-Functional Requirements
- **Accessibility:** WCAG 2.1 AA Compliance (aria-labels on all editor buttons).
- **Responsiveness:** Fully functional on mobile (stack layouts) and desktop (split layouts).
- **Data Integrity:** Database backups daily; Prisma migrations versioned in git.

### 7. Implementation Plan

**Phase 1: Foundation (Weeks 1-2)**
- Setup Next.js repo with TypeScript.
- Install shadcn/ui, Tailwind, Zod, React Hook Form.
- Configure Prisma with a basic Schema (`User`, `Prompt`, `Collection`).
- Setup NextAuth.

**Phase 2: Core Prompt Engine (Weeks 3-4)**
- Build the Editor UI components.
- Implement Zustand store for editor state.
- Develop variable detection logic (Regex parsing of `{{...}}`).
- Integrate SWR for saving data to the backend API.

**Phase 3: Polish & Launch (Week 5)**
- Add "Magic Enhancer" logic.
- UI/UX Polish (animations, dark mode refinement).
- Deploy to Vercel/Netlify.
- QA Testing.

### 8. Success Metrics
- **Activation:** % of signed-up users who create at least 1 prompt in the first week.
- **Retention:** % of users returning to copy/edit a prompt within 30 days.
- **Efficiency:** Average time spent editing a prompt (tracking if tools help speed up the process).
