# SkillXchange — MERN Stack with TypeScript

A peer-to-peer skill-sharing platform where knowledge is currency. Teach what you know, learn new skills, connect through exchange requests, participate in weekly challenges, and climb the community leaderboard.

Migrated from static HTML/CSS/vanilla JS to a modern, robust **MERN stack architecture with full TypeScript support**.

---

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, React Router 7, Axios, Vite
- **Styling:** Vanilla CSS with custom design tokens, dark/light mode, CSS variables, and responsive micro-animations
- **Backend:** Node.js, Express.js, TypeScript, Express Validator, CORS
- **Database:** MongoDB with Mongoose ODM (indexed schemas)
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing

---

## 📁 Project Structure

```
├── client/                     # React + TypeScript Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── ui/             # Modal, TagsInput, SkillCard, ToastContainer
│   │   ├── context/            # AuthContext, ThemeContext, ToastContext
│   │   ├── hooks/              # useScrollAnimation
│   │   ├── pages/              # 8 fully ported pages:
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ExplorePage.tsx
│   │   │   ├── MatchPage.tsx
│   │   │   ├── CommunityPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── RequestsPage.tsx
│   │   ├── services/           # Axios API instance with JWT interceptor
│   │   ├── styles/             # styles.css (1500+ lines preserved design system)
│   │   ├── types/              # TypeScript interfaces (User, Challenge, Request, etc.)
│   │   └── utils/              # helpers, constants (matching algorithm, categories)
│   └── package.json
│
├── server/                     # Express.js + TypeScript Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection (db.ts)
│   │   ├── controllers/        # auth, user, request, challenge, discussion, notif
│   │   ├── middleware/         # auth (JWT verify), errorHandler
│   │   ├── models/             # Mongoose schemas (User, ExchangeRequest, Challenge, Discussion, Notification)
│   │   ├── routes/             # REST API routers
│   │   ├── types/              # Server TypeScript interfaces
│   │   ├── app.ts              # Express configuration & middleware
│   │   ├── server.ts           # Server entry point
│   │   └── seed.ts             # Database seeder with 8 seed users & sample data
│   └── package.json
│
├── .env.example                # Template for environment variables
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 or a MongoDB Atlas connection string

### 1. Configure Environment Variables

Create `.env` inside `server/` (or copy from `.env.example`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/skillxchange
JWT_SECRET=supersecret_skillxchange_jwt_key_2024
PORT=5000
CLIENT_URL=http://localhost:5173
```

*(Optional)* Create `.env` inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

In the **server** directory:
```bash
cd server
npm install
```

In the **client** directory:
```bash
cd client
npm install
```

### 3. Seed the Database

Run the seeder script in `server/` to populate MongoDB with initial users, challenges, discussions, and exchange requests:

```bash
cd server
npm run seed
```

---

## 🏃 Running the Application

### Start the Backend Server (Port 5000)
```bash
cd server
npm run dev
```

### Start the Frontend Client (Port 5173)
```bash
cd client
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Demo Accounts

Use any seeded user email with password `pass123`:

| Email | Name | Focus |
|-------|------|-------|
| `alex@example.com` | Alex Chen | Python, React, Machine Learning |
| `priya@example.com` | Priya Sharma | UI/UX Design, Figma, Graphic Design |
| `marcus@example.com` | Marcus Johnson | Guitar, Music Theory, Audio Production |
| `sofia@example.com` | Sofia Rodriguez | Spanish, French, Photography |
| `james@example.com` | James Park | Fitness Training, Nutrition, Yoga |
| `aisha@example.com` | Aisha Patel | Content Marketing, SEO, Creative Writing |

You can also click **"🎭 Try Demo Account"** directly on the Login page.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register a new account
- `POST /api/auth/login` — Login & receive JWT token
- `GET /api/auth/me` — Get authenticated user details (Protected)

### Users (`/api/users`)
- `GET /api/users` — Fetch all users
- `GET /api/users/:id` — Fetch user profile by ID
- `PUT /api/users/me` — Update own profile bio, location, skills (Protected)

### Exchange Requests (`/api/requests`)
- `GET /api/requests` — Fetch requests for logged-in user (Protected)
- `POST /api/requests` — Create skill exchange request (Protected)
- `PUT /api/requests/:id/accept` — Accept incoming request (Protected)
- `PUT /api/requests/:id/reject` — Decline incoming request (Protected)

### Challenges (`/api/challenges`)
- `GET /api/challenges` — List active weekly challenges
- `POST /api/challenges/:id/join` — Join a challenge (Protected)

### Discussions (`/api/discussions`)
- `GET /api/discussions` — List community discussions
- `POST /api/discussions` — Create a new discussion post (Protected)
- `POST /api/discussions/:id/upvote` — Upvote discussion

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Get user notifications (Protected)
- `PUT /api/notifications/:id/read` — Mark notification as read (Protected)

---

## 🛠️ Verification & Build Commands

- **Client typecheck & production bundle:**
  ```bash
  cd client && npm run build
  ```
- **Server typecheck & compile:**
  ```bash
  cd server && npm run build
  ```
