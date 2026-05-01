import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { format, isPast, differenceInDays, isToday } from 'date-fns'
import { AlertTriangle, CheckCircle2, Clock, BookOpen, TrendingUp, CalendarDays, ArrowRight } from 'lucide-react'

function StatCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div style={{
      background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 12,
      padding: '20px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: accent, opacity: 0.08, borderRadius: '0 0 0 80px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, fontWeight: 700, color: '#FFFCE8' }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, background: accent + '22', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={accent} />
        </div>
      </div>
    </div>
  )
}

function UpcomingItem({ assignment, courses }) {
  const course = courses.find(c => c.id === assignment.courseId)
  const days = differenceInDays(new Date(assignment.deadline), new Date())
  const urgent = days <= 2
  const today = isToday(new Date(assignment.deadline))

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', borderBottom: '1px solid #1A2D52',
    }}>
      <div style={{ width: 3, height: 36, borderRadius: 2, background: course?.color || '#FFD60A', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#FFFCE8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{assignment.title}</div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{course?.code} · {course?.name}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: urgent ? '#FF6B6B' : today ? '#FFD60A' : '#9CA3AF' }}>
          {today ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d left`}
        </div>
        <div style={{ fontSize: 11, color: '#3B5280', marginTop: 1 }}>{format(new Date(assignment.deadline), 'MMM d')}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { courses, assignments, events, grades } = useStore()

  const pending = assignments.filter(a => a.status !== 'done')
  const done = assignments.filter(a => a.status === 'done')
  const overdue = pending.filter(a => isPast(new Date(a.deadline)))
  const upcoming = pending
    .filter(a => !isPast(new Date(a.deadline)))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5)

  // GPA calc
  const scoreToGPA = (pct) => {
    if (pct >= 90) return 4.0
    if (pct >= 80) return 3.0
    if (pct >= 70) return 2.0
    if (pct >= 60) return 1.0
    return 0.0
  }

  let totalWeighted = 0, totalCredits = 0
  grades.forEach(g => {
    const course = courses.find(c => c.id === g.courseId)
    const credits = course?.credits || 3
    const scored = g.components.filter(c => c.scored !== null)
    if (scored.length === 0) return
    const totalWeight = scored.reduce((s, c) => s + c.weight, 0)
    const pct = scored.reduce((s, c) => s + (c.scored / c.max) * (c.weight / totalWeight) * 100, 0)
    totalWeighted += scoreToGPA(pct) * credits
    totalCredits += credits
  })
  const gpa = totalCredits > 0 ? (totalWeighted / totalCredits).toFixed(2) : 'N/A'

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 30, fontWeight: 700, color: '#FFFCE8' }}>
          Good morning 👋
        </h1>
        <p style={{ color: '#6B7280', marginTop: 4 }}>{format(new Date(), 'EEEE, MMMM d yyyy')} · Let's get studying.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Courses" value={courses.length} sub="This semester" accent="#FFD60A" icon={BookOpen} />
        <StatCard label="Pending" value={pending.length} sub={`${overdue.length} overdue`} accent="#FF6B6B" icon={Clock} />
        <StatCard label="Completed" value={done.length} sub="Assignments done" accent="#06D6A0" icon={CheckCircle2} />
        <StatCard label="Est. GPA" value={gpa} sub="Based on grades" accent="#A78BFA" icon={TrendingUp} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Upcoming Deadlines */}
        <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 16, fontWeight: 600, color: '#FFFCE8' }}>
              Upcoming Deadlines
            </h2>
            <Link to="/assignments" style={{ color: '#FFD60A', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ color: '#3B5280', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>🎉 All caught up!</div>
          ) : (
            upcoming.map(a => <UpcomingItem key={a.id} assignment={a} courses={courses} />)
          )}
        </div>

        {/* Courses */}
        <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 16, fontWeight: 600, color: '#FFFCE8' }}>
              My Courses
            </h2>
            <Link to="/schedule" style={{ color: '#FFD60A', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Schedule <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {courses.map(c => {
              const total = assignments.filter(a => a.courseId === c.id).length
              const completed = assignments.filter(a => a.courseId === c.id && a.status === 'done').length
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: '#FFFCE8', fontWeight: 500 }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>{completed}/{total}</span>
                    </div>
                    <div style={{ height: 4, background: '#1A2D52', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Overdue Alert */}
        {overdue.length > 0 && (
          <div style={{
            gridColumn: '1 / -1', background: 'rgba(255,107,107,0.08)',
            border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <AlertTriangle size={20} color="#FF6B6B" />
            <div>
              <div style={{ color: '#FF6B6B', fontWeight: 600, fontSize: 14 }}>
                {overdue.length} overdue assignment{overdue.length > 1 ? 's' : ''}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>
                {overdue.map(a => a.title).join(', ')}
              </div>
            </div>
            <Link to="/assignments" style={{ marginLeft: 'auto', color: '#FF6B6B', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
              View →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
