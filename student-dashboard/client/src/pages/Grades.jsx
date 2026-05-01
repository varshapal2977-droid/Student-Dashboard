import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, Info } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import toast from 'react-hot-toast'

const scoreToGPA = (pct) => {
  if (pct >= 90) return { gpa: 4.0, letter: 'A', color: '#06D6A0' }
  if (pct >= 80) return { gpa: 3.0, letter: 'B', color: '#FFD60A' }
  if (pct >= 70) return { gpa: 2.0, letter: 'C', color: '#38BDF8' }
  if (pct >= 60) return { gpa: 1.0, letter: 'D', color: '#A78BFA' }
  return { gpa: 0.0, letter: 'F', color: '#FF6B6B' }
}

function calcGrade(components) {
  const scored = components.filter(c => c.scored !== null && c.scored !== '')
  if (scored.length === 0) return null
  const totalWeight = scored.reduce((s, c) => s + Number(c.weight), 0)
  if (totalWeight === 0) return null
  const pct = scored.reduce((s, c) => s + (Number(c.scored) / Number(c.max)) * (Number(c.weight) / totalWeight) * 100, 0)
  return pct
}

function calcFull(components) {
  const totalWeight = components.reduce((s, c) => s + Number(c.weight), 0)
  if (totalWeight === 0) return null
  const pct = components.reduce((s, c) => {
    const score = (c.scored !== null && c.scored !== '') ? Number(c.scored) : Number(c.max)
    return s + (score / Number(c.max)) * (Number(c.weight) / totalWeight) * 100
  }, 0)
  return pct
}

