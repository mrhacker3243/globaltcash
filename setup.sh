#!/bin/bash

# 1. Core Folders
mkdir -p prisma
mkdir -p src/lib
mkdir -p src/components/ui
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/(auth)/login
mkdir -p src/app/(user)/dashboard
mkdir -p src/app/(admin)/admin/dashboard

# 2. Prisma Files
touch prisma/seed.ts

# 3. Library & Config Files
touch src/lib/db.ts
touch .env

# 4. Auth & API Files
touch src/app/api/auth/[...nextauth]/route.ts

# 5. Page Files (Empty)
touch src/app/(auth)/login/page.tsx
touch src/app/(user)/dashboard/page.tsx
touch src/app/(admin)/admin/dashboard/page.tsx

# 6. Global Layouts
touch src/app/layout.tsx

echo "✅ All HYIP project folders and empty files created successfully!"