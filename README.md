<div align="center">

<img src="https://github.com/user-attachments/assets/bf5d6c45-9b52-47e8-9e32-93a9e5635634" alt="PlaceWell Logo" width="220"/>

# PlaceWell

### Data-Driven Placement Intelligence & Peer Interview Experience Platform

</div>

> 
> *Empowering students with structured company intelligence, aggregated role analytics, topic frequency insights, and verified peer interview experiences.*

---

## The MedMax Crew

- Vatsalkumar Satishkumar Shah
- Shah Aagam Alpesh
- Sonigara Jainam Ritesh
- Aman Nagpal
- Nayan Jain
- Pari Tibrewal

## Check it Out
- Live Deployed Platform: https://frontend-five-ruddy-22.vercel.app/
- Demo Video: https://youtu.be/jK6VSKn2trc

## 1. Project Title & Overview

- **Project Name:** PlaceWell
- **Tagline:** Turn scattered campus interview experiences into actionable placement intelligence.
- **Elevator Pitch:** PlaceWell is an end-to-end placement intelligence platform designed to replace unorganized chat groups and scattered blog posts. By aggregating interview experiences, breakdown of round structures, selection outcome ratios, and topic frequencies, PlaceWell provides students with data-backed insights to ace technical interviews while protecting contributor privacy through optional public anonymity.

---

## 2. Problem Statement

* **The Problem:** Students preparing for campus placements and off-campus roles rely on fragmented, unverified experience posts across social media and messaging platforms.
* **Target Audience:** College candidates, job seekers, university placement cells, and alumni mentors.
* **Why it Matters:** Preparing for company interviews without knowing specific round patterns, question difficulties, or topic frequency distributions leads to wasted preparation time and high anxiety.
* **Limitations of Existing Solutions:**
  * Generic glassdoor-style reviews lack granular technical round details (OA vs Tech vs SysDesign).
  * No interactive topic filtering (e.g., filtering questions specifically on Dynamic Programming or System Design).
  * Lack of strict privacy safeguards preventing students/alumni from sharing honest salary package and interview feedback.

---

## 3. Our Solution

PlaceWell aggregates raw interview experiences into actionable, interactive visual dashboards and structured question banks.

### Key Differentiators
1. **Aggregated Role Analytics:** Real-time calculation of selection outcome ratios, difficulty distributions, and round sequence breakdowns directly from database entries.
2. **Interactive Topic-Based Question Filtering:** Instantly filter real company interview questions by specific topics (e.g., Arrays, Operating Systems, Trees).
3. **Anonymity Control:** Flexible public anonymity options allowing contributors to share honest reviews without exposing personal identity.

### Main User Journey Flow

```
User → React Vite Frontend → Express REST API → Auth0 & Prisma ORM → Supabase PostgreSQL → Aggregated Response → React UI
```

---

## 4. Key Features

### 🌟 Core & User-Facing Features
* **Role Details & Analytics Hub:** Explore specific roles (e.g., Software Engineer at Microsoft) with live visual analytics:
  * **Selection Outcome Donut Chart:** Visual breakdown of Selected vs. Rejected percentages with interactive hover segment inspection.
  * **Difficulty Rating Distribution:** 5-star rating breakdown across real candidate submissions.
  * **Round Structure Breakdown:** Step-by-step breakdown of OA, Technical, HR, and System Design rounds.
  * **Topic Frequency Bar Chart:** Visual rank of topics asked by company interviewers with click-to-filter capability.
* **Interview Experience Feed & Search:** Filter experiences by company, role title, difficulty, or outcome.
* **Multi-Step Experience Submission:** Structured form allowing candidates to add round-by-round details, platform used, difficulty ratings, questions asked, and topic tags.
* **Verified Alumni Profiles:** Public profile views highlighting alumni contributions while respecting anonymity preferences.
* **Curated Resources & Skill Maps:** Skill-linked preparation guides and learning resources mapped directly to candidate profiles.

### 🔐 Authentication & Security
* **Auth0 Integration:** Enterprise-grade single sign-on supporting OAuth authentication.
* **Role-Based API Protection:** Public read-only access for discovery endpoints with JWT authorization middleware for write actions.

---

## 5. System Architecture

PlaceWell follows a modern **Decoupled Architecture**:

