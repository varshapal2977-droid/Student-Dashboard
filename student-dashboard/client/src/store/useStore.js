import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const COURSES_DEFAULT = [
  { id: '1', name: 'Data Structures', code: 'CS301', color: '#FFD60A', credits: 4, instructor: 'Prof. Sharma' },
  { id: '2', name: 'Web Development', code: 'CS401', color: '#06D6A0', credits: 3, instructor: 'Prof. Gupta' },
  { id: '3', name: 'Algorithms', code: 'CS302', color: '#FF6B6B', credits: 4, instructor: 'Prof. Singh' },
  { id: '4', name: 'Database Systems', code: 'CS303', color: '#A78BFA', credits: 3, instructor: 'Prof. Mehta' },
]

const EVENTS_DEFAULT = [
  { id: 'e1', title: 'CS301 Lecture', courseId: '1', start: new Date(2025, 2, 17, 9, 0), end: new Date(2025, 2, 17, 10, 30), type: 'class' },
  { id: 'e2', title: 'CS401 Lab', courseId: '2', start: new Date(2025, 2, 17, 14, 0), end: new Date(2025, 2, 17, 16, 0), type: 'lab' },
  { id: 'e3', title: 'CS302 Lecture', courseId: '3', start: new Date(2025, 2, 18, 11, 0), end: new Date(2025, 2, 18, 12, 30), type: 'class' },
  { id: 'e4', title: 'Algorithms Exam', courseId: '3', start: new Date(2025, 2, 25, 10, 0), end: new Date(2025, 2, 25, 12, 0), type: 'exam' },
]

const ASSIGNMENTS_DEFAULT = [
  { id: 'a1', title: 'Binary Tree Implementation', courseId: '1', deadline: new Date(2025, 2, 22), priority: 'high', status: 'in-progress', description: 'Implement BST with insert, delete, search', grade: null, maxGrade: 100 },
  { id: 'a2', title: 'React Dashboard UI', courseId: '2', deadline: new Date(2025, 2, 28), priority: 'high', status: 'todo', description: 'Build a responsive student dashboard', grade: null, maxGrade: 100 },
  { id: 'a3', title: 'Sorting Algorithm Analysis', courseId: '3', deadline: new Date(2025, 2, 20), priority: 'medium', status: 'done', description: 'Compare QuickSort vs MergeSort', grade: 88, maxGrade: 100 },
  { id: 'a4', title: 'ER Diagram Assignment', courseId: '4', deadline: new Date(2025, 3, 5), priority: 'low', status: 'todo', description: 'Design ER diagram for university system', grade: null, maxGrade: 50 },
]

const RESOURCES_DEFAULT = [
  { id: 'r1', courseId: '1', title: 'CS301 Syllabus', type: 'syllabus', url: 'https://example.com', notes: 'Check exam weightage', createdAt: new Date() },
  { id: 'r2', courseId: '2', title: 'React Docs', type: 'link', url: 'https://react.dev', notes: 'Official docs', createdAt: new Date() },
  { id: 'r3', courseId: '3', title: 'CLRS Book Notes', type: 'note', url: '', notes: 'Chapter 6-10 important for exam', createdAt: new Date() },
]

const GRADES_DEFAULT = [
  {
    id: 'g1', courseId: '1', courseName: 'Data Structures', credits: 4,
    components: [
      { id: 'c1', name: 'Midterm', weight: 30, scored: 78, max: 100 },
      { id: 'c2', name: 'Assignments', weight: 40, scored: 88, max: 100 },
      { id: 'c3', name: 'Final Exam', weight: 30, scored: null, max: 100 },
    ]
  },
  {
    id: 'g2', courseId: '2', courseName: 'Web Development', credits: 3,
    components: [
      { id: 'c4', name: 'Project', weight: 50, scored: 92, max: 100 },
      { id: 'c5', name: 'Quizzes', weight: 20, scored: 85, max: 100 },
      { id: 'c6', name: 'Final', weight: 30, scored: null, max: 100 },
    ]
  },
  {
    id: 'g3', courseId: '3', courseName: 'Algorithms', credits: 4,
    components: [
      { id: 'c7', name: 'Midterm', weight: 35, scored: 72, max: 100 },
      { id: 'c8', name: 'Assignments', weight: 25, scored: 88, max: 100 },
      { id: 'c9', name: 'Final Exam', weight: 40, scored: null, max: 100 },
    ]
  },
  {
    id: 'g4', courseId: '4', courseName: 'Database Systems', credits: 3,
    components: [
      { id: 'c10', name: 'Midterm', weight: 30, scored: 81, max: 100 },
      { id: 'c11', name: 'Project', weight: 40, scored: 90, max: 100 },
      { id: 'c12', name: 'Final', weight: 30, scored: null, max: 100 },
    ]
  },
]

export const useStore = create(
  persist(
    (set, get) => ({
      courses: COURSES_DEFAULT,
      events: EVENTS_DEFAULT,
      assignments: ASSIGNMENTS_DEFAULT,
      resources: RESOURCES_DEFAULT,
      grades: GRADES_DEFAULT,

      // Courses
      addCourse: (course) => set((s) => ({ courses: [...s.courses, { ...course, id: Date.now().toString() }] })),
      updateCourse: (id, data) => set((s) => ({ courses: s.courses.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteCourse: (id) => set((s) => ({ courses: s.courses.filter(c => c.id !== id) })),

      // Events
      addEvent: (event) => set((s) => ({ events: [...s.events, { ...event, id: Date.now().toString() }] })),
      updateEvent: (id, data) => set((s) => ({ events: s.events.map(e => e.id === id ? { ...e, ...data } : e) })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter(e => e.id !== id) })),

      // Assignments
      addAssignment: (a) => set((s) => ({ assignments: [...s.assignments, { ...a, id: Date.now().toString() }] })),
      updateAssignment: (id, data) => set((s) => ({ assignments: s.assignments.map(a => a.id === id ? { ...a, ...data } : a) })),
      deleteAssignment: (id) => set((s) => ({ assignments: s.assignments.filter(a => a.id !== id) })),

      // Resources
      addResource: (r) => set((s) => ({ resources: [...s.resources, { ...r, id: Date.now().toString(), createdAt: new Date() }] })),
      updateResource: (id, data) => set((s) => ({ resources: s.resources.map(r => r.id === id ? { ...r, ...data } : r) })),
      deleteResource: (id) => set((s) => ({ resources: s.resources.filter(r => r.id !== id) })),

      // Grades
      updateGradeComponent: (gradeId, componentId, data) => set((s) => ({
        grades: s.grades.map(g =>
          g.id === gradeId
            ? { ...g, components: g.components.map(c => c.id === componentId ? { ...c, ...data } : c) }
            : g
        )
      })),
      addGradeComponent: (gradeId, component) => set((s) => ({
        grades: s.grades.map(g =>
          g.id === gradeId
            ? { ...g, components: [...g.components, { ...component, id: Date.now().toString() }] }
            : g
        )
      })),
      deleteGradeComponent: (gradeId, componentId) => set((s) => ({
        grades: s.grades.map(g =>
          g.id === gradeId
            ? { ...g, components: g.components.filter(c => c.id !== componentId) }
            : g
        )
      })),
    }),
    { name: 'studyos-storage' }
  )
)
