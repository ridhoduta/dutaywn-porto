# Entity Relationship Diagram (ERD)

## Portfolio Project Management System

ERD ini digunakan untuk mengelola konten project pada website portfolio.
Setiap project memiliki informasi utama dan beberapa informasi detail yang
berhubungan dengan project tersebut.

---

## 1. Entity Relationship Diagram

```mermaid
erDiagram

    PROJECTS ||--o{ PROJECT_PROBLEMS : has
    PROJECTS ||--o{ PROJECT_SOLUTIONS : has
    PROJECTS ||--o{ PROJECT_DESIGNS : contains
    PROJECTS ||--o{ PROJECT_FEATURES : contains
    PROJECTS ||--o{ PROJECT_TESTINGS : tested
    PROJECTS ||--o{ PROJECT_RESULTS : produces
    PROJECTS ||--o{ PROJECT_LEARNINGS : provides

    PROJECTS {
        bigint id PK
        text title
        text slug UK
        text[] description
        text role
        text duration
        text platform
        text team
        text image_url
        text demo_url
        text github_url
        timestamptz created_at
        timestamptz updated_at
    }

    PROJECT_PROBLEMS {
        bigint id PK
        bigint project_id FK
        text title
        text description
        integer sort_order
        timestamptz created_at
    }

    PROJECT_SOLUTIONS {
        bigint id PK
        bigint project_id FK
        text title
        text description
        text icon
        integer sort_order
        timestamptz created_at
    }

    PROJECT_DESIGNS {
        bigint id PK
        bigint project_id FK
        text type
        text title
        text description
        text image_url
        integer sort_order
        timestamptz created_at
    }

    PROJECT_FEATURES {
        bigint id PK
        bigint project_id FK
        text title
        text description
        text image_url
        integer sort_order
        timestamptz created_at
    }

    PROJECT_TESTINGS {
        bigint id PK
        bigint project_id FK
        text test_case
        text expected_result
        text actual_result
        text status
        integer sort_order
        timestamptz created_at
    }

    PROJECT_RESULTS {
        bigint id PK
        bigint project_id FK
        text title
        text description
        text metric_value
        text metric_label
        integer sort_order
        timestamptz created_at
    }

    PROJECT_LEARNINGS {
        bigint id PK
        bigint project_id FK
        text content
        integer sort_order
        timestamptz created_at
    }