* **Frontend:** Built with React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, and state managed by React Context API (`PlaceWellContext`).
* **Backend:** Express.js Web Server in ES Module (`import/export`) syntax, organized into route-controller-service layers.
* **Database:** Managed PostgreSQL on Supabase, queried exclusively via **Prisma ORM v7**.
* **Authentication:** Managed by Auth0 with Bearer token headers and custom user sync controllers.

### Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Frontend)"]
        User["User Browser"] --> ReactApp["React 18 + Vite SPA"]
        ReactApp --> Context["PlaceWellContext State"]
        ReactApp --> Charts["Custom SVG Analytics Charts"]
    end

    subgraph Auth ["Identity Layer"]
        ReactApp <--> Auth0["Auth0 Identity Provider"]
    end

    subgraph Server ["Server Layer (Backend)"]
        ReactApp --> API["Express.js REST API (/api/v1)"]
        API --> AuthMiddleware["Auth0 / Bearer Auth Middleware"]
        AuthMiddleware --> Controllers["Controllers (Company, Experience, Topic, User)"]
    end

    subgraph Data ["Data Layer"]
        Controllers --> Prisma["Prisma ORM v7"]
        Prisma <--> PostgreSQL[("Supabase PostgreSQL DB")]
    end
```

---

## 6. Detailed Application Flow

### Request Lifecycle (Experience Submission to DB)

```
1. User completes Experience Submission Form
   ↓
2. Frontend sends POST /api/v1/experiences with Authorization header
   ↓
3. Express Middleware verifies token & attaches user context
   ↓
4. ExperienceController parses experience details, rounds, and nested questions
   ↓
5. Prisma ORM executes atomic database transaction
   ↓
6. PostgreSQL inserts records across interview_experiences, rounds, questions, & junction tables
   ↓
7. Backend serializes BigInt fields to JSON and returns 201 Created
   ↓
8. PlaceWellContext updates client state & navigates user to feed
```

---

## 7. Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 (TypeScript) | Declarative component UI |
| **Build Tool** | Vite | Rapid HMR & production bundler |
| **Styling** | Tailwind CSS & Vanilla CSS | Responsive design tokens & custom animations |
| **Icons** | Lucide React | Modern iconography |
| **Backend** | Node.js + Express.js (ESM) | Scalable REST API web server |
| **Database** | Supabase (PostgreSQL) | Relational database storage |
| **ORM** | Prisma ORM v7 | Strongly-typed SQL query builder & schema management |
| **Authentication** | Auth0 | Managed OAuth 2.0 / OpenID Connect |

---

## 8. Repository Structure

```text
placeWell/
├── backend/
│   ├── index.js                     # Express app entrypoint & middleware setup
│   ├── package.json                 # Backend dependencies & ESM configuration
│   ├── prisma/
│   │   └── schema.prisma            # Database schema models & relationships
│   └── src/
│       ├── config/
│       │   └── prisma.js            # Prisma client instance
│       ├── controllers/
│       │   ├── AuthController.js    # Auth & user sync controller
│       │   ├── CompanyController.js # Company & role analytics controllers
│       │   ├── ExperienceController.js # Experience CRUD & nested query handlers
│       │   ├── TopicController.js   # Topics, skills, resources, & questions handlers
│       │   └── UserController.js    # Profile & user skills handlers
│       ├── Middleware/
│       │   ├── Auth.js              # Token validation & public route whitelist
│       │   └── errorHandler.js      # Global error handling middleware
│       ├── routes/
│       │   ├── Auth.js
│       │   ├── Company.js
│       │   ├── Experience.js
│       │   ├── Topic.js
│       │   └── User.js
│       └── utils/
│           └── response.js          # BigInt serializer utility
│
├── frontend/
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.ts               # Vite configuration & API proxy rules
│   └── src/
│       ├── assets/                  # Brand assets (logo.png)
│       ├── components/
│       │   ├── layout/              # Navbar & Footer components
│       │   └── ui/                  # Cards, Badges, & SVG Charts
│       ├── context/
│       │   └── PlaceWellContext.tsx # Central application state & API fetchers
│       ├── pages/
│       │   ├── AlumniDetailsPage.tsx
│       │   ├── CompaniesPage.tsx
│       │   ├── CompanyDetailsPage.tsx
│       │   ├── FeedPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── RoleDetailsPage.tsx  # Role intelligence & interactive filter page
│       │   └── SubmitExperiencePage.tsx
│       ├── services/                # API client functions
│       │   └── companyApi.ts
│       ├── types/
│       │   └── database.ts          # TypeScript type definitions
│       └── data/
│           └── initialData.ts       # Fallback initial state
└── README.md
```

---

## 9. Prerequisites

Before installing, ensure you have the following installed:
* **Node.js:** v18.x or v20.x (v24 compatible)
* **npm:** v9.x or higher
* **Git:** Installed on system
* **PostgreSQL / Supabase Account:** For database hosting
* **Auth0 Account:** For authentication tenant setup

---

## 10. Environment Variables

### Backend Environment Variables (`backend/.env`)

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Connection URLs (Supabase / PostgreSQL)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Auth0 Configuration
AUTH0_SECRET="your-long-random-secret-key"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_ISSUER_BASE_URL="https://your-tenant.us.auth0.com"
```

