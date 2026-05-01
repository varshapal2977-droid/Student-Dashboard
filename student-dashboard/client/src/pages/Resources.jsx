import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, X, Trash2, Edit3, ExternalLink, FileText, Link2, BookOpen, File } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPES = ['link', 'note', 'syllabus', 'file']
const TYPE_ICONS = { link: Link2, note: FileText, syllabus: BookOpen, file: File }
const TYPE_COLORS = { link: '#38BDF8', note: '#FFD60A', syllabus: '#06D6A0', file: '#A78BFA' }

const inputStyle = {
  width: '100%', padding: '8px 12px', background: '#050D1F',
  border: '1px solid #1A2D52', borderRadius: 8, color: '#FFFCE8',
  fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  colorScheme: 'dark',
}

function Modal({ onClose, onSave, courses, initial }) {
  const [form, setForm] = useState(initial || {
    title: '', courseId: courses[0]?.id || '', type: 'link', url: '', notes: ''
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 16, padding: 28, width: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, color: '#FFFCE8' }}>{initial?.id ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {[
          { label: 'Title', el: <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Resource name" style={inputStyle} /> },
          { label: 'Course', el: <select value={form.courseId} onChange={e => set('courseId', e.target.value)} style={inputStyle}>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select> },
          { label: 'Type', el: (
            <div style={{ display: 'flex', gap: 8 }}>
              {TYPES.map(t => {
                const Icon = TYPE_ICONS[t]
                return (
                  <button key={t} onClick={() => set('type', t)} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    background: form.type === t ? TYPE_COLORS[t] + '22' : 'transparent',
                    color: form.type === t ? TYPE_COLORS[t] : '#6B7280',
                    border: `1px solid ${form.type === t ? TYPE_COLORS[t] : '#1A2D52'}`,
                    textTransform: 'capitalize',
                  }}>
                    <Icon size={14} />{t}
                  </button>
                )
              })}
            </div>
          )},
          { label: 'URL (optional)', el: <input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." style={inputStyle} /> },
          { label: 'Notes', el: <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any notes..." style={{ ...inputStyle, resize: 'vertical' }} /> },
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

function ResourceCard({ resource, onEdit, onDelete }) {
  const Icon = TYPE_ICONS[resource.type] || File
  const color = TYPE_COLORS[resource.type] || '#6B7280'

  return (
    <div style={{
      background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 10,
      padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#3E3D4D'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1A2D52'}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: '#FFFCE8', fontSize: 13, marginBottom: 2 }}>{resource.title}</div>
        {resource.notes && <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{resource.notes}</div>}
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: color + '18', color, textTransform: 'capitalize' }}>{resource.type}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {resource.url && (
          <a href={resource.url} target="_blank" rel="noreferrer" style={{ color: '#6B7280', display: 'flex', alignItems: 'center' }}>
            <ExternalLink size={14} />
          </a>
        )}
        <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><Edit3 size={13} /></button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><Trash2 size={13} /></button>
      </div>
    </div>
  )
}

export default function Resources() {
  const { courses, resources, addResource, updateResource, deleteResource } = useStore()
  const [modal, setModal] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const handleSave = (form) => {
    if (modal.initial?.id) {
      updateResource(modal.initial.id, form)
      toast.success('Resource updated')
    } else {
      addResource(form)
      toast.success('Resource added')
    }
    setModal(null)
  }

  const grouped = courses.reduce((acc, c) => {
    acc[c.id] = resources.filter(r => r.courseId === c.id)
    return acc
  }, {})

  const tabStyle = (active) => ({
    padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
    background: active ? 'rgba(255,214,10,0.12)' : 'transparent',
    color: active ? '#FFD60A' : '#6B7280',
    border: `1px solid ${active ? '#FFD60A33' : 'transparent'}`,
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, fontWeight: 700, color: '#FFFCE8' }}>Resource Hub</h1>
          <p style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>{resources.length} resources across {courses.length} courses</p>
        </div>
        <button onClick={() => setModal({ initial: null })} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
          background: '#FFD60A', border: 'none', borderRadius: 8, color: '#050D1F',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Clash Display, sans-serif',
        }}><Plus size={16} /> Add Resource</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('all')} style={tabStyle(activeTab === 'all')}>All Courses</button>
        {courses.map(c => (
          <button key={c.id} onClick={() => setActiveTab(c.id)} style={{
            ...tabStyle(activeTab === c.id),
            color: activeTab === c.id ? c.color : '#6B7280',
            background: activeTab === c.id ? c.color + '18' : 'transparent',
            borderColor: activeTab === c.id ? c.color + '44' : 'transparent',
          }}>
            {c.code}
          </button>
        ))}
      </div>

      {activeTab === 'all' ? (
        courses.map(c => {
          const recs = grouped[c.id] || []
          return (
            <div key={c.id} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 15, fontWeight: 600, color: '#FFFCE8' }}>{c.name}</h2>
                <span style={{ fontSize: 11, color: '#3B5280' }}>{c.code} · {recs.length} resources</span>
              </div>
              {recs.length === 0 ? (
                <div style={{ color: '#3B5280', fontSize: 13, paddingLeft: 18 }}>No resources yet.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                  {recs.map(r => (
                    <ResourceCard key={r.id} resource={r}
                      onEdit={() => setModal({ initial: r })}
                      onDelete={() => { deleteResource(r.id); toast.success('Deleted') }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })
      ) : (
        <div>
          {(() => {
            const c = courses.find(c => c.id === activeTab)
            const recs = grouped[activeTab] || []
            return (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c?.color }} />
                  <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, color: '#FFFCE8' }}>{c?.name}</h2>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{recs.length} resources</span>
                </div>
                {recs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#3B5280' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                    <div>No resources for this course yet.</div>
                    <button onClick={() => setModal({ initial: { courseId: activeTab } })} style={{
                      marginTop: 16, padding: '8px 18px', background: '#FFD60A', border: 'none',
                      borderRadius: 8, color: '#050D1F', fontWeight: 700, cursor: 'pointer',
                    }}>Add First Resource</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {recs.map(r => (
                      <ResourceCard key={r.id} resource={r}
                        onEdit={() => setModal({ initial: r })}
                        onDelete={() => { deleteResource(r.id); toast.success('Deleted') }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {modal && <Modal onClose={() => setModal(null)} onSave={handleSave} courses={courses} initial={modal.initial} />}
    </div>
  )
}
