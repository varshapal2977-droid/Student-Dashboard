import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useStore } from '../store/useStore'
import { X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const localizer = momentLocalizer(moment)

const EVENT_TYPES = ['class', 'lab', 'exam', 'study', 'other']

function Modal({ onClose, onSave, courses, initial }) {
  const [form, setForm] = useState(initial || {
    title: '', courseId: courses[0]?.id || '', type: 'class',
    start: new Date(), end: new Date(Date.now() + 90 * 60000),
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 16, padding: 28, width: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, color: '#FFFCE8' }}>
            {initial ? 'Edit Event' : 'Add Event'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {[
          { label: 'Title', el: <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Event title" style={inputStyle} /> },
          { label: 'Course', el: (
            <select value={form.courseId} onChange={e => set('courseId', e.target.value)} style={inputStyle}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )},
          { label: 'Type', el: (
            <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          )},
          { label: 'Start', el: <input type="datetime-local" value={toInputDT(form.start)} onChange={e => set('start', new Date(e.target.value))} style={inputStyle} /> },
          { label: 'End', el: <input type="datetime-local" value={toInputDT(form.end)} onChange={e => set('end', new Date(e.target.value))} style={inputStyle} /> },
        ].map(({ label, el }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            {el}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', background: '#1A2D52', border: 'none', borderRadius: 8, color: '#9CA3AF', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
          <button onClick={() => { if (!form.title.trim()) return toast.error('Add a title'); onSave(form) }} style={{ flex: 1, padding: '10px 0', background: '#FFD60A', border: 'none', borderRadius: 8, color: '#050D1F', fontWeight: 700, cursor: 'pointer', fontFamily: 'Clash Display, sans-serif' }}>Save</button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '8px 12px', background: '#050D1F',
  border: '1px solid #1A2D52', borderRadius: 8, color: '#FFFCE8',
  fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  colorScheme: 'dark',
}

function toInputDT(d) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toISOString().slice(0, 16)
}

export default function Schedule() {
  const { courses, events, addEvent, updateEvent, deleteEvent } = useStore()
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  const calEvents = events.map(e => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
    resource: courses.find(c => c.id === e.courseId),
  }))

  const handleSelectSlot = ({ start, end }) => {
    setModal({ mode: 'add', initial: { title: '', courseId: courses[0]?.id, type: 'class', start, end } })
  }

  const handleSelectEvent = (event) => {
    setSelected(event)
  }

  const handleSave = (form) => {
    if (modal.mode === 'edit') {
      updateEvent(modal.initial.id, form)
      toast.success('Event updated')
    } else {
      addEvent(form)
      toast.success('Event added')
    }
    setModal(null)
    setSelected(null)
  }

  const TYPE_COLORS = { class: '#FFD60A', lab: '#06D6A0', exam: '#FF6B6B', study: '#A78BFA', other: '#38BDF8' }

  const eventStyleGetter = (event) => ({
    style: {
      background: TYPE_COLORS[event.type] || '#FFD60A',
      color: ['class', 'study'].includes(event.type) ? '#050D1F' : '#050D1F',
      border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600,
    }
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, fontWeight: 700, color: '#FFFCE8' }}>Course Schedule</h1>
          <p style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>Click on a slot to add an event</p>
        </div>
        <button onClick={() => setModal({ mode: 'add' })} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
          background: '#FFD60A', border: 'none', borderRadius: 8, color: '#050D1F',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Clash Display, sans-serif',
        }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 12, color: '#9CA3AF', textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>

      <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 16, padding: 20, height: 600 }}>
        <Calendar
          localizer={localizer}
          events={calEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          defaultView="week"
          style={{ height: '100%' }}
        />
      </div>

      {/* Event detail popup */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 16, padding: 28, width: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, color: '#FFFCE8' }}>{selected.title}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>
              <div>{selected.resource?.name} · {selected.resource?.code}</div>
              <div style={{ marginTop: 4 }}>{moment(selected.start).format('ddd MMM D, h:mm A')} → {moment(selected.end).format('h:mm A')}</div>
              <div style={{ marginTop: 4, textTransform: 'capitalize' }}>Type: {selected.type}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => { deleteEvent(selected.id); setSelected(null); toast.success('Deleted') }}
                style={{ flex: 1, padding: '9px 0', background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, color: '#FF6B6B', cursor: 'pointer' }}>
                Delete
              </button>
              <button onClick={() => { setModal({ mode: 'edit', initial: selected }); setSelected(null) }}
                style={{ flex: 1, padding: '9px 0', background: '#FFD60A', border: 'none', borderRadius: 8, color: '#050D1F', fontWeight: 700, cursor: 'pointer' }}>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <Modal
          onClose={() => setModal(null)}
          onSave={handleSave}
          courses={courses}
          initial={modal.initial}
        />
      )}
    </div>
  )
}
