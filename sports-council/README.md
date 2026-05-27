# SRM Sports Council

This project is split into a React frontend and an Express backend.

```text
sports-council/
  frontend/   React + Vite user interface
  backend/    Express API connected to MongoDB
  common/     Shared project notes or future shared files
```

## Frontend Structure

The frontend is inside `frontend/` and is built with React, Vite, React Router, SWR, Tailwind CSS, Framer Motion, and Lucide icons.

```text
frontend/
  index.html
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  public/
    _redirects
    college-video-background.gif
    images/coaches/football_coach.png
  src/
    main.jsx
    App.jsx
    index.css
    lib/api.js
    components/
    pages/admin/
```

### Frontend Entry Files

`frontend/src/main.jsx`

Mounts the React application into the browser DOM. It imports `App.jsx` and global CSS.

`frontend/src/App.jsx`

Defines the full frontend routing using `react-router-dom`. It wraps the app in `BrowserRouter` and `ThemeProvider`, renders the shared `Navbar` and `ScrollProgressBar`, and maps URLs to pages.

`frontend/src/index.css`

Contains Tailwind imports, theme CSS variables, global body styling, font classes, accessibility focus styles, glass/card utilities, and scrollbar helpers.

`frontend/src/lib/api.js`

Defines the shared `fetcher()` function used by SWR. It reads `VITE_API_BASE_URL` in production and prefixes API requests with the deployed backend URL.

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
```

### Frontend Pages

The main pages are defined in `App.jsx`.

| Route | Page/Component | Purpose |
| --- | --- | --- |
| `/` | `HomePage` | Landing page with hero, news, about section, hierarchy, and footer. |
| `/clubs` | `PageShell` + `ClubsGrid` | Lists sports clubs and opens club detail modals. |
| `/events` | `PageShell` + `EventsList` | Shows live, upcoming, and past events with filters and pagination. |
| `/achievements` | `PageShell` + `AchievementsGallery` | Displays trophies, accolades, and records with filters. |
| `/admin/login` | `AdminLogin` | Admin login screen. |
| `/admin` | `AdminLayout` + `AdminDashboard` | Admin overview dashboard. |
| `/admin/clubs` | `AdminLayout` + `AdminClubs` | Admin management page for clubs. |
| `/admin/events` | `AdminLayout` + `AdminEvents` | Admin management page for events. |
| `/admin/achievements` | `AdminLayout` + `AdminAchievements` | Admin management page for achievements. |
| `/admin/news` | `AdminLayout` + `AdminNews` | Admin management page for news carousel items. |
| `/admin/council` | `AdminLayout` + `AdminCouncil` | Admin management page for council hierarchy members. |
| `/admin/stats` | `AdminLayout` + `AdminStats` | Admin management page for homepage statistics. |

`PageShell` is a shared layout wrapper used by the public inner pages. It provides consistent spacing, max width, page title, background, and text color.

`SiteFooter` is defined in `App.jsx` and is used only on the homepage.

### Admin Pages

`frontend/src/pages/admin/AdminLayout.jsx`

Provides the admin shell with header, sidebar navigation, and an `<Outlet />` where nested admin pages render. It links to dashboard, clubs, events, achievements, news, council, and stats.

`frontend/src/pages/admin/AdminDashboard.jsx`

Uses SWR to fetch:

```text
/api/stats
/api/clubs
/api/events
/api/achievements
```

It displays summary cards for admin monitoring.

`frontend/src/pages/admin/AdminLogin.jsx`

Renders a username/password form and posts credentials to:

```text
POST /api/admin/login
```

`frontend/src/pages/admin/AdminClubs.jsx`

Fetches clubs from `/api/clubs`. Allows editing and deleting clubs through:

```text
PUT /api/admin/clubs/:id
DELETE /api/admin/clubs/:id
```

`frontend/src/pages/admin/AdminEvents.jsx`

Fetches events from `/api/events`. Allows editing and deleting events through:

```text
PUT /api/admin/events/:id
DELETE /api/admin/events/:id
```

`frontend/src/pages/admin/AdminAchievements.jsx`

Fetches achievements from `/api/achievements`. Allows editing and deleting achievements through:

```text
PUT /api/admin/achievements/:id
DELETE /api/admin/achievements/:id
```

`frontend/src/pages/admin/AdminNews.jsx`

Fetches news from `/api/news`. Allows editing and deleting news through:

```text
PUT /api/admin/news/:id
DELETE /api/admin/news/:id
```

`frontend/src/pages/admin/AdminCouncil.jsx`

Fetches council hierarchy data from `/api/council`. Allows editing and deleting council members through:

```text
PUT /api/admin/council/:id
DELETE /api/admin/council/:id
```

`frontend/src/pages/admin/AdminStats.jsx`

Fetches homepage stats from `/api/stats` and updates them through:

```text
PUT /api/admin/stats
```

## Frontend Components

`Navbar.jsx`

Main public navigation bar. It contains links to Home, Clubs, Events, and Achievements, plus a theme toggle and mobile menu. It hides itself on admin routes because `AdminLayout` provides separate admin navigation.

`ScrollProgressBar.jsx`

Displays a top scroll progress indicator using Framer Motion's `useScroll` and `useSpring`.

`ThemeProvider.jsx`

Stores and controls the light/dark theme. It writes the selected theme to `localStorage` and applies either `html.dark` or `html.light`.

`Hero.jsx`

Homepage hero section. It uses `/college-video-background.gif` as the background media and fetches `/api/stats` to display teams and athletes count. It falls back to static values if the API does not return data.

`NewsCarousel.jsx`

Homepage news carousel. It fetches `/api/news` and maps backend news data into carousel slides. If no backend data exists, it uses fallback news items.

`AboutCouncil.jsx`

Static homepage section explaining the sports council values and mission using icon-driven cards.

`Hierarchy.jsx`

Displays the sports council hierarchy. It fetches:

```text
/api/council
/api/clubs
```

It groups directors, convenors, coaches, student body members, and club data into hierarchy sections.

`ClubsGrid.jsx`

Public clubs page grid. It fetches `/api/clubs` and falls back to static club data if the backend collection is empty. It renders `ClubCard` internally and opens `ClubModal` when a club is selected.

`ClubModal.jsx`

Modal used by `ClubsGrid` to show club detail information such as description, leadership, roster, achievements, gallery, and coach image.

`EventsList.jsx`

Public events page. It fetches `/api/events`, formats dates and event stages, and supports:

```text
Live/upcoming/past tabs
Search
Sport filter
Sort order
Pagination
```

It renders event cards with different layouts for live, upcoming, and past events.

`AchievementsGallery.jsx`

Public achievements page. It fetches `/api/achievements` and supports filters by sport, year, and category. It groups achievements into:

```text
Trophy Cabinet
Accolades
Athlete Records
```

## Backend Structure

The backend is inside `backend/` and is built with Node.js, Express, MongoDB, CORS, and dotenv.

```text
backend/
  server.js
  package.json
  package-lock.json
  .env
  lib/
    mongo.js
  routes/
    achievements/
    clubs/
    council/
    events/
    news/
    stats/
    admin/
      achievements/
      clubs/
      council/
      events/
      login/
      news/
      stats/
