# Fundamental Layer Documentation

This document explains the core infrastructure of the portfolio system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│              (Components, Pages, UI)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Fundamental Layer (YOU ARE HERE)            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Types     │  │    Hooks     │  │   Actions    │  │
│  │              │  │              │  │              │  │
│  │  portfolio   │  │  useProfile  │  │  getProfile  │  │
│  │  .ts         │  │  useSkills   │  │  getSkills   │  │
│  │              │  │  useProjects │  │  getProjects │  │
│  │              │  │  etc.        │  │  etc.        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Supabase Client Layer                    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  client.ts  │  server.ts  │  auth.ts  │ storage │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                    Supabase Backend                      │
│         (PostgreSQL + Storage + Authentication)          │
└─────────────────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. Types (`src/types/portfolio.ts`)

Complete TypeScript type definitions for all entities in the system.

**Core Types:**
- `Profile` - User profile information
- `Skill` - Technical skills with categories
- `Technology` - Technologies used in projects
- `Project` - Portfolio projects
- `ProjectWithTechnologies` - Project with its technologies joined
- `Certification` - Professional certifications
- `Education` - Educational background

**Utility Types:**
- `ApiResponse<T>` - Standardized API response format
- `PortfolioData` - Complete portfolio data aggregation

### 2. Supabase Client Layer (`src/lib/supabase/`)

#### `client.ts` - Client-side Supabase
```typescript
import { supabaseClient } from "@/lib/supabase/client";
// Use in Client Components only
```

#### `server.ts` - Server-side Supabase
```typescript
import { createClient } from "@/lib/supabase/server";
// Use in Server Components and Server Actions
const supabase = await createClient();
```

#### `auth.ts` - Authentication utilities
```typescript
import { signIn, signOut, getUser, requireAuth } from "@/lib/supabase/auth";

// Sign in
await signIn(email, password);

// Protect admin routes
await requireAuth(); // Redirects if not authenticated

// Get current user
const user = await getUser();
```

#### `storage.ts` - Image storage utilities
```typescript
import { uploadImage, deleteImage, updateImage } from "@/lib/supabase/storage";

// Upload image
const result = await uploadImage(file, "projects", "folder-name");
// Returns: { url, path, error }

// Update image (deletes old, uploads new)
await updateImage(file, oldPath, "profiles");

// Delete image
await deleteImage(path, "certifications");
```

**Storage Buckets:**
- `profiles` → profile-images
- `projects` → project-images
- `certifications` → certification-images

### 3. Server Actions (`src/lib/actions/portfolio.ts`)

Complete CRUD operations for all entities. All functions are Server Actions (`"use server"`).

**Pattern:**
```typescript
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/actions/portfolio";

// All actions return ApiResponse<T>
const { data, error } = await getProjects();

if (error) {
  // Handle error
}
// Use data
```

**Available Actions:**

**Profile:**
- `getProfile()` - Get profile data
- `updateProfile(id, profile)` - Update profile

**Skills:**
- `getSkills()` - Get all skills
- `createSkill(skill)` - Create new skill
- `updateSkill(id, skill)` - Update skill
- `deleteSkill(id)` - Delete skill

**Technologies:**
- `getTechnologies()` - Get all technologies
- `createTechnology(tech)` - Create new technology

**Projects:**
- `getProjects()` - Get all projects with technologies
- `getProjectBySlug(slug)` - Get single project by slug
- `createProject(project, technologyIds)` - Create project with technologies
- `updateProject(id, project, technologyIds)` - Update project
- `deleteProject(id)` - Delete project (cascades to project_technologies)

**Certifications:**
- `getCertifications()` - Get all certifications
- `createCertification(cert)` - Create certification
- `updateCertification(id, cert)` - Update certification
- `deleteCertification(id)` - Delete certification

**Education:**
- `getEducations()` - Get all education entries
- `createEducation(edu)` - Create education entry
- `updateEducation(id, edu)` - Update education
- `deleteEducation(id)` - Delete education

**Aggregator:**
- `getPortfolioData()` - Fetch all portfolio data in one call

### 4. React Hooks (`src/hooks/usePortfolio.ts`)

Client-side hooks with real-time Supabase subscriptions.

