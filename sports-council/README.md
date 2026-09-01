# SRM Sports Council

Official sports council management platform for SRM University AP. A full-stack web application for managing clubs, events, achievements, council hierarchy, news, and student registrations — with an AI-powered chatbot.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, SWR, React Router 6 |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL 16 + pgvector |
| **AI Chatbot** | Ollama (nomic-embed-text + deepseek-r1:1.5b) |
| **Testing** | Vitest, React Testing Library, jsdom |

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌────────────┐
│  Frontend    │ ──→ │  Backend (Port    │ ──→ │ PostgreSQL │
│  (Vite/React)│     │  4000, Express)   │     │  + pgvector│
│  :3000        │     │                   │     └────────────┘
└──────────────┘     │  /api/clubs        │     ┌────────────┐
                     │  /api/events       │ ──→ │  Ollama    │
Deployed via:        │  /api/chat         │     │ (RAG)      │
Netlify + Render     │  /api/admin/*      │     └────────────┘
                     │  /api/auth/*       │
                     └──────────────────┘
```

## Features

### Public Pages
- **Home** — hero section, news carousel, council hierarchy, about section
- **Clubs** — club grid with detail modals (leadership, roster, achievements, gallery)
- **Events** — live/upcoming/past tabs, search, filters, pagination
- **Achievements** — trophy cabinet, accolades, records with sport/year/category filters
- **Chatbot** — RAG-powered AI assistant (requires Ollama)

### Admin Panel (`/admin/login`)
- **Dashboard** — summary cards for clubs, events, achievements, stats
- **Clubs** — CRUD with achievements list, gallery, players, convenor/coach fields
- **Events** — CRUD with date picker, time, venue, registration link, stage
- **Achievements** — CRUD with category, sport, date
- **News** — CRUD with headline, image, display order
- **Council** — CRUD with tier (DIRECTOR → STUDENT_BODY), order, photo
- **Stats** — total teams and members

### Auth & Registration
- User signup/signin (`/api/auth`)
- Club registration form (Join a Club) → `/api/registrations`
- Club join requests → `/api/clubs/join`

## Project Structure

```
sports-council/
├── package.json              # Workspace root
├── netlify.toml              # Netlify deployment config
├── render.yaml               # Render blueprint config
│
├── frontend/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── public/
│   │   ├── _redirects        # SPA routing for Netlify
│   │   └── images/
│   └── src/
│       ├── App.jsx           # Routes and layout
│       ├── lib/api.js        # SWR fetcher with VITE_API_BASE_URL
│       ├── components/       # 16 components
│       │   ├── Navbar, Hero, ClubsGrid, ClubModal
│       │   ├── EventsList, Hierarchy, AchievementsGallery
│       │   ├── ChatBot, AuthModal, AuthProvider
│       │   ├── ClubRegistrationForm
│       │   ├── AdminModal, ConfirmModal
│       │   └── ThemeProvider, Notification
│       ├── pages/admin/      # 9 admin page files
│       └── tests/            # 14 test files, 98 tests
│
├── backend/
│   ├── server.js             # Entry point
│   ├── schema.sql            # Full DB schema (11 tables)
│   ├── schema-rag.sql        # pgvector chunks table
│   ├── vitest.config.js
│   ├── lib/
│   │   ├── pg.js             # PostgreSQL pool + camelCase helper
│   │   ├── rag.js            # Ollama embedding + generation
│   │   └── ingest.js         # Knowledge base ingestion script
│   ├── routes/
│   │   ├── clubs/            # Public GET
│   │   ├── events/           # Public GET
│   │   ├── achievements/     # Public GET
│   │   ├── council/          # Public GET
│   │   ├── news/             # Public GET
│   │   ├── stats/            # Public GET
│   │   ├── auth/             # POST signup/signin
│   │   ├── chat/             # POST RAG chat
│   │   ├── registrations/    # POST club registration
│   │   └── admin/            # CRUD for all entities + login
│   └── tests/                # 21 backend tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16 with pgvector extension
- Ollama (optional, for chatbot)

### Local Setup

```bash
# Clone & install
git clone https://github.com/pradnish18/SportCouncil_SRM_AP
cd sports-council
npm install

# Set up database
createdb sports_council
psql sports_council < backend/schema.sql
psql sports_council < backend/schema-rag.sql

# Seed admin user (password: password123)
psql sports_council -c "INSERT INTO admins (id, username, password, role) VALUES ('admin-1', 'admin', 'password123', 'admin')"

# Configure environment
echo "DATABASE_URL=postgresql://localhost:5432/sports_council" > backend/.env

# Start both servers
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Admin: http://localhost:3000/admin/login (admin / password123)

### Chatbot Setup (Optional)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull nomic-embed-text
ollama pull deepseek-r1:1.5b

# Ingest knowledge base
node backend/lib/ingest.js
```

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clubs` | All clubs sorted by order |
| GET | `/api/events` | All events sorted by date |
| GET | `/api/achievements` | All achievements |
| GET | `/api/news` | News items sorted by order |
| GET | `/api/council` | Council members grouped by tier |
| GET | `/api/stats` | Global stats (teams, members) |
| POST | `/api/auth/signup` | Create user account |
| POST | `/api/auth/signin` | Login user |
| POST | `/api/registrations` | Submit club registration |
| POST | `/api/clubs/join` | Join club request |
| POST | `/api/chat` | RAG chatbot query |

### Admin (all require auth)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin authentication |
| POST/PUT/DELETE | `/api/admin/clubs/:id` | Club CRUD |
| POST/PUT/DELETE | `/api/admin/events/:id` | Event CRUD |
| POST/PUT/DELETE | `/api/admin/achievements/:id` | Achievement CRUD |
| POST/PUT/DELETE | `/api/admin/news/:id` | News CRUD |
| POST/PUT/DELETE | `/api/admin/council/:id` | Council member CRUD |
| PUT | `/api/admin/stats` | Update global stats |

## Testing

```bash
# Frontend tests (98 tests)
npm --prefix frontend run test

# Backend tests (21 tests)
npm --prefix backend run test

# Watch mode
npm --prefix frontend run test:watch
```

## Deployment

### Frontend (Netlify)

```bash
npm --prefix frontend run build
# Deploy frontend/dist to Netlify
```

Environment variable: `VITE_API_BASE_URL=https://your-backend.com`

The project includes `frontend/public/_redirects` for SPA routing and `netlify.toml` for auto-deploy from GitHub.

### Backend (Render)

The project includes `render.yaml` — a [Render Blueprint](https://render.com/docs/blueprint-spec) that auto-creates:
- Node.js web service (root: `backend/`, start: `node server.js`)
- PostgreSQL 16 database with auto-injected `DATABASE_URL`

#### Manual Setup

1. Create a **Web Service** on Render:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
2. Add PostgreSQL database (Render provides connection string)
3. Set environment variables:
   - `DATABASE_URL` — from PostgreSQL
   - `PORT` — `4000`
4. Run schema after deploy:
   ```bash
   psql $DATABASE_URL < schema.sql
   psql $DATABASE_URL -c "INSERT INTO admins (id, username, password, role) VALUES ('admin-1', 'admin', 'password123', 'admin')"
   ```

## Database Schema

11 tables: `clubs`, `events`, `achievements`, `council_members`, `news`, `stats`, `admins`, `users`, `club_join_requests`, `club_registrations`, `knowledge_chunks` (pgvector).

The full schema is in `backend/schema.sql` and `backend/schema-rag.sql`.

