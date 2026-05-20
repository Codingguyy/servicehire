# Smart Leads Dashboard

Full-stack Lead Management Dashboard — MERN + TypeScript.

## Structure

```
smart-leads/
├── backend/
│   ├── config/         database.ts
│   ├── controllers/    authController.ts, leadController.ts
│   ├── middleware/     auth.ts, errorHandler.ts, validate.ts
│   ├── models/         User.ts, Lead.ts
│   ├── routes/         authRoutes.ts, leadRoutes.ts
│   ├── types/          index.ts
│   ├── utils/          jwt.ts, response.ts
│   └── index.ts        ← entry point
├── frontend/
│   ├── components/
│   │   ├── auth/       ProtectedRoute.tsx
│   │   ├── layout/     AppLayout.tsx, Sidebar.tsx, Header.tsx
│   │   ├── leads/      LeadTable, LeadForm, LeadFilters, Pagination, StatsCards, LeadDetailModal
│   │   └── ui/         Button, Input, Select, Badge, Modal, EmptyState, Skeleton, ConfirmDialog
│   ├── context/        AuthContext.tsx, ThemeContext.tsx
│   ├── hooks/          useLeads.ts, useDebounce.ts
│   ├── pages/          DashboardPage, LoginPage, RegisterPage, UsersPage, NotFoundPage
│   ├── services/       api.ts, authService.ts, leadService.ts
│   ├── types/          index.ts
│   ├── utils/          helpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json        ← single package.json
├── tsconfig.json       ← frontend TS config
├── tsconfig.backend.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```

## Quick Start

```bash
# Install everything
npm install

# Copy env
cp .env.example .env
# Fill in JWT_SECRET and MONGODB_URI

# Run both (requires concurrently)
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

## Docker

```bash
cp .env.example .env   # set JWT_SECRET
docker compose up --build
# App → http://localhost
# API → http://localhost:5000
```

## API

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Current user |
| GET | /api/auth/users | Admin | All users |
| GET | /api/leads | Auth | List (filtered, paginated) |
| POST | /api/leads | Auth | Create |
| GET | /api/leads/:id | Auth | Get one |
| PUT | /api/leads/:id | Auth | Update |
| DELETE | /api/leads/:id | Admin | Delete |
| GET | /api/leads/export | Auth | CSV export |

## Roles

| Action | Admin | Sales |
|--------|-------|-------|
| View all leads | ✅ | own only |
| Create lead | ✅ | ✅ |
| Edit lead | ✅ | own only |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ |
| View users | ✅ | ❌ |
