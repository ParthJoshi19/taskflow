# Task Management App

A full-stack task management application with organization, user, and task management features. The backend is built with Node.js and Express, and the frontend uses React with Vite.

---

## Project Structure

```
backend/
  controller/         # Express controllers for organizations, tasks, users
  db/                 # Database connection
  models/             # Mongoose models (Organization, Task, User)
  routes/             # Express routes
  package.json        # Backend dependencies and scripts
  server.js           # Entry point for backend server

frontend/
  src/
    auth/             # Login and Register components
    components/       # Reusable UI components
    dashboard/        # Dashboard pages (Tasks, Members, Settings)
    lib/              # Utility functions
    App.tsx           # Main React component
    main.tsx          # React entry point
  public/             # Static assets
  package.json        # Frontend dependencies and scripts
  vite.config.ts      # Vite configuration
  index.html          # HTML template
```

---

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

---

## Backend Setup

1. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Configure your database connection in `db/db.js` (default: MongoDB).
4. Start the backend server:
   ```powershell
   npm start
   ```
   The backend will run on [http://localhost:3000](http://localhost:3000) by default.

---

## Frontend Setup

1. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## Features
- User authentication (register, login)
- Organization management
- Task management (CRUD)
- Member management
- Dashboard with settings

---

## Scripts

### Backend
- `npm start` — Start the backend server
- `npm run dev` — Start backend with nodemon (if configured)

### Frontend
- `npm run dev` — Start the frontend dev server
- `npm run build` — Build the frontend for production
- `npm run preview` — Preview the production build

---

## License
MIT
