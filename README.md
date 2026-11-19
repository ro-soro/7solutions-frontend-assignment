# 7 Solutions Frontend Assignment

One Next.js app with both parts of the assignment.

| Part                     | Page                              | Source                                                     |
| ------------------------ | --------------------------------- | ---------------------------------------------------------- |
| 1. Auto Delete Todo List | `/todo-list` (`/` redirects here) | [`src/app/todo-list`](src/app/todo-list)                   |
| 2. Create data from API  | `/department-summary`             | [`src/app/department-summary`](src/app/department-summary) |
| 2. JSON API              | `/api/department-summary`         | [`src/server/app.ts`](src/server/app.ts) (Hono)            |

**Live demo:** _add the Vercel URL here_

**Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, Hono (HTTP API), Vitest + Testing Library

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 26 tests
npm run typecheck
npm run lint
npm run build
```

**Light and dark themes.** The site follows the system setting. The button in the nav switches themes and remembers the choice in `localStorage`. A small script in `<head>` ([`src/utils/theme.ts`](src/utils/theme.ts)) sets the theme before the first paint, so the page never flashes the wrong theme.

---

## 1. Auto Delete Todo List

### How it works

- [`page.tsx`](src/app/todo-list/page.tsx) is a Server Component and renders static HTML. Only [`todoBoard.tsx`](src/app/todo-list/components/todoBoard.tsx) is a Client Component.
- All the state lives in one hook, [`use-auto-delete-todo.ts`](src/app/todo-list/hooks/use-auto-delete-todo.ts):
  - `list` and `moved` live in one state object, so moving an item is a single atomic update.
  - Each moved item gets its own `setTimeout`, kept in a `Map` (inside a `useRef`) keyed by the item name.
  - A manual click and the 5-second timer both call `returnToList`. This function clears the item's pending timer first, so an old timer cannot send the item back early after you move it again.
  - Every state update is a functional update and is guarded. A late or repeated call does nothing.
  - When the component unmounts, all pending timers are cleared.
  - Each timer also stores its deadline (`returnAt`). A hidden tab or a sleeping computer can delay `setTimeout`, so when the tab becomes visible again, every item whose time is up goes back right away.
- The ring around each moved item's icon and the seconds left (5 → 1) are CSS animations, not React state, so there is no re-render every second. The ring is an SVG stroke (`stroke-dashoffset`); the number is an `@property` integer printed with a CSS counter. With reduced motion, the movement stops but the number keeps counting.

### Other approaches (for discussion)

1. **Timestamp + one interval.** Store `movedAt` for each item and run one `setInterval` that sends back every item older than 5 seconds. There is only one timer to manage, but returns are less precise and the interval runs even when nothing is moving.
2. **`useReducer` / Zustand store.** Move the transitions into a reducer or store. This helps when other components need the board state. For a single component, the hook is enough.

## 2. Create data from API

`GET /api/department-summary` fetches users from `https://dummyjson.com/users` and groups them by `company.department`:

```json
{
  "Engineering": {
    "male": 11,
    "female": 8,
    "ageRange": "25-46",
    "hair": { "Brown": 3, "Gray": 4 },
    "addressUser": { "EmilyJohnson": "29112" }
  }
}
```

The `/department-summary` page renders the same data on the server as cards: gender split, age range, hair colors, and postal codes.

### Code

- [`src/server/app.ts`](src/server/app.ts): the Hono app with the `/api/*` routes and error handling.
- [`src/app/api/[[...route]]/route.ts`](src/app/api/[[...route]]/route.ts): hands every `/api/*` request to Hono (`app.fetch`).
- [`src/services/user.ts`](src/services/user.ts): fetches the users from dummyjson and checks the response with a zod schema at runtime. If the format changes, the API responds `502` with a clear error in the log instead of breaking silently.
- [`src/services/department-summary.ts`](src/services/department-summary.ts): `mapDepartmentStats` groups the users with numeric ages; `getDepartmentStats` caches that result. The page reads these numbers directly. `mapDepartmentSummary` turns them into the assignment's response shape (`ageRange: "25-46"`) for the API.
- [`src/services/models`](src/services/models): request and response types.

### Performance

- **All users.** dummyjson returns only 30 users by default. The request uses `limit=0` to get all of them (208 users right now).
- **Smaller payload.** `select=` asks only for the fields the summary needs.
- **Single pass.** `mapDepartmentStats` builds the result in one O(n) loop. It mutates local accumulators and never re-spreads objects. A test summarises 100,000 users in under 500 ms.
- **Cache.** `getDepartmentStats` uses `"use cache"` with `cacheLife("minutes")`. The page and the API share one cached result, and the page is prerendered at build time; the cache refreshes every minute. Errors are not cached; the API responds `502` instead.

### Why Hono inside Next.js

The assignment asks for an HTTP framework. The API is a [Hono](https://hono.dev) app, a TypeScript HTTP framework built on Web standards. Next.js forwards every `/api/*` request to it through one catch-all Route Handler. This gives:

- A real HTTP framework with its own routing, `onError` handling, and `app.request()` for tests.
- One project, one deploy, and one link for both parts.
- One cache shared by the page and the API.

The Hono app does not depend on Next.js routing. To run it as a separate service, pass the same `app` to `@hono/node-server` or deploy it to any runtime Hono supports.

## Tests

| File                                                                                     | Covers                                                                                              |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [`use-auto-delete-todo.test.ts`](tests/app/todo-list/hooks/use-auto-delete-todo.test.ts) | Move, 5-second return, separate timers, manual return, timer reset, cleanup on unmount, late timers |
| [`todoBoard.test.tsx`](tests/app/todo-list/components/todoBoard.test.tsx)                | Clicks and columns, countdown description                                                           |
| [`department-summary.test.ts`](tests/services/department-summary.test.ts)                | Grouping rules, empty input, age range, 100k-user performance check, response shape                 |
| [`user.test.ts`](tests/services/user.test.ts)                                            | Upstream URL and query, error status, invalid response format                                       |
| [`app.test.ts`](tests/server/app.test.ts)                                                | Hono routes: `200` summary, `502` on upstream failure or bad format, health check, `404`            |

## Deploy

Import the repository into Vercel with the default Next.js settings. No environment variables are needed.
