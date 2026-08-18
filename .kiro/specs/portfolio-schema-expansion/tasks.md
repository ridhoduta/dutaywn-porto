# Implementation Plan: Portfolio Schema Expansion (Fundamental Layer)

**Scope**: Phases 1-4 only — database migrations, TypeScript types, server actions, and React hooks. **No frontend UI implementation.**

## Overview

Implement the complete backend infrastructure for portfolio project details: database schema, type system, server actions, and React hooks for 7 child entity tables.

## Tasks

### Phase 1: Database Migrations

- [x] 1.1. Create Migration File for Child Entity Tables
  - Generate a Supabase migration that creates 7 new child entity tables (PROJECT_PROBLEMS, PROJECT_SOLUTIONS, PROJECT_DESIGNS, PROJECT_FEATURES, PROJECT_TESTINGS, PROJECT_RESULTS, PROJECT_LEARNINGS)
  - Migration file created in `supabase/migrations/` with timestamp
  - All 7 tables created with proper columns, types, and constraints
  - All foreign keys reference `projects.id` with `ON DELETE CASCADE`
  - All tables have `sort_order` INDEX and composite index `(project_id, sort_order)`
  - All tables have `created_at` and `updated_at` columns
  - `updated_at` trigger automatically updates on record modification
  - Row-level security (RLS) policies allow public SELECT and authenticated INSERT/UPDATE/DELETE
  - Migration is idempotent (safe to run multiple times)

- [x] 1.2. Apply Migration to Supabase
  - Execute the migration against the project's Supabase database
  - Migration runs without errors
  - All 7 tables exist in Supabase dashboard with correct schema
  - Foreign key constraints are active
  - Indexes are created and queryable

### Phase 2: TypeScript Type Definitions

- [x] 2.1. Add Entity Types to portfolio.ts
  - Define TypeScript types for all 7 child entities in `src/types/portfolio.ts`
  - All 7 entity types defined (ProjectProblem, ProjectSolution, ProjectDesign, ProjectFeature, ProjectTesting, ProjectResult, ProjectLearning)
  - Each type includes all fields: id, project_id, required fields, optional fields (e.g., icon, image_url), sort_order, created_at, updated_at
  - ProjectDesign.type uses a union type ('wireframe' | 'mockup' | 'prototype' | 'uml' | 'flowchart') or string
  - ProjectTesting.status uses a union type ('passed' | 'failed' | 'pending' | 'skipped')
  - No compilation errors or type conflicts

- [x] 2.2. Create Enriched Project Type
  - Add `ProjectWithDetails` type that combines Project with all child entities
  - ProjectWithDetails type extends Project and includes arrays for each entity: problems, solutions, designs, features, testings, results, learnings
  - All child entity arrays properly typed
  - Type is exported and available for import in actions and hooks

### Phase 3: Server Actions (CRUD Operations)

- [ ] 3.1. Implement Read Actions
  - Create server actions to fetch child entities by project_id
  - `getProjectProblems(projectId)` — returns ProjectProblem[] ordered by sort_order
  - `getProjectSolutions(projectId)` — returns ProjectSolution[] ordered by sort_order
  - `getProjectDesigns(projectId)` — returns ProjectDesign[] ordered by sort_order
  - `getProjectFeatures(projectId)` — returns ProjectFeature[] ordered by sort_order
  - `getProjectTestings(projectId)` — returns ProjectTesting[] ordered by sort_order
  - `getProjectResults(projectId)` — returns ProjectResult[] ordered by sort_order
  - `getProjectLearnings(projectId)` — returns ProjectLearning[] ordered by sort_order
  - `getProjectWithDetails(projectId)` — returns ProjectWithDetails (one call fetching all related data)
  - All actions return `ApiResponse<T>` with data and error fields
  - All actions handle errors gracefully (catch and return error message)

- [ ] 3.2. Implement Create Actions
  - Create server actions to insert new child entity records
  - `createProjectProblem(projectId, data)` — insert ProjectProblem, return created record
  - `createProjectSolution(projectId, data)` — insert ProjectSolution, return created record
  - `createProjectDesign(projectId, data)` — insert ProjectDesign, return created record
  - `createProjectFeature(projectId, data)` — insert ProjectFeature, return created record
  - `createProjectTesting(projectId, data)` — insert ProjectTesting, return created record
  - `createProjectResult(projectId, data)` — insert ProjectResult, return created record
  - `createProjectLearning(projectId, data)` — insert ProjectLearning, return created record
  - All actions validate required fields before insertion
  - sort_order defaults to 0 if not provided
  - All actions return ApiResponse with created record or error
  - All errors are caught and returned as error messages

- [ ] 3.3. Implement Update Actions
  - Create server actions to update existing child entity records
  - `updateProjectProblem(id, data)` — update ProjectProblem record
  - `updateProjectSolution(id, data)` — update ProjectSolution record
  - `updateProjectDesign(id, data)` — update ProjectDesign record
  - `updateProjectFeature(id, data)` — update ProjectFeature record
  - `updateProjectTesting(id, data)` — update ProjectTesting record
  - `updateProjectResult(id, data)` — update ProjectResult record
  - `updateProjectLearning(id, data)` — update ProjectLearning record
  - All actions accept partial data (Partial<T>)
  - updated_at is automatically set by database trigger
  - All actions return ApiResponse with updated record or error
  - All errors are caught and returned as error messages

