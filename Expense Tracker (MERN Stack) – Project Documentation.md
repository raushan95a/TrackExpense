# Expense Tracker (MERN Stack) – Project Documentation

*Version 1.0 · Full-stack web application using MongoDB, Express.js, React and Node.js*

## 1. Project Overview

**Expense Tracker** is a full-stack web application that lets users record daily expenses and income, organise them by category, set monthly budgets, and understand their spending through summaries and charts. Data is stored in MongoDB and each user's data is private behind JWT-based authentication.

**Goals**

- Make adding an expense take under 10 seconds.
- Give users a clear picture of where money goes (by category, by month).
- Practise a complete MERN workflow: REST API design, authentication, database modelling, state management, charts and deployment.

**Target users:** students, individuals and families who want a simple personal finance tool.

## 2. Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-1 | User can register with name, email and password | Must |
| FR-2 | User can log in and log out securely (JWT) | Must |
| FR-3 | User can add a transaction (amount, type, category, date, note) | Must |
| FR-4 | User can view all their transactions in a paginated list | Must |
| FR-5 | User can edit and delete a transaction | Must |
| FR-6 | User can filter by date range, category, type, and search by note | Must |
| FR-7 | Dashboard shows total income, total expense and balance for the selected month | Must |
| FR-8 | Dashboard shows category-wise breakdown (pie chart) and monthly trend (bar/line chart) | Should |
| FR-9 | User can create custom categories | Should |
| FR-10 | User can set a monthly budget per category and see a warning when exceeded | Should |
| FR-11 | User can export transactions to CSV | Could |
| FR-12 | Recurring transactions (rent, subscriptions) | Could |
| FR-13 | Dark/light theme | Could |
| FR-14 | User can update profile and change password | Should |

### 2.2 Non-Functional Requirements

- **Security:** passwords hashed with bcrypt, JWT auth, input validation, CORS restricted, rate limiting, Helmet headers.
- **Performance:** list API responds in under 500 ms for 10,000 records (indexed queries, pagination).
- **Usability:** responsive design (mobile, tablet, desktop); form validation messages are clear.
- **Reliability:** consistent error format from the API; no data loss on refresh.
- **Maintainability:** modular folder structure, ESLint + Prettier, meaningful commit messages.
- **Accuracy:** money stored as integer minor units (paise/cents) to avoid floating-point errors.

### 2.3 Assumptions and Constraints

- Single currency per user (default INR, configurable in profile).
- Web only (responsive); no native mobile app.
- Runs on Node.js 18+ LTS.

## 3. Tech Stack

### 3.1 Core (MERN)

| Layer | Technology | Purpose |
| --- | --- | --- |
| Database | **MongoDB** (Atlas for production) | Document storage |
| Backend framework | **Express.js** | REST API, routing, middleware |
| Frontend library | **React** (Vite) | UI components |
| Runtime | **Node.js** | Server-side JavaScript |

### 3.2 Backend Libraries

| Package | Use |
| --- | --- |
| mongoose | ODM, schemas, validation |
| jsonwebtoken | Issue and verify JWTs |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin control |
| helmet | Secure HTTP headers |
| express-rate-limit | Brute-force protection |
| express-validator (or zod) | Request validation |
| morgan | HTTP request logging |
| cookie-parser | If using httpOnly cookie for tokens |
| nodemon | Dev auto-restart |
| jest + supertest | API testing |

### 3.3 Frontend Libraries

| Package | Use |
| --- | --- |
| react-router-dom | Client-side routing |
| axios | HTTP client with interceptors |
| Redux Toolkit **or** Context API + useReducer | State management |
| react-hook-form + zod | Forms and validation |
| recharts (or Chart.js) | Pie, bar and line charts |
| Tailwind CSS (or Material UI) | Styling |
| react-hot-toast | Notifications |
| date-fns | Date handling |
| vitest + React Testing Library | Frontend tests |

### 3.4 Tools

- **Git + GitHub** for version control
- **VS Code** editor with ESLint and Prettier extensions
- **Postman / Thunder Client** for API testing
- **MongoDB Compass** to inspect data
- **Deployment:** Render or Railway (API), Vercel or Netlify (client), MongoDB Atlas (DB)