### Frontend Environment Variables (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

---

## 11. Installation & Setup

### Step 1 — Clone Repository
```bash
git clone https://github.com/aagam2166/placeWell.git
cd placeWell
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
```
Configure your `backend/.env` file with your database and Auth0 credentials.

### Step 3 — Database Setup & Prisma Client
```bash
# Generate Prisma Client
npx prisma generate

# Apply Schema Migrations (if applicable)
npx prisma db push
```

### Step 4 — Setup Frontend
```bash
cd ../frontend
npm install
```
Configure your `frontend/.env` file.

### Step 5 — Run Development Servers

**Run Backend:**
```bash
cd backend
node index.js
# Backend starts at http://localhost:3000
```

**Run Frontend:**
```bash
cd frontend
npm run dev
# Frontend starts at http://localhost:5173
```

---

## 12. Database Schema (Entity-Relationship)

```mermaid
erDiagram
    users ||--o{ interview_experiences : submits
    users ||--o{ user_skills : possesses
    companies ||--o{ interview_experiences : targets
    companies ||--o{ company_skills : requires
    interview_experiences ||--o{ rounds : contains
    interview_experiences ||--o{ resources : attaches
    rounds ||--o{ questions : includes
    rounds ||--o{ round_topics : covers
    questions ||--o{ question_topics : tagged_with
    skills ||--o{ topics : categorizes
    skills ||--o{ user_skills : rated_by
    skills ||--o{ company_skills : demanded_by
    skills ||--o{ skill_resources : maps_to
    resources ||--o{ skill_resources : linked_to
    topics ||--o{ round_topics : mapped_to
    topics ||--o{ question_topics : mapped_to
```

---

## 13. API Documentation

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | No | List companies with search & skill filters |
| `GET` | `/api/companies/:id/roles/:role/analytics` | No | Live aggregated role intelligence analytics |
| `GET` | `/api/v1/experiences` | No | List interview experiences with round details |
| `POST` | `/api/v1/experiences` | Yes | Submit new interview experience with rounds & questions |
| `GET` | `/api/v1/topics` | No | List all topic categories & skill relations |
| `GET` | `/api/v1/skills` | No | List all technology & CS skills |
| `GET` | `/api/v1/questions` | No | List interview question bank |
| `GET` | `/api/v1/resources` | No | List preparation resources & guide mappings |
| `GET` | `/api/v1/user-skills` | No | List user skill proficiency ratings |

---

## 14. Deployment Strategy

* **Frontend Hosting:** Vercel (recommended)
* **Backend Hosting:** Render / Railway Node.js Service
* **Database:** Supabase Managed PostgreSQL
* **Production Status:** Ready for deployment setup

---

## 15. Team & Acknowledgements

### Contributions
* **PlaceWell Development Team:** Fullstack engineering, schema design, API development, and UI/UX implementation.

### Acknowledgements
* **Supabase & Prisma:** Database connection pooling & TypeScript ORM runtime.
* **Auth0:** OAuth 2.0 authentication infrastructure.
* **Lucide & Tailwind CSS:** Visual UI components & typography design.

---

## 26. Quick Start Commands

For experienced developers to launch locally in 2 steps:

```bash
# Terminal 1 — Backend
cd backend && npm install && npx prisma generate && node index.js

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```