function GradeCard({ grade }) {
  const { updateGradeComponent, deleteGradeComponent, addGradeComponent } = useStore()
  const [whatIf, setWhatIf] = useState({})
  const [showWhatIf, setShowWhatIf] = useState(false)

  const components = grade.components.map(c => ({
    ...c,
    scored: whatIf[c.id] !== undefined ? whatIf[c.id] : c.scored,
  }))

  const currentPct = calcGrade(components)
  const projectedPct = calcFull(components)
  const grade_info = currentPct !== null ? scoreToGPA(currentPct) : null

  const totalWeight = grade.components.reduce((s, c) => s + Number(c.weight), 0)

  const handleAdd = () => {
    const remaining = 100 - totalWeight
    addGradeComponent(grade.id, {
      name: 'New Component', weight: Math.max(0, remaining), scored: null, max: 100
    })
  }

  return (
    <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 18, color: '#FFFCE8', fontWeight: 600 }}>{grade.courseName}</h2>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Weight total: <span style={{ color: totalWeight === 100 ? '#06D6A0' : '#FF6B6B' }}>{totalWeight}%</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {grade_info && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 36, fontWeight: 700, color: grade_info.color }}>{grade_info.letter}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{currentPct?.toFixed(1)}%</div>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>GPA</div>
            <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 22, color: '#FFFCE8' }}>{grade_info ? grade_info.gpa.toFixed(1) : '--'}</div>
          </div>
        </div>
      </div>

      {/* Components table */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 36px', gap: 8, marginBottom: 8 }}>
          {['Component', 'Weight', 'Score', 'Max', ''].map(h => (
            <div key={h} style={{ fontSize: 10, color: '#3B5280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
          ))}
        </div>
        {grade.components.map(comp => (
          <div key={comp.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 36px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              value={comp.name}
              onChange={e => updateGradeComponent(grade.id, comp.id, { name: e.target.value })}
              style={{ background: 'transparent', border: 'none', color: '#FFFCE8', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="number" value={comp.weight}
                onChange={e => updateGradeComponent(grade.id, comp.id, { weight: Number(e.target.value) })}
                style={{ width: '100%', background: '#050D1F', border: '1px solid #1A2D52', borderRadius: 6, color: '#FFFCE8', padding: '5px 8px', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
              />
              <span style={{ fontSize: 11, color: '#3B5280' }}>%</span>
            </div>
            <input
              type="number" placeholder="—"
              value={comp.scored ?? ''}
              onChange={e => updateGradeComponent(grade.id, comp.id, { scored: e.target.value === '' ? null : Number(e.target.value) })}
              style={{ background: '#050D1F', border: '1px solid #1A2D52', borderRadius: 6, color: comp.scored !== null ? '#FFFCE8' : '#3B5280', padding: '5px 8px', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
            />
            <input
              type="number" value={comp.max}
              onChange={e => updateGradeComponent(grade.id, comp.id, { max: Number(e.target.value) })}
              style={{ background: '#050D1F', border: '1px solid #1A2D52', borderRadius: 6, color: '#FFFCE8', padding: '5px 8px', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
            />
            <button onClick={() => deleteGradeComponent(grade.id, comp.id)}
              style={{ background: 'none', border: 'none', color: '#3B5280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={handleAdd} style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280',
          background: 'none', border: '1px dashed #1A2D52', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', marginTop: 4
        }}>
          <Plus size={12} /> Add Component
        </button>
      </div>

      {/* What-if toggle */}
      <div style={{ borderTop: '1px solid #1A2D52', paddingTop: 16, marginTop: 4 }}>
        <button onClick={() => setShowWhatIf(!showWhatIf)} style={{
          fontSize: 12, color: '#A78BFA', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 6, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Info size={13} /> What-If Scenarios
        </button>

        {showWhatIf && (
          <div style={{ marginTop: 14, background: '#050D1F', borderRadius: 10, padding: 16, border: '1px solid #1A2D52' }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Simulate future scores for pending components:</div>
            {grade.components.filter(c => c.scored === null).map(comp => (
              <div key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ flex: 1, fontSize: 13, color: '#FFFCE8' }}>{comp.name} ({comp.weight}%)</span>
                <input
                  type="number" placeholder={`0–${comp.max}`}
                  value={whatIf[comp.id] ?? ''}
                  onChange={e => setWhatIf(w => ({ ...w, [comp.id]: e.target.value === '' ? undefined : Number(e.target.value) }))}
                  style={{ width: 80, background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 6, color: '#FFFCE8', padding: '5px 8px', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
                />
                <span style={{ fontSize: 12, color: '#3B5280' }}>/ {comp.max}</span>
              </div>
            ))}
            {Object.keys(whatIf).length > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(167,139,250,0.1)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.2)' }}>
                {(() => {
                  const projected = calcFull(components)
                  const info = projected ? scoreToGPA(projected) : null
                  return info ? (
                    <div style={{ fontSize: 13, color: '#A78BFA' }}>
                      With these scores → <strong style={{ color: info.color }}>{info.letter} ({projected?.toFixed(1)}%)</strong> · GPA {info.gpa.toFixed(1)}
                    </div>
                  ) : null
                })()}
                <button onClick={() => setWhatIf({})} style={{ marginTop: 8, fontSize: 11, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Grades() {
  const { courses, grades } = useStore()

  // Overall GPA
  let totalWeighted = 0, totalCredits = 0
  grades.forEach(g => {
    const course = courses.find(c => c.id === g.courseId)
    const credits = course?.credits || 3
    const pct = calcGrade(g.components)
    if (pct === null) return
    const { gpa } = scoreToGPA(pct)
    totalWeighted += gpa * credits
    totalCredits += credits
  })
  const overallGPA = totalCredits > 0 ? (totalWeighted / totalCredits) : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 26, fontWeight: 700, color: '#FFFCE8' }}>Grade Calculator</h1>
          <p style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>Track scores, simulate what-if scenarios</p>
        </div>
        {overallGPA !== null && (
          <div style={{ background: '#0D1B38', border: '1px solid #1A2D52', borderRadius: 12, padding: '16px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estimated GPA</div>
            <div style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 40, fontWeight: 700, color: scoreToGPA((overallGPA / 4) * 100).color }}>
              {overallGPA.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>/ 4.0 scale</div>
          </div>
        )}
      </div>

      {grades.map(g => <GradeCard key={g.id} grade={g} />)}
    </div>
  )
}
