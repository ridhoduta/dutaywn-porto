# Arsitektur Sistem Portfolio

## 1. Gambaran Umum

Website portfolio dibangun menggunakan **Next.js** sebagai framework
utama dan **Supabase** sebagai backend service. Sistem terdiri dari dua
bagian utama:

1.  **Public Portfolio** --- halaman yang dapat diakses oleh pengunjung
    untuk melihat profil, skill, project, sertifikasi, experience,
    education, dan informasi kontak.
2.  **Admin Panel** --- halaman khusus administrator untuk mengelola
    seluruh konten portfolio.

Supabase digunakan untuk menyediakan:

-   PostgreSQL Database untuk menyimpan data portfolio.
-   Storage untuk menyimpan gambar.
-   Authentication untuk mengamankan akses admin.

------------------------------------------------------------------------

## 2. Arsitektur Keseluruhan

``` text
                              INTERNET
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             PUBLIC WEBSITE                ADMIN PANEL
                Next.js                     Next.js
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                              SUPABASE
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       PostgreSQL DB           Storage            Authentication
             │                    │                    │
             │                    │                    │
             ▼                    ▼                    ▼
        Portfolio Data       Portfolio Images      Admin Account
```

------------------------------------------------------------------------

## 3. Teknologi yang Digunakan

  Teknologi             Fungsi
  --------------------- ------------------------------------------------
  Next.js               Framework frontend dan server-side application
  TypeScript            Bahasa pemrograman utama
  Tailwind CSS          Styling dan UI
  Supabase PostgreSQL   Database portfolio
  Supabase Storage      Penyimpanan gambar
  Supabase Auth         Autentikasi administrator
  Vercel                Deployment aplikasi

------------------------------------------------------------------------

## 4. Struktur Sistem

``` text
portfolio/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── projects/
│   │   └── ...
│   │
│   ├── admin/
│       ├── page.tsx
│       ├── profile/
│       ├── skills/
│       ├── projects/
│       ├── certifications/
│       ├── experience/
│       └── education/
│   
│   
│
├── components/
│   ├── public/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Certifications.tsx
│   │   ├── Experience.tsx
│   │   └── Education.tsx
│   │
│   └── admin/
│       ├── Sidebar.tsx
│       ├── ProjectForm.tsx
│       ├── SkillForm.tsx
│       └── ...
├── hooks/
│
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
│
├── types/
│   └── portfolio.ts
│
└── public/
    └── ...
```

------------------------------------------------------------------------

## 5. Modul Public Portfolio

Halaman public menampilkan informasi yang tersimpan di Supabase.

### Section

``` text
Public Portfolio
├── About
│   ├── Skills
│   └── Information 
│
├── Certifications
│   ├── Certificate Image
│   ├── Certificate Name
│   ├── Issuer
│   └── Credential URL
│
├── Projects
│   ├── Project Image
│   ├── Title
│   ├── Description
│   ├── Technologies
│   ├── Demo URL
│   └── GitHub URL
├── Education
│
└── Contact
```

------------------------------------------------------------------------

## 6. Modul Admin Panel

Admin panel digunakan untuk mengelola konten portfolio.

``` text
Admin Panel
│
├── Dashboard
│
├── Profile
│   ├── View
│   └── Edit
│
├── Skills
│   ├── List
│   ├── Add
│   ├── Edit
│   └── Delete
│
├── Projects
│   ├── List
│   ├── Add
│   ├── Edit
│   ├── Delete
│   └── Upload Image
│
├── Certifications
│   ├── List
│   ├── Add
│   ├── Edit
│   ├── Delete
│   └── Upload Certificate
│
└── Education
    ├── List
    ├── Add
    ├── Edit
    └── Delete
```

------------------------------------------------------------------------

## 7. Arsitektur Database

Database menggunakan **Supabase PostgreSQL**.

Tabel utama:

``` text
profiles
skills
projects
project_technologies
certifications
experiences
educations
```

### Relasi Sederhana

``` text
                    projects
                       │
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
      project_technologies   Storage
              │
              ▼
        technologies
```

Untuk data sederhana, beberapa teknologi dapat disimpan sebagai array
atau JSON. Jika kebutuhan relasi berkembang, tabel `technologies` dan
`project_technologies` dapat digunakan untuk membuat relasi
many-to-many.

------------------------------------------------------------------------

## 8. Struktur Storage

Supabase Storage digunakan untuk menyimpan file gambar.

``` text
Storage
└── portfolio/
    │
    ├── profile/
    │   └── profile.webp
    │
    ├── projects/
    │   ├── raih-prestasi.webp
    │   ├── kasir-umkm.webp
    │   └── smart-locker.webp
    │
    └── certifications/
        ├── certificate-01.webp
        ├── certificate-02.webp
        └── certificate-03.webp
```