```

### Backend Entry Point

`backend/server.js`

Creates the Express app, enables CORS, enables JSON request bodies, registers all public and admin API routers, adds a 404 fallback, and starts the server.

Mounted public routes:

```text
/api/clubs
/api/council
/api/events
/api/news
/api/stats
/api/achievements
```

Mounted admin routes:

```text
/api/admin/login
/api/admin/achievements
/api/admin/clubs
/api/admin/council
/api/admin/events
/api/admin/news
/api/admin/stats
```

The server listens on:

```text
process.env.PORT || 4000
```

### MongoDB Helper

`backend/lib/mongo.js`

Central MongoDB utility file. It:

```text
Reads MONGODB_URI and MONGODB_DB from environment variables.
Creates and reuses one MongoClient.
Returns the selected database with getDb().
Normalizes MongoDB _id values into frontend-friendly id fields.
Exports getDb, normalizeDoc, and normalizeArray.
```

Default values:

```text
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=sports-council
```

## Backend Endpoints

### Public Endpoints

`GET /api/stats`

File:

```text
backend/routes/stats/index.js
```

Reads the `stats` collection and returns global stats. If no document exists, it returns fallback stats:

```json
{
  "totalTeams": 15,
  "totalMembers": 500
}
```

`GET /api/clubs`

File:

```text
backend/routes/clubs/index.js
```

Reads clubs from the `clubs` collection sorted by `order`. It also reads events and can attach related event information to clubs.

`GET /api/events`

File:

```text
backend/routes/events/index.js
```

Reads events from the `events` collection sorted by date. It also reads related club data for event club references.

`GET /api/news`

File:

```text
backend/routes/news/index.js
```

Reads news items from the `news` collection sorted by `order`.

`GET /api/achievements`

File:

```text
backend/routes/achievements/index.js
```

Reads achievements from the `achievements` collection sorted by newest date first.

`GET /api/council`

File:

```text
backend/routes/council/index.js
```

Reads council members from the `councilMembers` collection sorted by `order`, then groups them by role/tier for frontend hierarchy rendering.

### Admin Endpoints

`POST /api/admin/login`

File:

```text
backend/routes/admin/login/index.js
```

Looks up an admin user in the `admins` collection by username and validates the submitted password.

`POST /api/admin/clubs`

Creates a club in the `clubs` collection.

`PUT /api/admin/clubs/:id`

Updates a club by `id`.

`DELETE /api/admin/clubs/:id`

Deletes a club by `id`.

File:

```text
backend/routes/admin/clubs/index.js
```

`POST /api/admin/events`

Creates an event in the `events` collection.

`PUT /api/admin/events/:id`

Updates an event by `id`.

`DELETE /api/admin/events/:id`

Deletes an event by `id`.

File:

```text
backend/routes/admin/events/index.js
```

`POST /api/admin/achievements`

Creates an achievement in the `achievements` collection.

`PUT /api/admin/achievements/:id`

Updates an achievement by `id`.

`DELETE /api/admin/achievements/:id`

Deletes an achievement by `id`.

File:

```text
backend/routes/admin/achievements/index.js
```

`POST /api/admin/news`

Creates a news item in the `news` collection.

`PUT /api/admin/news/:id`

Updates a news item by `id`.

`DELETE /api/admin/news/:id`

Deletes a news item by `id`.

File:

```text
backend/routes/admin/news/index.js
```

`POST /api/admin/council`

Creates a council member in the `councilMembers` collection.

`PUT /api/admin/council/:id`

Updates a council member by `id`.

`DELETE /api/admin/council/:id`

Deletes a council member by `id`.

File:

```text
backend/routes/admin/council/index.js
```

`PUT /api/admin/stats`

Updates the global stats document in the `stats` collection.

File:

```text
backend/routes/admin/stats/index.js
```

## Use Of Each Backend File

`backend/package.json`

Defines backend dependencies and scripts:

```text
npm run dev    starts nodemon
npm start      starts node server.js
```

`backend/package-lock.json`

Locks exact dependency versions for reproducible installs.

`backend/.env`

Stores local backend environment variables such as `MONGODB_URI` and `MONGODB_DB`. This file should not be committed with real secrets.

`backend/server.js`

Main Express server. Registers middleware, public routes, admin routes, 404 handler, and starts the HTTP listener.

`backend/lib/mongo.js`

MongoDB connection and response normalization helper used by all route files.

`backend/routes/stats/index.js`

Public stats read endpoint.

`backend/routes/clubs/index.js`

Public clubs read endpoint.

`backend/routes/events/index.js`

Public events read endpoint.

`backend/routes/news/index.js`

Public news read endpoint.

`backend/routes/achievements/index.js`

Public achievements read endpoint.

`backend/routes/council/index.js`

Public council hierarchy read endpoint.

`backend/routes/admin/login/index.js`

Admin login endpoint.

`backend/routes/admin/stats/index.js`

Admin stats update endpoint.

`backend/routes/admin/clubs/index.js`

Admin club create, update, and delete endpoints.

`backend/routes/admin/events/index.js`

Admin event create, update, and delete endpoints.

`backend/routes/admin/news/index.js`

Admin news create, update, and delete endpoints.

`backend/routes/admin/achievements/index.js`

Admin achievement create, update, and delete endpoints.

`backend/routes/admin/council/index.js`

Admin council member create, update, and delete endpoints.

## Running Locally

Install dependencies:

```bash
npm --prefix frontend install
npm --prefix backend install
```

Start both apps from the project root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

## Deployment Notes

Frontend production build:

```bash
npm --prefix frontend run build
```

Vite outputs static files to:

```text
frontend/dist
```

For Netlify, this project includes:

```text
frontend/public/_redirects
netlify.toml
```

These make React Router routes such as `/admin`, `/clubs`, `/events`, and `/achievements` work after deployment.

Backend deployment requires these environment variables:

```env
MONGODB_URI=<mongodb connection string>
MONGODB_DB=sports-council
```
