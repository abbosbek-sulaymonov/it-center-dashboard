# Code conventions

The rules the codebase already follows. New code should match; the linter and
formatter enforce what can be enforced automatically.

---

## 1. File and directory naming

### Directories

Lowercase, and plural when they hold many of one thing.

```
src/components/   src/hooks/   src/pages/   server/services/   server/validators/
```

Group by **what it is**, not by feature, until a feature grows large enough to
justify its own folder. `components/course/`, `components/book/` and
`components/people/` exist because those groups earned it; everything shared
sits in `components/common/`.

### Frontend files

| Kind             | Rule                                | Example                                 |
| ---------------- | ----------------------------------- | --------------------------------------- |
| React component  | `PascalCase.jsx`                    | `CourseCard.jsx`, `PageHeader.jsx`      |
| Page component   | `PascalCase` ending in `Page`       | `AdminCoursesPage.jsx`                  |
| Layout component | `PascalCase` ending in `Layout`     | `DashboardLayout.jsx`                   |
| Modal component  | `PascalCase` ending in `FormModal`  | `CourseFormModal.jsx`                   |
| Custom hook      | `use` + `PascalCase`, `.js`         | `useApiResource.js`, `useTableQuery.js` |
| API module       | `resource.api.js`                   | `course.api.js`, `enrollment.api.js`    |
| Plain module     | `camelCase.js`                      | `format.js`, `client.js`                |
| Constants module | `camelCase.js`, exports `SCREAMING` | `roles.js` exporting `ROLES`            |
| Stylesheet       | `kebab-case.css`                    | `global.css`                            |

**A file that exports a component gets `.jsx`. A file that does not gets `.js`.**
This is why `context/AuthContext.jsx` holds the provider while
`context/authContext.js` holds the context object — mixing the two in one file
breaks React fast refresh, and ESLint flags it.

### Backend files

Server modules are named `subject.role.js`, so the layer is obvious from the
filename alone and files sort together by subject:

| Layer      | Pattern              | Example                 |
| ---------- | -------------------- | ----------------------- |
| Model      | `name.model.js`      | `course.model.js`       |
| Service    | `name.service.js`    | `enrollment.service.js` |
| Controller | `name.controller.js` | `student.controller.js` |
| Routes     | `name.routes.js`     | `book.routes.js`        |
| Middleware | `name.middleware.js` | `auth.middleware.js`    |
| Validator  | `name.validator.js`  | `people.validator.js`   |

Subject names are **singular** (`course.model.js`, not `courses.model.js`); the
directory already carries the plural.

An `index.js` in a folder is a barrel and nothing else — it re-exports, it does
not define. See `server/models/index.js`.

---

## 2. Identifier naming

| Kind                     | Convention              | Example                          |
| ------------------------ | ----------------------- | -------------------------------- |
| Variables, functions     | `camelCase`             | `listCourses`, `enrollmentCount` |
| React components         | `PascalCase`            | `CourseCard`                     |
| Constants (module-level) | `SCREAMING_SNAKE_CASE`  | `ROLES`, `TOKEN_TTL_SECONDS`     |
| Mongoose models          | `PascalCase` singular   | `Course`, `Enrollment`           |
| Booleans                 | `is` / `has` / `should` | `isActive`, `hasNextPage`        |
| Event handlers           | `handle` + event        | `handleSubmit`, `handleDelete`   |
| Handler props            | `on` + event            | `onSubmit`, `onCancel`           |
| Unused parameters        | leading underscore      | `(_req, res)`                    |

Service functions are named for the operation, not the HTTP verb:
`listCourses`, `getCourseById`, `createCourse`, `deactivateCourse`. Controllers,
which are HTTP-facing, use the short REST names: `list`, `detail`, `create`,
`update`, `remove`.

---

## 3. Imports

Order, separated by blank lines:

1. Node builtins (`node:path`)
2. External packages (`express`, `antd`)
3. Internal aliases (`@/hooks/useAuth.js`)
4. Relative (`./authContext.js`)

Frontend code imports through the `@/` alias, configured in both
`vite.config.js` and `jsconfig.json` so the editor resolves it too:

```js
import { useAuth } from '@/hooks/useAuth.js';
```

Server code uses relative paths — no bundler runs over it, and the tree is
shallow enough that relative imports stay readable.

Always include the file extension. Node's ESM loader requires it, and keeping
the same rule on both sides avoids two habits.

---

## 4. Backend rules

- **Controllers never touch the database.** They call exactly one service and
  shape the response.
- **Services never touch `req` or `res`.** They take plain arguments and return
  plain data, so they stay testable and reusable.
- **Throw, don't return, errors.** Use `ApiError.notFound()` and friends; the
  error middleware turns them into responses.
- **Wrap async handlers in `asyncHandler`** so rejections reach the error
  middleware instead of hanging the request.
- **Validate at the edge.** Every route with input carries a `validate({...})`
  with a Zod schema. Controllers assume their input is already clean.
- **Delete softly.** Set `isActive: false` rather than removing documents, so
  historical enrollments keep resolving.
- **One response envelope.** Always answer through `sendSuccess` / `sendCreated`.

---

## 5. Frontend rules

- **Data fetching goes through `useApiResource`.** Pass a `useCallback`-wrapped
  fetcher — a fresh function reference triggers a refetch.
- **List screens use `useTableQuery`** for paging, search and filters. It resets
  to page one whenever a filter changes.
- **Never keep auth state in `localStorage`.** The session lives in an HTTP-only
  cookie; `AuthContext` is the only source of truth in the client.
- **Route paths come from `PATHS`** in `src/constants/routes.js`. No string
  literals in components.
- **No user-facing string literals.** Everything goes through `t('…')` so both
  locales stay complete.
- **Prefer `antd` primitives** (`Flex`, `Row`/`Col`, `Space`) over custom CSS.
  Reach for `global.css` only for layout the component library cannot express.
- **Components take data, not fetchers.** `CourseCard` receives a course; the
  page decides where it came from.

---

## 6. Translations

Both `src/i18n/locales/uz.json` and `en.json` must have identical key trees.
Keys are grouped by area (`common`, `nav`, `auth`, `course`, `book`, `tutor`,
`student`, `enrollment`, `dashboard`, `landing`) and named for meaning, not for
the English text — `course.empty`, not `course.noCoursesYet`.

Interpolate rather than concatenating:

```js
t('dashboard.welcome', { name: user.fullName });
```

Uzbek is the fallback language. Adding a key to one file without the other is a
bug: the other locale silently falls back.

---

## 7. Formatting and linting

Prettier owns formatting — 110 columns, single quotes, trailing commas,
semicolons, two-space indent. ESLint owns correctness and never fights it
(`eslint-config-prettier` runs last).

```bash
npm run check      # lint + format check — run before pushing
npm run lint:fix   # autofix what can be fixed
npm run format     # rewrite files with Prettier
```

The flat config scopes rules to three environments: `src/**` gets browser
globals and the React rules, `server/**` and `api/**` get Node globals and allow
`console`, and root-level `*.config.js` files get Node globals.

---

## 8. Comments

Comment **why**, not what. The code already says what it does.

```js
// A student can hold only one enrollment per course.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
```

Use JSDoc blocks on exported functions whose contract is not obvious from the
signature — especially the ones with a constraint a caller could trip over, like
`useApiResource` requiring a stable fetcher.

---

## 9. Commits

Conventional Commits:

```
feat: add enrollment capacity guard
fix: reset pagination when a filter changes
refactor: split auth context value from its provider
docs: document the naming conventions
chore: bump antd to 6.6
```

One logical change per commit.