## 4. System Architecture

```
┌──────────────┐   HTTPS / JSON   ┌────────────────┐   Mongoose   ┌───────────┐
│ React client │ ───────────────► │ Express + Node │ ───────────► │  MongoDB  │
│ (Vite, SPA)  │ ◄─────────────── │   REST API     │ ◄─────────── │  (Atlas)  │
└──────────────┘   JWT in header  └────────────────┘              └───────────┘
```

**Pattern:** three-tier. The backend follows **Route → Controller → Service/Model**, with middleware for auth, validation and error handling.

## 5. Database Design (MongoDB)

### 5.1 Collections

**users**

| Field | Type | Notes |
| --- | --- | --- |
| \_id | ObjectId |  |
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | bcrypt hash, `select: false` |
| currency | String | default `INR` |
| createdAt / updatedAt | Date | timestamps |

**categories**

| Field | Type | Notes |
| --- | --- | --- |
| \_id | ObjectId |  |
| user | ObjectId (ref users) | null for system defaults |
| name | String | required |
| type | `expense` or `income` |  |
| icon / color | String | optional UI hints |

**transactions**

| Field | Type | Notes |
| --- | --- | --- |
| \_id | ObjectId |  |
| user | ObjectId (ref users) | required, indexed |
| type | `expense` or `income` | required |
| amount | Number | integer in minor units, > 0 |
| category | ObjectId (ref categories) | required |
| date | Date | default today, indexed |
| note | String | max 200 chars |
| createdAt / updatedAt | Date |  |

**budgets**

| Field | Type | Notes |
| --- | --- | --- |
| \_id | ObjectId |  |
| user | ObjectId | required |
| category | ObjectId | required |
| month | String | format `YYYY-MM` |
| limit | Number | minor units |

### 5.2 Indexes

- `transactions`: compound index `{ user: 1, date: -1 }`
- `users`: unique index on `email`
- `budgets`: unique compound index `{ user: 1, category: 1, month: 1 }`

### 5.3 Example Mongoose Schema

```js
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  amount: { type: Number, required: true, min: 1 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, default: Date.now },
  note: { type: String, maxlength: 200, trim: true }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
```

## 6. REST API Design

Base URL: `/api/v1`. All routes except register and login require the header `Authorization: Bearer <token>`.

### 6.1 Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /auth/register | Create account |
| POST | /auth/login | Returns JWT and user |
| GET | /auth/me | Current user |
| PUT | /auth/profile | Update name/currency |
| PUT | /auth/password | Change password |

### 6.2 Transactions

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /transactions | Create |
| GET | /transactions | List with `page`, `limit`, `from`, `to`, `category`, `type`, `q` |
| GET | /transactions/:id | Single record |
| PUT | /transactions/:id | Update |
| DELETE | /transactions/:id | Delete |
| GET | /transactions/export | CSV download |

### 6.3 Categories

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /categories | Defaults plus user's own |
| POST | /categories | Create custom category |
| PUT | /categories/:id | Rename/edit |
| DELETE | /categories/:id | Delete (blocked if in use) |

### 6.4 Budgets

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /budgets?month=YYYY-MM | Budgets with spent amount |
| POST | /budgets | Create or update a budget |
| DELETE | /budgets/:id | Remove |

### 6.5 Analytics

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /analytics/summary?month=YYYY-MM | Total income, expense, balance |
| GET | /analytics/by-category?month=YYYY-MM | Spend per category |
| GET | /analytics/monthly?year=YYYY | Month-wise totals for charts |

These use MongoDB aggregation pipelines (`$match`, `$group`, `$lookup`, `$sort`).

### 6.6 Standard Response Format

```json
// success
{ "success": true, "data": { }, "message": "Transaction created" }

// error
{ "success": false, "message": "Validation failed", "errors": [{ "field": "amount", "msg": "Must be greater than 0" }] }
```

**HTTP status codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests, 500 Server Error.

## 7. Authentication and Security