- [ ] 3.4. Implement Delete Actions
  - Create server actions to delete child entity records
  - `deleteProjectProblem(id)` — delete ProjectProblem record
  - `deleteProjectSolution(id)` — delete ProjectSolution record
  - `deleteProjectDesign(id)` — delete ProjectDesign record
  - `deleteProjectFeature(id)` — delete ProjectFeature record
  - `deleteProjectTesting(id)` — delete ProjectTesting record
  - `deleteProjectResult(id)` — delete ProjectResult record
  - `deleteProjectLearning(id)` — delete ProjectLearning record
  - All actions return ApiResponse<null> on success or error
  - All errors are caught and returned as error messages

- [ ] 3.5. Implement Reorder Actions (Batch Sort Order Updates)
  - Create server actions to batch-update sort_order for multiple records
  - `reorderProjectProblems(projectId, items)` — items is array of {id, sort_order}
  - `reorderProjectSolutions(projectId, items)` — items is array of {id, sort_order}
  - `reorderProjectDesigns(projectId, items)` — items is array of {id, sort_order}
  - `reorderProjectFeatures(projectId, items)` — items is array of {id, sort_order}
  - `reorderProjectTestings(projectId, items)` — items is array of {id, sort_order}
  - `reorderProjectResults(projectId, items)` — items is array of {id, sort_order}
  - `reorderProjectLearnings(projectId, items)` — items is array of {id, sort_order}
  - All actions batch-update multiple records in a single transaction
  - All actions validate projectId ownership before updating
  - All actions return ApiResponse<null> on success or error

### Phase 4: React Hooks for Client-Side Data Management

- [ ] 4.1. Implement Read Hooks (Data Fetching)
  - Create React hooks to fetch and manage child entity data on the client
  - `useProjectProblems(projectId)` — fetches and returns problems, loading, error states
  - `useProjectSolutions(projectId)` — fetches and returns solutions, loading, error states
  - `useProjectDesigns(projectId)` — fetches and returns designs, loading, error states
  - `useProjectFeatures(projectId)` — fetches and returns features, loading, error states
  - `useProjectTestings(projectId)` — fetches and returns testings, loading, error states
  - `useProjectResults(projectId)` — fetches and returns results, loading, error states
  - `useProjectLearnings(projectId)` — fetches and returns learnings, loading, error states
  - `useProjectWithDetails(projectId)` — fetches all child entities in one call
  - All hooks use Supabase real-time subscriptions for live updates
  - All hooks handle errors and show error state
  - All hooks have a refetch method to manually refresh data
  - No compilation errors

- [ ] 4.2. Implement Mutation Hooks (Create/Update/Delete)
  - Create React hooks for CRUD mutations
  - `useCreateProjectProblem()` — mutation hook returning {mutate, loading, error}
  - `useUpdateProjectProblem()` — mutation hook returning {mutate, loading, error}
  - `useDeleteProjectProblem()` — mutation hook returning {mutate, loading, error}
  - Similar hooks for all 7 entities (Solutions, Designs, Features, Testings, Results, Learnings)
  - All mutation hooks call the corresponding server actions
  - All mutation hooks handle success and error responses
  - All mutation hooks include loading state during operation
  - All mutation hooks include optional success/error callbacks
  - No compilation errors

- [ ] 4.3. Implement Reorder Hooks
  - Create React hooks for batch reordering
  - `useReorderProjectProblems()` — mutation hook for reordering problems
  - `useReorderProjectSolutions()` — mutation hook for reordering solutions
  - Similar hooks for all 7 entities
  - All reorder hooks call the corresponding batch reorder server actions
  - All reorder hooks handle array of {id, sort_order} items
  - All reorder hooks return {mutate, loading, error}
  - All reorder hooks include loading state during batch operation
  - No compilation errors

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1.1"],
      "description": "Create migration file"
    },
    {
      "wave": 2,
      "tasks": ["1.2", "2.1"],
      "description": "Apply migration; start types in parallel"
    },
    {
      "wave": 3,
      "tasks": ["2.2"],
      "description": "Create enriched project type"
    },
    {
      "wave": 4,
      "tasks": ["3.1"],
      "description": "Implement read actions"
    },
    {
      "wave": 5,
      "tasks": ["3.2"],
      "description": "Implement create actions"
    },
    {
      "wave": 6,
      "tasks": ["3.3"],
      "description": "Implement update actions"
    },
    {
      "wave": 7,
      "tasks": ["3.4"],
      "description": "Implement delete actions"
    },
    {
      "wave": 8,
      "tasks": ["3.5"],
      "description": "Implement reorder actions"
    },
    {
      "wave": 9,
      "tasks": ["4.1"],
      "description": "Implement read hooks"
    },
    {
      "wave": 10,
      "tasks": ["4.2"],
      "description": "Implement mutation hooks"
    },
    {
      "wave": 11,
      "tasks": ["4.3"],
      "description": "Implement reorder hooks"
    }
  ]
}
```

## Notes

- **Total Tasks**: 13 implementation tasks
- **Deliverables**:
  - 1 Supabase migration file (Phase 1)
  - Updated `src/types/portfolio.ts` with 8 new types (Phase 2)
  - Updated `src/lib/actions/portfolio.ts` with 30+ server actions (Phase 3)
  - Updated `src/hooks/usePortfolio.ts` with 30+ custom hooks (Phase 4)
- **No UI Changes**: Frontend will be built later
- **Testing**: All functions have proper error handling and return types

