# 🎓 IT Center Dashboard

A full-stack management platform for an IT training centre: a public course
catalogue and library, plus role-aware dashboards for administrators, tutors and
students. Built with React 19 + Ant Design 6 on the front end and Express 5 +
MongoDB on the back end, with the interface available in **Uzbek and English**.

![Node](https://img.shields.io/badge/node-%E2%89%A520-339933)
![React](https://img.shields.io/badge/react-19-61dafb)
![Express](https://img.shields.io/badge/express-5-000000)
![MongoDB](https://img.shields.io/badge/mongodb-mongoose%209-47a248)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📑 Table of contents

- [Features](#-features)
- [Tech stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting started](#-getting-started)
- [Environment variables](#-environment-variables)
- [Scripts](#-scripts)
- [Demo accounts](#-demo-accounts)
- [API reference](#-api-reference)
- [Project structure](#-project-structure)
- [Conventions](#-conventions)
- [Deployment](#-deployment)
- [Author](#-author)

---

## ✨ Features

### Public

- Landing page with live counts, featured courses, tutor profiles and library picks
- Course catalogue with search, level and category filters, and pagination
- Course detail page with tutor, duration, capacity and one-click enrollment
- Library catalogue with search and category filters
- Uzbek 🇺🇿 / English 🇬🇧 switcher that also localises Ant Design components

### Administrator

- Overview dashboard: totals, most popular courses, enrollments by status
- Full CRUD for courses, books, tutors and students
- Enrollment management — change status, set progress, cancel a place
- Soft deletes throughout, so historical records keep resolving

### Tutor

- Personal dashboard with course and student counts
- Own courses with live enrollment counts against capacity
- Roster of every student on their courses, with inline grading

### Student

- Dashboard with enrolled/completed counts and average progress
- Enrolled courses with progress bars and the ability to drop a course
- Full library access

### Platform

- JWT session in an **HTTP-only** cookie — no token in `localStorage`
- Role-based access control enforced on every route, server-side
- Passwords hashed with bcrypt; rate limiting on credential endpoints
- Request validation with Zod, with field-level error messages
- `helmet`, CORS allow-list and a single normalised error envelope

---

## 🛠 Tech stack

| Layer      | Choice                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| Frontend   | React 19, React Router 7, Ant Design 6, Axios, i18next, Vite 8          |
| Backend    | Node 20+, Express 5, Mongoose 9, Zod 4                                  |
| Auth       | JSON Web Tokens in HTTP-only cookies, bcrypt                            |
| Database   | MongoDB                                                                 |
| Tooling    | ESLint 9 (flat config), Prettier 3, EditorConfig, nodemon, concurrently |
| Deployment | Vercel (static SPA + serverless Express)                                |

---

## 🏗 Architecture

The repo holds one application in two halves that share an origin.

```
Browser ──▶ Vite dev server :3000 ──/api──▶ Express :5001 ──▶ MongoDB
                (development — Vite proxies /api)

Browser ──▶ Vercel static SPA ──/api──▶ api/index.js (same Express app) ──▶ MongoDB
                (production)
```

The backend is layered so each file has one reason to change:

```
route  ──▶  validate (Zod)  ──▶  auth guard  ──▶  controller  ──▶  service  ──▶  model
                                                       │              │
                                    HTTP shape only ───┘              └─── business rules
```

- **Routes** wire paths to middleware. No logic.
- **Validators** parse and coerce `body`, `query` and `params`; controllers only ever see clean data.
- **Controllers** read the request, call one service, and shape the response. No database access.
- **Services** hold the business rules — capacity checks, soft deletes, profile creation.
- **Models** are Mongoose schemas plus indexes.

Errors are thrown, never returned: `ApiError.notFound()` and friends bubble to a
single error middleware that also translates Mongoose's `CastError`,
`ValidationError` and duplicate-key errors.

Every response uses the same envelope:

```jsonc
// success
{ "success": true, "data": [...], "meta": { "page": 1, "totalPages": 4, ... } }
// failure
{ "success": false, "message": "Validation failed", "details": [{ "field": "email", "message": "..." }] }
```

---

## 🚀 Getting started

### Prerequisites

- **Node.js 20 or newer** (`.nvmrc` pins 22)
- **MongoDB** — a local `mongod`, or a free MongoDB Atlas cluster

### Installation

```bash
# 1. Clone
git clone https://github.com/abbosbek-sulaymonov/it-center-dashboard.git
cd it-center-dashboard

# 2. Install dependencies
npm install

# 3. Configure the environment
cp .env.example .env.local
#    then edit .env.local — at minimum set MONGODB_URI and JWT_SECRET

# 4. Fill the database with demo data (destructive: clears every collection)
npm run seed

# 5. Start the frontend and the API together
npm run dev
```

| Service | URL                              |
| ------- | -------------------------------- |
| App     | http://localhost:3000            |
| API     | http://localhost:5001/api/v1     |
| Health  | http://localhost:5001/api/health |

Vite proxies `/api` to the Express server, so the browser only ever talks to one
origin and the session cookie works without any CORS exceptions.

---

## 🔐 Environment variables

Copy `.env.example` to `.env.local` (git-ignored) and fill it in.

| Variable        | Required         | Default                 | Purpose                                         |
| --------------- | ---------------- | ----------------------- | ----------------------------------------------- |
| `MONGODB_URI`   | ✅ yes           | —                       | MongoDB connection string                       |
| `JWT_SECRET`    | ✅ in production | insecure dev fallback   | Signs session tokens                            |
| `PORT`          | no               | `5001`                  | Port the API listens on                         |
| `CLIENT_ORIGIN` | no               | `http://localhost:3000` | Comma-separated origins allowed to send cookies |

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

In development the server warns and falls back to a known secret if `JWT_SECRET`
is unset, so a fresh clone runs without setup. In production it refuses to start.

---

## 📜 Scripts

| Script                 | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Vite **and** the API together, colour-tagged `web` / `api`   |
| `npm run dev:web`      | Vite dev server only (port 3000)                             |
| `npm run dev:api`      | API only, restarted by nodemon on change (port 5001)         |
| `npm run build`        | Production SPA build into `dist/`                            |
| `npm run preview`      | Serve the built SPA locally                                  |
| `npm start`            | Run the API in production mode; also serves `dist/` if built |
| `npm run seed`         | Reset the database and load demo data                        |
| `npm run lint`         | ESLint over the whole repo                                   |
| `npm run lint:fix`     | ESLint with autofix                                          |
| `npm run format`       | Prettier write                                               |
| `npm run format:check` | Prettier check — use in CI                                   |
| `npm run check`        | `lint` + `format:check`                                      |

---

## 👥 Demo accounts

After `npm run seed`, every account below uses the password **`Password123`**.
The login screen lists them and fills the form on click.

| Role    | Email                 | Sees                                             |
| ------- | --------------------- | ------------------------------------------------ |
| Admin   | `admin@itcenter.uz`   | Everything — full CRUD and enrollment management |
| Tutor   | `dilnoza@itcenter.uz` | Own courses and the students on them             |
| Student | `aziz@example.com`    | Own enrollments, progress and the library        |

---

## 🔌 API reference

Base URL `/api/v1`. Authentication is a `it_center_token` HTTP-only cookie set at
login; send requests with credentials included.

### Auth

| Method  | Endpoint            | Access        | Description                          |
| ------- | ------------------- | ------------- | ------------------------------------ |
| `POST`  | `/auth/signup`      | public        | Register (always creates a student)  |
| `POST`  | `/auth/login`       | public        | Sign in, sets the session cookie     |
| `POST`  | `/auth/logout`      | public        | Clear the session cookie             |
| `GET`   | `/auth/me`          | authenticated | Current user plus their role profile |
| `PATCH` | `/auth/me`          | authenticated | Update own name, phone, avatar       |
| `POST`  | `/auth/me/password` | authenticated | Change own password                  |

### Courses

| Method   | Endpoint              | Access | Description                                                             |
| -------- | --------------------- | ------ | ----------------------------------------------------------------------- |
| `GET`    | `/courses`            | public | Paginated list; `search`, `level`, `category`, `tutor`, `page`, `limit` |
| `GET`    | `/courses/categories` | public | Distinct category names                                                 |
| `GET`    | `/courses/:id`        | public | One course, tutor populated                                             |
| `POST`   | `/courses`            | admin  | Create                                                                  |
| `PATCH`  | `/courses/:id`        | admin  | Update                                                                  |
| `DELETE` | `/courses/:id`        | admin  | Soft delete                                                             |

### Books

| Method   | Endpoint            | Access | Description                          |
| -------- | ------------------- | ------ | ------------------------------------ |
| `GET`    | `/books`            | public | Paginated list; `search`, `category` |
| `GET`    | `/books/categories` | public | Distinct category names              |
| `GET`    | `/books/:id`        | public | One book                             |
| `POST`   | `/books`            | admin  | Create                               |
| `PATCH`  | `/books/:id`        | admin  | Update                               |
| `DELETE` | `/books/:id`        | admin  | Soft delete                          |

### Tutors

| Method   | Endpoint              | Access | Description                                      |
| -------- | --------------------- | ------ | ------------------------------------------------ |
| `GET`    | `/tutors`             | public | Paginated list, searchable by name or speciality |
| `GET`    | `/tutors/:id`         | public | One tutor                                        |
| `GET`    | `/tutors/me/courses`  | tutor  | Own courses with enrollment counts               |
| `GET`    | `/tutors/me/students` | tutor  | Everyone enrolled on own courses                 |
| `GET`    | `/tutors/me/stats`    | tutor  | Course and student totals                        |
| `POST`   | `/tutors`             | admin  | Create the login and profile together            |
| `PATCH`  | `/tutors/:id`         | admin  | Update                                           |
| `DELETE` | `/tutors/:id`         | admin  | Soft delete and unassign from courses            |

### Students

| Method   | Endpoint                   | Access       | Description               |
| -------- | -------------------------- | ------------ | ------------------------- |
| `GET`    | `/students`                | admin, tutor | Paginated list            |
| `GET`    | `/students/groups`         | admin, tutor | Distinct group names      |
| `GET`    | `/students/:id`            | admin, tutor | One student               |
| `GET`    | `/students/me/enrollments` | student      | Own enrollments           |
| `GET`    | `/students/me/stats`       | student      | Own counters and progress |
| `POST`   | `/students`                | admin        | Create                    |
| `PATCH`  | `/students/:id`            | admin        | Update                    |
| `DELETE` | `/students/:id`            | admin        | Soft delete               |

### Enrollments

| Method   | Endpoint           | Access        | Description                                       |
| -------- | ------------------ | ------------- | ------------------------------------------------- |
| `GET`    | `/enrollments`     | admin, tutor  | Paginated list; `status`, `course`, `student`     |
| `POST`   | `/enrollments`     | authenticated | Enroll; only an admin may name another student    |
| `PATCH`  | `/enrollments/:id` | admin, tutor  | Set status and progress                           |
| `DELETE` | `/enrollments/:id` | authenticated | Cancel — students may only cancel their own place |

### Stats & health

| Method | Endpoint          | Access | Description                        |
| ------ | ----------------- | ------ | ---------------------------------- |
| `GET`  | `/stats/overview` | admin  | Dashboard totals and top courses   |
| `GET`  | `/api/health`     | public | Liveness probe, no database access |

---

## 📁 Project structure

```
it-center-dashboard/
├── api/
│   └── index.js                 # Vercel entry — exports the Express app
├── server/
│   ├── app.js                   # Express app factory (middleware, routes, SPA fallback)
│   ├── index.js                 # Local dev entry — connects and listens
│   ├── config/                  # env, database connection, shared constants
│   ├── models/                  # Mongoose schemas
│   ├── services/                # Business logic and all database access
│   ├── controllers/             # Request/response shaping
│   ├── routes/                  # Path wiring
│   ├── middleware/              # auth, validate, error, asyncHandler
│   ├── validators/              # Zod schemas
│   ├── utils/                   # ApiError, JWT, password, pagination
│   └── scripts/seed.js          # Demo data
├── src/
│   ├── main.jsx                 # React entry
│   ├── App.jsx                  # Providers: antd theme, i18n locale, router, auth
│   ├── api/                     # One module per resource, wrapping Axios
│   ├── components/
│   │   ├── common/              # PageHeader, SearchInput, StatCard, EmptyState…
│   │   ├── course/ book/ people/# Domain cards and form modals
│   ├── constants/               # roles, enrollment statuses, route paths
│   ├── context/                 # AuthContext (value split from provider)
│   ├── hooks/                   # useAuth, useApiResource, useTableQuery
│   ├── i18n/                    # setup + uz.json / en.json
│   ├── layouts/                 # PublicLayout, DashboardLayout
│   ├── pages/                   # public/, admin/, tutor/, student/
│   ├── routes/                  # AppRoutes, ProtectedRoute
│   ├── styles/global.css
│   └── utils/format.js
├── docs/CONVENTIONS.md          # Naming and code conventions
├── eslint.config.js             # Flat config: browser, node and config scopes
├── .prettierrc / .editorconfig
├── vite.config.js
└── vercel.json
```

---

## 📐 Conventions

Naming and structure rules are documented in **[docs/CONVENTIONS.md](docs/CONVENTIONS.md)**.
The short version:

| Kind            | Convention            | Example                    |
| --------------- | --------------------- | -------------------------- |
| React component | `PascalCase.jsx`      | `CourseCard.jsx`           |
| Page component  | `PascalCase` + `Page` | `AdminCoursesPage.jsx`     |
| Hook            | `useThing.js`         | `useTableQuery.js`         |
| Plain module    | `camelCase.js`        | `format.js`                |
| Server module   | `name.role.js`        | `course.controller.js`     |
| Directory       | lowercase, plural     | `components/`, `services/` |

Run `npm run check` before pushing — it is the same gate CI would use.

---

## ☁️ Deployment

The project deploys to Vercel as a static SPA plus one serverless function.

1. Import the repository in Vercel.
2. Set `MONGODB_URI`, `JWT_SECRET` and `CLIENT_ORIGIN` (your production URL) as
   environment variables.
3. Deploy — `vercel.json` already routes `/api/*` to `api/index.js` and every
   other path to `index.html` for client-side routing.

To run the production build on any other host:

```bash
npm run build
NODE_ENV=production npm start   # Express serves dist/ and the API together
```

---

## 👤 Author

**Abbosbek Sulaymonov**

- GitHub: [@abbosbek-sulaymonov](https://github.com/abbosbek-sulaymonov)
- LinkedIn: [Abbosbek Sulaymonov](https://www.linkedin.com/in/abek01sulaymonov/)
- Website: [abbosbek.uz](https://abbosbek.uz)

---

## 📄 License

MIT
