import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { format, isPast, differenceInDays, isToday } from 'date-fns'
import { Plus, X, Trash2, Edit3, CheckCircle2, Circle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const PRIORITIES = ['low', 'medium', 'high']
const STATUSES = ['todo', 'in-progress', 'done']
const PRIORITY_COLORS = { low: '#38BDF8', medium: '#FFD60A', high: '#FF6B6B' }
const STATUS_COLORS = { todo: '#6B7280', 'in-progress': '#A78BFA', done: '#06D6A0' }

const inputStyle = {
  width: '100%', padding: '8px 12px', background: '#050D1F',
  border: '1px solid #1A2D52', borderRadius: 8, color: '#FFFCE8',
  fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  colorScheme: 'dark',
}

function Modal({ onClose, onSave, courses, initial }) {
  const [form, setForm] = useState(initial || {
    title: '', courseId: courses[0]?.id || '', description: '',
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    priority: 'medium', status: 'todo',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 16, padding: 28, width: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, color: '#FFFCE8' }}>{initial?.id ? 'Edit Assignment' : 'New Assignment'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {[
          { label: 'Title', el: <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Assignment title" style={inputStyle} /> },
          { label: 'Course', el: <select value={form.courseId} onChange={e => set('courseId', e.target.value)} style={inputStyle}>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select> },
          { label: 'Description', el: <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Optional details..." style={{ ...inputStyle, resize: 'vertical' }} /> },
          { label: 'Deadline', el: <input type="date" value={form.deadline?.toString().slice(0, 10)} onChange={e => set('deadline', e.target.value)} style={inputStyle} /> },
          { label: 'Priority', el: (
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITIES.map(p => (
                <button key={p} onClick={() => set('priority', p)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13,
                  background: form.priority === p ? PRIORITY_COLORS[p] : 'transparent',
                  color: form.priority === p ? '#050D1F' : '#9CA3AF',
                  border: `1px solid ${form.priority === p ? PRIORITY_COLORS[p] : '#1A2D52'}`,
                  textTransform: 'capitalize',
                }}>{p}</button>
              ))}
            </div>
          )},
          { label: 'Status', el: (
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => set('status', s)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 12,
                  background: form.status === s ? STATUS_COLORS[s] + '33' : 'transparent',
                  color: form.status === s ? STATUS_COLORS[s] : '#9CA3AF',
                  border: `1px solid ${form.status === s ? STATUS_COLORS[s] : '#1A2D52'}`,
                  textTransform: 'capitalize', whiteSpace: 'nowrap',
                }}>{s}</button>
              ))}
            </div>
          )},
        ].map(({ label, el }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            {el}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', background: '#1A2D52', border: 'none', borderRadius: 8, color: '#9CA3AF', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (!form.title.trim()) return toast.error('Add a title'); onSave(form) }}
            style={{ flex: 1, padding: '10px 0', background: '#FFD60A', border: 'none', borderRadius: 8, color: '#050D1F', fontWeight: 700, cursor: 'pointer', fontFamily: 'Clash Display, sans-serif' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignmentCard({ assignment, course, onEdit, onDelete, onStatusChange }) {
  const deadline = new Date(assignment.deadline)
  const days = differenceInDays(deadline, new Date())
  const overdue = isPast(deadline) && assignment.status !== 'done'
  const today = isToday(deadline)

  return (
    <div style={{
      background: '#0D1B38', border: `1px solid ${overdue ? 'rgba(255,107,107,0.3)' : '#1A2D52'}`,
      borderLeft: `4px solid ${course?.color || '#FFD60A'}`,
      borderRadius: 12, padding: '16px 20px', marginBottom: 10,
      opacity: assignment.status === 'done' ? 0.6 : 1,
      transition: 'opacity 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button onClick={() => onStatusChange(assignment.status === 'done' ? 'todo' : 'done')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: assignment.status === 'done' ? '#06D6A0' : '#3B5280', paddingTop: 2 }}>
          {assignment.status === 'done' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: '#FFFCE8', fontSize: 14, textDecoration: assignment.status === 'done' ? 'line-through' : 'none' }}>{assignment.title}</span>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: PRIORITY_COLORS[assignment.priority] + '22', color: PRIORITY_COLORS[assignment.priority], textTransform: 'capitalize' }}>{assignment.priority}</span>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: STATUS_COLORS[assignment.status] + '22', color: STATUS_COLORS[assignment.status], textTransform: 'capitalize' }}>{assignment.status}</span>
          </div>
          {assignment.description && (
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{assignment.description}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#6B7280' }}>{course?.code} · {course?.name}</span>
            <span style={{ fontSize: 11, color: overdue ? '#FF6B6B' : today ? '#FFD60A' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} />
              {overdue ? `${Math.abs(days)}d overdue` : today ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due ${format(deadline, 'MMM d')}`}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onEdit()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><Edit3 size={15} /></button>
          <button onClick={() => onDelete()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><Trash2 size={15} /></button>
        </div>
      </div>
    </div>
  )
}

export default function Assignments() {
  const { courses, assignments, addAssignment, updateAssignment, deleteAssignment } = useStore()
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', course: 'all' })

  const filtered = assignments.filter(a => {
    if (filter.status !== 'all' && a.status !== filter.status) return false
    if (filter.priority !== 'all' && a.priority !== filter.priority) return false
    if (filter.course !== 'all' && a.courseId !== filter.course) return false
    return true
  }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  const handleSave = (form) => {
    if (modal.initial?.id) {
      updateAssignment(modal.initial.id, { ...form, deadline: new Date(form.deadline) })
      toast.success('Assignment updated')
    } else {
      addAssignment({ ...form, deadline: new Date(form.deadline) })
      toast.success('Assignment added')
    }
    setModal(null)
  }

  const selStyle = (active) => ({
    padding: '6px 12px', borderRadius: 6, border: `1px solid ${active ? '#FFD60A' : '#1A2D52'}`,
    background: active ? 'rgba(255,214,10,0.12)' : 'transparent',
    color: active ? '#FFD60A' : '#6B7280', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, fontWeight: 700, color: '#FFFCE8' }}>Assignments</h1>
          <p style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>{assignments.filter(a => a.status !== 'done').length} pending · {assignments.filter(a => a.status === 'done').length} done</p>
        </div>
        <button onClick={() => setModal({ initial: null })} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
          background: '#FFD60A', border: 'none', borderRadius: 8, color: '#050D1F',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Clash Display, sans-serif',
        }}><Plus size={16} /> New Assignment</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: '#3B5280', alignSelf: 'center' }}>Filter:</span>
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(f => ({ ...f, status: s }))} style={selStyle(filter.status === s)}>
            {s === 'all' ? 'All Status' : s}
          </button>
        ))}
        <span style={{ borderLeft: '1px solid #1A2D52', margin: '0 4px' }} />
        {['all', ...PRIORITIES].map(p => (
          <button key={p} onClick={() => setFilter(f => ({ ...f, priority: p }))} style={selStyle(filter.priority === p)}>
            {p === 'all' ? 'All Priority' : p}
          </button>
        ))}
        <span style={{ borderLeft: '1px solid #1A2D52', margin: '0 4px' }} />
        <select value={filter.course} onChange={e => setFilter(f => ({ ...f, course: e.target.value }))}
          style={{ ...selStyle(filter.course !== 'all'), appearance: 'none', paddingRight: 16 }}>
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
        </select>
      </div>

      <div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#3B5280' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 15 }}>No assignments here!</div>
          </div>
        ) : (
          filtered.map(a => (
            <AssignmentCard
              key={a.id} assignment={a}
              course={courses.find(c => c.id === a.courseId)}
              onEdit={() => setModal({ initial: { ...a, deadline: new Date(a.deadline).toISOString().slice(0, 10) } })}
              onDelete={() => { deleteAssignment(a.id); toast.success('Deleted') }}
              onStatusChange={(s) => updateAssignment(a.id, { status: s })}
            />
          ))
        )}
      </div>

      {modal && <Modal onClose={() => setModal(null)} onSave={handleSave} courses={courses} initial={modal.initial} />}
    </div>
  )
}
