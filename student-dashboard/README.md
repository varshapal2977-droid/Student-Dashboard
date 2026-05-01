# 📚 StudyOS — Student Dashboard

A full-stack React + Node.js student dashboard with:
- **Course Schedule** — weekly calendar view with drag-select to add events
- **Assignment Tracker** — deadlines, priority levels, status tracking, filters
- **Grade Calculator** — what-if scenario simulator, GPA estimator
- **Resource Hub** — notes, links, syllabi organized by course

## 🛠️ Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + custom design system |
| State | Zustand (persisted to localStorage) |
| Calendar | react-big-calendar |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## 🚀 Getting Started

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Set up the server env
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Start both servers (from root)
```bash
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000

> **Note:** The frontend uses Zustand with localStorage persistence so it works standalone even without MongoDB running. The backend is ready to connect when you need real multi-user support.

---

## 📁 Project Structure
```
student-dashboard/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # Dashboard, Schedule, Assignments, Grades, Resources
│       ├── store/           # Zustand global store with sample data
│       └── styles/          # Global CSS + calendar overrides
├── server/                  # Express backend
│   ├── models/              # User, Course, Assignment, Resource
│   ├── routes/              # REST API routes
│   └── middleware/          # JWT auth guard
└── package.json             # Root scripts (concurrently)
```

---

## ✨ Features Walkthrough

### Dashboard
- Summary stats: total courses, pending/overdue assignments, estimated GPA
- Upcoming deadlines list (sorted by closest)
- Per-course assignment progress bars
- Overdue alert banner

### Schedule
- Weekly/monthly/agenda calendar views
- Color-coded by event type (class, lab, exam, study)
- Click any slot to add an event; click event to edit/delete

### Assignments
- Filter by status, priority, or course
- Mark done with one click
- Sort by deadline automatically
- Overdue highlighting

### Grade Calculator
- Add/edit score components with custom weights
- Real-time letter grade + GPA calculation
- **What-If mode** — simulate future exam scores without saving
- Overall semester GPA across all courses

### Resource Hub
- Organized by course with tab navigation
- Types: link, note, syllabus, file — each with a distinct icon
- Direct external link opener