**Pattern:**
```typescript
'use client';
import { useProjects } from "@/hooks/usePortfolio";

function ProjectsList() {
  const { projects, loading, error, refetch } = useProjects();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

**Available Hooks:**
- `useProfile()` - Profile data
- `useSkills()` - Skills with real-time updates
- `useTechnologies()` - Technologies with real-time updates
- `useProjects()` - Projects with technologies, real-time updates
- `useCertifications()` - Certifications with real-time updates
- `useEducations()` - Education entries with real-time updates

**All hooks return:**
```typescript
{
  data: T | T[],
  loading: boolean,
  error: string | null,
  refetch: () => void
}
```

## Usage Patterns

### Server Component (Recommended for Public Pages)
```typescript
// app/page.tsx
import { getPortfolioData } from "@/lib/actions/portfolio";

export default async function HomePage() {
  const { data, error } = await getPortfolioData();
  
  if (error || !data) {
    return <div>Error loading portfolio</div>;
  }
  
  return (
    <div>
      <h1>{data.profile?.name}</h1>
      {/* Render portfolio */}
    </div>
  );
}
```

### Client Component with Hooks (Recommended for Admin)
```typescript
// app/admin/projects/page.tsx
'use client';
import { useProjects } from "@/hooks/usePortfolio";
import { deleteProject } from "@/lib/actions/portfolio";

export default function AdminProjects() {
  const { projects, loading, error } = useProjects();
  
  const handleDelete = async (id: number) => {
    const result = await deleteProject(id);
    if (result.error) {
      alert(result.error);
    }
    // Hook automatically refetches via real-time subscription
  };
  
  // Render admin UI
}
```

### Client Component with Server Actions (No Real-time)
```typescript
'use client';
import { getProjects, createProject } from "@/lib/actions/portfolio";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    getProjects().then(({ data }) => {
      if (data) setProjects(data);
    });
  }, []);
  
  const handleCreate = async (formData) => {
    const result = await createProject(formData, technologyIds);
    if (!result.error) {
      // Refetch manually
      const { data } = await getProjects();
      if (data) setProjects(data);
    }
  };
}
```

## Environment Setup

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Get your Supabase credentials from https://app.supabase.com/project/_/settings/api

3. Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Database Setup

The fundamental layer expects these Supabase tables to exist:

- `profiles` - User profile
- `skills` - Technical skills
- `technologies` - Technology stack
- `projects` - Portfolio projects
- `project_technologies` - Many-to-many junction table
- `certifications` - Professional certifications
- `educations` - Educational background

See `ERD-portfolio.md` for complete schema definitions.

## Storage Buckets

Create these buckets in Supabase Storage with public access:

1. `profile-images` - For profile pictures
2. `project-images` - For project screenshots
3. `certification-images` - For certification badges/images

## Best Practices

### When to Use What

**Use Server Components + Server Actions:**
- Public portfolio pages (faster initial load)
- SEO-critical pages
- When real-time updates aren't needed

**Use Client Components + Hooks:**
- Admin panel (needs interactivity)
- When you need real-time updates
- Forms and interactive UI

**Use Client Components + Server Actions:**
- When you need client interactivity but not real-time updates
- Reduces bundle size (hooks include Supabase client)

### Error Handling

Always check for errors in ApiResponse:
```typescript
const { data, error } = await getProjects();

if (error) {
  console.error("Failed to fetch projects:", error);
  // Handle error appropriately
  return;
}

// Safe to use data here
```

### Type Safety

Import types from `@/types/portfolio`:
```typescript
import type { Project, Skill, ApiResponse } from "@/types/portfolio";

const handleSubmit = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  // TypeScript ensures correct shape
};
```

## Next Steps

With the fundamental layer complete, you can now:

1. Build UI components in `src/components/`
2. Create public portfolio pages in `src/app/(public)/`
3. Build admin panel in `src/app/admin/`
4. Add authentication middleware
5. Create form components using Server Actions

## Troubleshooting

**"Missing Supabase environment variables"**
- Ensure `.env.local` exists and has correct values
- Restart dev server after adding env vars

**"Invalid API key"**
- Double-check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Supabase dashboard
- Make sure you're using the anon/public key, not the service_role key

**"Table does not exist"**
- Run database migrations in Supabase
- Verify table names match exactly (case-sensitive)

**Real-time subscriptions not working**
- Ensure Realtime is enabled in Supabase for the tables
- Check browser console for Supabase connection errors
