# Requirements: Portfolio Schema Expansion (Fundamental Layer)

## Overview

Expand the portfolio project schema from a simple flat structure to a comprehensive multi-layered documentation system. This enables detailed project storytelling through problems, solutions, designs, features, testing, results, and learnings — all backed by database, types, actions, and hooks.

## Functional Requirements

### F1: Entity Data Model
- **F1.1**: System shall support 7 child entity types linked to projects: PROJECT_PROBLEMS, PROJECT_SOLUTIONS, PROJECT_DESIGNS, PROJECT_FEATURES, PROJECT_TESTINGS, PROJECT_RESULTS, PROJECT_LEARNINGS
- **F1.2**: Each child entity shall store a project_id linking it to a parent project with CASCADE DELETE
- **F1.3**: All child entities shall support sort_order (0-N integer) for manual display ordering
- **F1.4**: All entities shall include created_at (immutable) and updated_at (auto-trigger on modification) timestamps
- **F1.5**: Each entity shall support full CRUD operations (create, read, update, delete)

### F2: Data Integrity & Relationships
- **F2.1**: Foreign key constraints shall prevent orphaned child records (CASCADE DELETE from projects)
- **F2.2**: All child entity records shall belong to exactly one project (referential integrity)
- **F2.3**: Deleting a project shall automatically cascade-delete all associated child entities without explicit calls
- **F2.4**: Updating a project shall NOT affect child entities (no cascading updates)

### F3: Ordering & Sequencing
- **F3.1**: Child entities within a project shall be orderable via sort_order field without data restructuring
- **F3.2**: Queries fetching child entities shall support ORDER BY sort_order to return records in user-defined sequence
- **F3.3**: Batch reordering operations shall update multiple sort_order values atomically in a single transaction

### F4: Type Safety
- **F4.1**: All entities shall have strict TypeScript type definitions with all required and optional fields
- **F4.2**: ProjectDesign.type shall support predefined values (wireframe, mockup, prototype, uml, flowchart, or string)
- **F4.3**: ProjectTesting.status shall support predefined values (passed, failed, pending, skipped)
- **F4.4**: All server actions shall return ApiResponse<T> with data and error fields
- **F4.5**: All React hooks shall provide loading and error states alongside data

### F5: Server-Side Operations
- **F5.1**: Read operations (getProjectXXX) shall fetch child entities ordered by sort_order
- **F5.2**: Create operations (createProjectXXX) shall validate required fields and return created record
- **F5.3**: Update operations (updateProjectXXX) shall support partial updates with automatic updated_at trigger
- **F5.4**: Delete operations (deleteProjectXXX) shall remove single records atomically
- **F5.5**: Reorder operations (reorderProjectXXX) shall batch-update sort_order values in a transaction
- **F5.6**: getProjectWithDetails(projectId) shall fetch all child entities for a project in a single optimized query

### F6: Client-Side Data Management
- **F6.1**: React hooks shall fetch data on component mount via useEffect
- **F6.2**: React hooks shall provide loading, error, and data states
- **F6.3**: React hooks shall support Supabase real-time subscriptions for live updates
- **F6.4**: Mutation hooks shall call server actions and handle success/error responses
- **F6.5**: All hooks shall include a refetch method to manually trigger data refresh
- **F6.6**: All hooks shall clean up subscriptions on unmount to prevent memory leaks

### F7: Error Handling
- **F7.1**: All server actions shall catch errors and return ApiResponse with error message
- **F7.2**: All React hooks shall expose error state that can be displayed in UI
- **F7.3**: Network errors and database errors shall be gracefully handled with descriptive messages
- **F7.4**: Validation errors (missing required fields) shall be caught and returned with clear feedback

## Non-Functional Requirements

### NF1: Performance
- **NF1.1**: getProjectWithDetails(projectId) shall execute in a single database query (no N+1 queries)
- **NF1.2**: Queries fetching child entities shall use indexes on (project_id, sort_order) for O(1) lookup
- **NF1.3**: Batch reorder operations shall complete within one database transaction (atomicity)

### NF2: Database Design
- **NF2.1**: All child entity tables shall have created_at and updated_at indexes for sorting/filtering
- **NF2.2**: All child entity tables shall have project_id indexes for efficient parent lookup
- **NF2.3**: All tables shall have composite index (project_id, sort_order) for ordered queries
- **NF2.4**: Database shall support idempotent migrations (safe to run multiple times)

### NF3: Code Quality
- **NF3.1**: All TypeScript types shall compile without errors or warnings
- **NF3.2**: All server actions shall follow existing portfolio.ts patterns (error handling, response format)
- **NF3.3**: All React hooks shall follow existing usePortfolio.ts patterns (real-time subscriptions, refetch)
- **NF3.4**: Code shall be DRY (no duplicated logic across similar entity handlers)

### NF4: Security
- **NF4.1**: Row-level security (RLS) policies shall allow public SELECT on all child entity tables
- **NF4.2**: RLS policies shall restrict INSERT/UPDATE/DELETE to authenticated users only
- **NF4.3**: All server actions shall validate that users can only modify data for their own projects
- **NF4.4**: Database schema shall prevent direct manipulation of created_at/updated_at columns

### NF5: Maintainability
- **NF5.1**: Type definitions shall be co-located in src/types/portfolio.ts with existing types
- **NF5.2**: Server actions shall be co-located in src/lib/actions/portfolio.ts with existing actions
- **NF5.3**: React hooks shall be co-located in src/hooks/usePortfolio.ts with existing hooks
- **NF5.4**: All new code shall follow naming conventions: useXxxEntity, getXxxEntity, createXxxEntity, etc.

## Constraints & Dependencies

### C1: Database Layer
- Must use Supabase PostgreSQL
- All migrations must be placed in `supabase/migrations/` with timestamp naming
- No direct SQL execution outside of migrations
- All operations must use Supabase client via createClient() or supabaseClient

### C2: Type System
- Must use TypeScript strict mode
- All types must be exported from src/types/portfolio.ts
- No `any` types allowed in new code
- All ApiResponse returns must follow existing pattern

### C3: Server Actions
- All CRUD operations must be server actions ("use server")
- All actions must follow existing error handling in portfolio.ts
- All actions must return ApiResponse<T>
- No client-side database operations

### C4: React Hooks
- All hooks must use "use client" directive
- All hooks must handle Supabase subscriptions
- All hooks must clean up subscriptions on unmount
- No direct server action calls in render logic (must be in hooks)

### C5: Frontend
- No UI components shall be built in this phase
- All hooks and actions must be backend-only implementation
- Frontend will be built in Phase 5 (future)

## Success Criteria

1. **All 7 child entity tables exist in Supabase** with correct schema, indexes, RLS policies
2. **All 8 TypeScript types are defined and exported** (7 entity types + ProjectWithDetails)
3. **All 30+ server actions are implemented** (Read, Create, Update, Delete, Reorder)
4. **All 30+ React hooks are implemented** (Read hooks, Mutation hooks, Reorder hooks)
5. **Zero TypeScript compilation errors**
6. **All CRUD operations have error handling** returning ApiResponse format
7. **All hooks support real-time subscriptions and manual refetch**
8. **Database migrations are idempotent and reversible**