1. **Register:** validate input, hash password with bcrypt (salt rounds 10–12), save user, return token.
2. **Login:** find user by email, compare hash, sign JWT (`expiresIn: 7d`) containing the user id.
3. **Protected routes:** an `auth` middleware reads the token, verifies it, loads `req.user`, otherwise returns 401.
4. **Authorisation:** every query filters by `user: req.user.id`, so users can never access another user's data.
5. **Hardening:** Helmet, CORS allow-list, rate limit on `/auth/*` (e.g. 10 requests per 15 min), request body size limit, sanitise inputs (`express-mongo-sanitize`), never log passwords or tokens.
6. **Token storage on the client:** simplest is `localStorage`; more secure is an httpOnly cookie. Pick one and stay consistent.

## 8. Frontend Design

### 8.1 Pages and Routes

| Route | Page | Access |
| --- | --- | --- |
| /login, /register | Auth forms | Public |
| / | Dashboard | Private |
| /transactions | History with filters | Private |
| /transactions/new, /transactions/:id/edit | Add/Edit form | Private |
| /budgets | Budget manager | Private |
| /categories | Category manager | Private |
| /profile | Profile and password | Private |

### 8.2 Main Components

- `Navbar`, `Sidebar`, `ProtectedRoute`
- `SummaryCards` (Income, Expense, Balance)
- `CategoryPieChart`, `MonthlyBarChart`
- `TransactionForm`, `TransactionTable`, `TransactionFilters`, `Pagination`
- `BudgetProgressBar`
- `ConfirmModal`, `Loader`, `EmptyState`

### 8.3 State Management

- **Auth state:** user and token (Context or Redux slice).
- **Server data:** transactions, categories, analytics. Fetch with axios and store in Redux, or use React Query for caching.
- An axios interceptor attaches the token to every request and redirects to login on a 401.

### 8.4 UX Guidelines

- Add-expense form: amount field autofocused, today's date prefilled, category as a dropdown.
- Show loading spinners, empty states and toast messages for success or failure.
- Confirm before deleting.
- Fully responsive; tables collapse into cards on mobile.

## 9. Folder Structure

```
expense-tracker/
├── client/                     # React (Vite)
│   ├── src/
│   │   ├── api/                # axios instance + API functions
│   │   ├── components/         # reusable UI
│   │   ├── context/ or store/  # auth + app state
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/              # formatters (money, date)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/                     # Node + Express
│   ├── src/
│   │   ├── config/             # db.js, env
│   │   ├── controllers/
│   │   ├── middleware/         # auth, error, validate
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/           # business logic, aggregations
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## 10. Environment Variables

**server/.env**

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**client/.env**

```
VITE_API_URL=http://localhost:5000/api/v1
```

Never commit `.env` files. Provide `.env.example` instead.

## 11. Setup and Installation

**Prerequisites:** Node.js 18+, npm, MongoDB (local or Atlas account), Git.

```bash
# 1. Clone
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker

# 2. Backend
cd server
npm install
cp .env.example .env     # then fill in values
npm run dev              # http://localhost:5000

# 3. Frontend (new terminal)
cd client
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

**Starter commands for a fresh project**

```bash
mkdir expense-tracker && cd expense-tracker
mkdir server && cd server && npm init -y
npm i express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken express-rate-limit express-validator
npm i -D nodemon jest supertest
cd .. && npm create vite@latest client -- --template react
cd client && npm i axios react-router-dom react-hook-form zod recharts react-hot-toast date-fns
```

**Scripts (server/package.json)**

```json
"scripts": { "start": "node src/server.js", "dev": "nodemon src/server.js", "test": "jest" }
```

## 12. Application Workflow

### 12.1 User Flow

1. User opens the app and registers or logs in.
2. Default categories (Food, Transport, Rent, Bills, Shopping, Health, Entertainment, Salary, Other) are available.
3. User adds a transaction through the form.
4. API validates the data and saves it in MongoDB.
5. Dashboard refreshes and shows updated totals and charts.
6. User browses history, filters, edits or deletes entries.
7. User sets budgets, and progress bars turn red when spending crosses the limit.
8. User exports CSV or logs out.

### 12.2 Request Lifecycle (Add Expense)

