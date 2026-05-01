import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, ClipboardList, TrendingUp, BookOpen, GraduationCap } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import Assignments from './pages/Assignments'
import Grades from './pages/Grades'
import Resources from './pages/Resources'

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/schedule', icon: CalendarDays, label: 'Schedule' },
  { path: '/assignments', icon: ClipboardList, label: 'Assignments' },
  { path: '/grades', icon: TrendingUp, label: 'Grades' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
]

function Sidebar() {
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0D1B38',
      borderRight: '1px solid #1A2D52', display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #1A2D52' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#FFD60A', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={20} color="#050D1F" />
          </div>
          <div>
            <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, fontWeight: 700, color: '#FFFCE8' }}>StudyOS</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>Student Dashboard</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} end={path === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, marginBottom: 4,
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s',
              background: isActive ? 'rgba(255,214,10,0.12)' : 'transparent',
              color: isActive ? '#FFD60A' : '#9CA3AF',
              borderLeft: isActive ? '3px solid #FFD60A' : '3px solid transparent',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #1A2D52' }}>
        <div style={{ fontSize: 11, color: '#3B5280' }}>Semester · Spring 2025</div>
      </div>
    </aside>
  )
}

function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', padding: '32px 36px', maxWidth: 'calc(100vw - 220px)' }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