Database tidak menyimpan file gambar secara langsung. Database hanya
menyimpan URL atau path file.

Contoh:

``` json
{
  "title": "Raih Prestasi",
  "description": "Sistem informasi prestasi siswa.",
  "image_url": "https://project.supabase.co/storage/v1/object/public/portfolio/projects/raih-prestasi.webp"
}
```

------------------------------------------------------------------------

## 9. Flow Upload Gambar

Ketika admin menambahkan project:

``` text
Admin
  │
  │ Pilih gambar
  ▼
Next.js Admin Panel
  │
  │ upload()
  ▼
Supabase Storage
  │
  │ menghasilkan path / URL
  ▼
Next.js
  │
  │ simpan image_url
  ▼
Supabase PostgreSQL
  │
  ▼
Project tersimpan
```

------------------------------------------------------------------------

## 10. Flow Menampilkan Project

``` text
Visitor
   │
   ▼
Next.js Public Website
   │
   │ SELECT projects
   ▼
Supabase PostgreSQL
   │
   │ project data + image_url
   ▼
Next.js
   │
   │ render
   ▼
Project Card
   │
   ▼
Supabase Storage
   │
   ▼
Project Image
```

------------------------------------------------------------------------

## 11. Authentication

Admin panel menggunakan **Supabase Authentication**.

``` text
Admin
  │
  ▼
Login Page
  │
  │ Email + Password
  ▼
Supabase Auth
  │
  ├── Valid
  │     │
  │     ▼
  │   Admin Panel
  │
  └── Invalid
        │
        ▼
    Login Error
```

Halaman admin harus dilindungi sehingga hanya user yang telah
terautentikasi yang dapat mengakses fungsi CRUD.

------------------------------------------------------------------------

## 12. Security

Keamanan sistem menggunakan:

### Supabase Auth

Digunakan untuk autentikasi administrator.

### Row Level Security (RLS)

Digunakan untuk membatasi operasi database.

Contoh konsep:

``` text
Public User
   │
   └── SELECT data public
             │
             ▼
        PostgreSQL

Admin
   │
   ├── SELECT
   ├── INSERT
   ├── UPDATE
   └── DELETE
             │
             ▼
        PostgreSQL
```

### Storage Policies

Storage juga diberikan policy agar:

-   Pengunjung dapat membaca gambar portfolio.
-   Hanya administrator yang dapat melakukan upload.
-   Hanya administrator yang dapat mengubah atau menghapus gambar.

------------------------------------------------------------------------

## 13. Alur CRUD Project

### Create

``` text
Admin
  ↓
Project Form
  ↓
Upload Image → Storage
  ↓
Get Image URL
  ↓
Insert Project → PostgreSQL
```

### Read

``` text
Next.js
  ↓
SELECT projects
  ↓
PostgreSQL
  ↓
Project Data
```

### Update

``` text
Admin
  ↓
Edit Project
  ↓
Update Image (jika ada)
  ↓
Update Project Data
  ↓
PostgreSQL
```

### Delete

``` text
Admin
  ↓
Delete Project
  ↓
Delete Image dari Storage
  ↓
Delete Data dari PostgreSQL
```

------------------------------------------------------------------------

## 14. Deployment

Aplikasi dapat dideploy ke Vercel.

``` text
GitHub Repository
        │
        ▼
      Vercel
        │
        ▼
     Next.js
        │
        ├──────────────────┐
        │                  │
        ▼                  ▼
   Supabase DB       Supabase Storage
        │                  │
        └────────┬─────────┘
                 ▼
            End User
```

Environment variables yang dibutuhkan:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Secret key atau service-role key tidak boleh diekspos ke client atau
dimasukkan ke environment variable yang menggunakan prefix
`NEXT_PUBLIC_`.

------------------------------------------------------------------------

## 15. Kesimpulan Arsitektur

Sistem portfolio menggunakan arsitektur web modern dengan Next.js
sebagai application layer dan Supabase sebagai backend service.

Pembagian tanggung jawab:

``` text
Next.js
│
├── UI
├── Public Website
├── Admin Panel
├── Server Components
└── API / Server Actions

Supabase
│
├── PostgreSQL
│   └── Portfolio Data
│
├── Storage
│   └── Images
│
└── Authentication
    └── Admin Login
```

Arsitektur ini dipilih karena kebutuhan sistem relatif sederhana, tidak
membutuhkan server backend terpisah, dan memungkinkan seluruh konten
portfolio dikelola melalui admin panel.
