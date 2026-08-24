# Plan Sesi: Implementasi Full-Stack Detail Project

**Tujuan:** Implementasi lengkap untuk 7 child entity project (PROJECT_PROBLEMS, PROJECT_SOLUTIONS, PROJECT_DESIGNS, PROJECT_FEATURES, PROJECT_TESTINGS, PROJECT_RESULTS, PROJECT_LEARNINGS) — dari database, server actions, React hooks, sampai UI admin.

---

## ✅ 1. Server Actions (Task 3)

File: `src/lib/actions/portfolio.ts`

- 8 read actions: `getProjectProblems` s/d `getProjectLearnings` + `getProjectWithDetails`
- 7× create, update, delete, reorder actions (35+ total)
- Validasi required fields di semua create actions
- Reorder atomic & ownership-check via RPC `reorder_project_child_entities`
  - Migration: `supabase/migrations/20260817120000_create_project_child_reorder_rpc.sql`
- `getProjectWithDetails` — 1 call fetch project + technologies + semua child entities

## ✅ 2. React Hooks (Task 4)

File: `src/hooks/usePortfolio.ts`

- 8 read hooks (`useProjectProblems`, ..., `useProjectWithDetails`) — Supabase realtime subscription + `refetch`
- 21 mutation hooks (create/update/delete × 7) — dukung `onSuccess`/`onError` callback
- 7 reorder hooks (`useReorderProjectProblems`, ...)

## ✅ 3. UI Admin Projects

File: `src/app/admin/projects/ProjectsClient.tsx`

- Integrasi awal detail entities (JSON textarea)
- Modal form scrollable
- Field ERD baru: `role`, `duration`, `platform`, `team`
- Type `Project` diperbarui di `src/types/portfolio.ts` (field optional agar backward-compatible)

## ✅ 4. Dynamic Form Builder — Komponen (Selesai)

### 4.1. `src/components/admin/EntityListEditor.tsx`

Komponen generic untuk semua entity type:
- **Accordion** per section (buka/tutup)
- **List item** dengan header: nomor, tombol ↑↓ (reorder), Edit, Delete
- **Edit mode**: render field dinamis (text / textarea / select) + validasi required
- **Preview mode**: tampilkan field pertama + kedua (title + description)
- **Add button** untuk item baru (auto `sort_order`)

### 4.2. `src/app/admin/projects/entityConfigs.ts`

Konfigurasi 7 entity:

| Entity | Icon | Field |
|--------|------|-------|
| Problems | ⚠️ | title*, description* |
| Solutions | 💡 | title*, description*, icon |
| Designs | 🎨 | type* (select: wireframe/mockup/prototype/uml/flowchart), title*, description*, image_url* |
| Features | ⭐ | title*, description*, image_url |
| Testings | 🧪 | test_case*, expected_result*, actual_result*, status* (select: passed/failed/pending/skipped) |
| Results | 📊 | title*, description* |
| Learnings | 📚 | content* |

## ✅ 5. Integrasi Dynamic Form Builder (Selesai)

Implementasi di `src/app/admin/projects/ProjectsClient.tsx`:

1. **State `detailDrafts`**
   - Berubah menjadi: `Record<SectionKey, EntityItem[]>` (struktur data)

2. **`useEffect`** — set data hasil `getProjectWithDetails` ke array of objects

3. **`handleOpenForm` / `handleCloseForm`** — isi/reset state dengan struktur array kosong / data baru

4. **`saveDetails`** — iterasi array structured data dan apply `sort_order`

5. **UI JSON textarea diganti** → render 7 `<EntityListEditor config={entityConfigs[key]} items={detailDrafts[key] || []} onChange={...} />`

6. **Verifikasi** — `npx tsc --noEmit` & `eslint` lolos tanpa error

## Checklist Status

| # | Task | Status |
|---|------|--------|
| 1 | Server Actions (read/create/update/delete/reorder) | ✅ |
| 2 | React Hooks (read/mutation/reorder) | ✅ |
| 3 | UI Admin basic + field ERD + modal scroll | ✅ |
| 4.1 | Komponen EntityListEditor | ✅ |
| 4.2 | Konfigurasi entityConfigs | ✅ |
| 5.1 | Refactor state detailDrafts → structured | ✅ |
| 5.2 | Update effect/handlers/saveDetails | ✅ |
| 5.3 | Replace UI JSON → EntityListEditor | ✅ |
| 5.4 | Verifikasi typecheck & lint | ✅ |