```
React form submit
  → zod/react-hook-form validation
  → axios POST /transactions (with JWT)
  → Express: rate limit → auth middleware → validator → controller
  → Mongoose saves document
  → 201 response
  → UI updates state, shows toast, refetches summary
```

### 12.3 Development Workflow

1. Create a GitHub repo and `main` branch; work in feature branches (`feature/auth`, `feature/transactions`).
2. Build backend feature, test in Postman, then build the matching UI.
3. Commit small and often with clear messages (e.g. `feat: add transaction CRUD API`).
4. Open a pull request, review, merge.
5. Deploy after each milestone.

## 13. Implementation Roadmap

| Phase | Tasks | Estimate |
| --- | --- | --- |
| 1. Setup | Repos, folders, DB connection, ESLint/Prettier, base Express server | 0.5 day |
| 2. Auth | User model, register/login, JWT middleware, React auth pages, protected routes | 1.5 days |
| 3. Transactions | Model, CRUD API, form, list, edit/delete | 2 days |
| 4. Categories | Defaults seeding, custom categories | 1 day |
| 5. Filters and pagination | Query params, UI filters | 1 day |
| 6. Dashboard | Aggregation APIs, cards, charts | 2 days |
| 7. Budgets | Model, API, progress UI | 1 day |
| 8. Polish | Validation, error handling, responsive UI, CSV export | 1.5 days |
| 9. Testing | API tests, a few component tests | 1 day |
| 10. Deployment | Atlas, Render/Railway, Vercel, README, screenshots | 0.5 day |

Total is about 12 working days for the full scope, or roughly 5 days for the Must-have features only.

## 14. Testing Plan

- **Unit tests:** helper functions (money formatting, date ranges).
- **API tests (Jest + Supertest):** register, login, rejection of unauthenticated requests, transaction CRUD, user isolation (user A cannot read user B's data).
- **Frontend tests:** form validation, protected route redirect, rendering of summary cards.
- **Manual test checklist:** add, edit and delete an expense; filter by date; invalid amount; expired token; mobile layout; empty states.

## 15. Deployment

1. **Database:** create a free MongoDB Atlas cluster, add a database user, allow the host's IP (or 0.0.0.0/0 for a student project), copy the connection string.
2. **Backend (Render or Railway):** connect GitHub repo, root directory `server`, build `npm install`, start `npm start`, set the env variables from section 10.
3. **Frontend (Vercel or Netlify):** root directory `client`, build `npm run build`, output `dist`, set `VITE_API_URL` to the deployed API URL.
4. Update `CLIENT_URL` on the server to the deployed frontend URL so CORS works.
5. Smoke-test register, login and add-expense on the live site.

## 16. Sample README Skeleton

Use this in the repository's `README.md`:

```
# Expense Tracker
A MERN stack app to track income and expenses with budgets and charts.

## Features
- JWT authentication
- Add/edit/delete transactions
- Category management and monthly budgets
- Dashboard with charts
- CSV export

## Tech Stack
MongoDB, Express, React (Vite), Node.js, Tailwind, Recharts

## Getting Started
(see Setup section)

## API Documentation
(link or table of endpoints)

## Screenshots
(add images)

## Live Demo
<url>

## Author
<your name>
```

## 17. Future Enhancements

- Recurring transactions with a cron job (node-cron)
- Receipt image upload (Multer + Cloudinary)
- Multi-currency with exchange rates
- Email or push budget alerts
- Shared/family accounts
- OAuth login (Google)
- PWA support for offline use
- Swagger/OpenAPI docs

## 18. Common Pitfalls to Avoid

- Storing money as floating-point numbers (use integers in minor units).
- Forgetting to filter queries by `user`, which leaks data between users.
- Committing `.env` or secrets to GitHub.
- Not paginating the transactions list.
- Timezone bugs when grouping by month; store dates in UTC and convert on the client.
- Missing CORS configuration after deployment.

## 19. Glossary

- **MERN:** MongoDB, Express, React, Node.
- **JWT:** JSON Web Token, a signed token proving identity.
- **ODM:** Object Document Mapper (Mongoose).
- **Aggregation pipeline:** MongoDB's multi-stage data processing for summaries.
- **SPA:** Single Page Application.
