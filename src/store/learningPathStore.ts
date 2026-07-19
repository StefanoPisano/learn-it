import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LearningPath {
  id: number
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  progress: number
  author: string
  language: string
}

interface LearningPathState {
  paths: LearningPath[]
  addPath: (path: Omit<LearningPath, 'id'>) => void
  removePath: (id: number) => void
  updatePath: (id: number, updates: Partial<LearningPath>) => void
}

const mockLearningPaths: LearningPath[] = [
  {
    id: 1,
    title: 'React Hooks Deep Dive',
    description: 'Master useState, useEffect, useContext and custom hooks with practical examples.',
    difficulty: 'intermediate',
    tags: ['react', 'hooks', 'frontend'],
    progress: 65,
    author: 'John Doe',
    language: 'en',
  },
  {
    id: 2,
    title: 'TypeScript Fundamentals',
    description: 'Learn TypeScript from scratch - types, interfaces, generics and best practices.',
    difficulty: 'beginner',
    tags: ['typescript', 'javascript'],
    progress: 100,
    author: 'Jane Smith',
    language: 'en',
  },
  {
    id: 3,
    title: 'Advanced CSS Patterns',
    description: 'Explore modern CSS techniques: grid, flexbox, custom properties and animations.',
    difficulty: 'advanced',
    tags: ['css', 'frontend', 'design'],
    progress: 30,
    author: 'Mike Johnson',
    language: 'en',
  },
  {
    id: 4,
    title: 'Node.js API Design',
    description: 'Build RESTful APIs with Node.js, Express and best practices for production.',
    difficulty: 'intermediate',
    tags: ['nodejs', 'backend', 'api'],
    progress: 0,
    author: 'Sarah Wilson',
    language: 'en',
  },
  {
    id: 5,
    title: 'Git Workflow Mastery',
    description: 'Learn Git branching strategies, rebasing, and collaboration workflows.',
    difficulty: 'beginner',
    tags: ['git', 'devops'],
    progress: 85,
    author: 'Alex Chen',
    language: 'en',
  },
  {
    id: 6,
    title: 'Database Design Principles',
    description: 'Understand relational database design, normalization and query optimization.',
    difficulty: 'advanced',
    tags: ['database', 'sql', 'backend'],
    progress: 15,
    author: 'Emily Brown',
    language: 'en',
  },
]

export const useLearningPathStore = create<LearningPathState>()(
  persist(
    (set) => ({
      paths: mockLearningPaths,

      addPath: (path) =>
        set((state) => ({
          paths: [
            ...state.paths,
            { ...path, id: Math.max(0, ...state.paths.map((p) => p.id)) + 1 },
          ],
        })),

      removePath: (id) =>
        set((state) => ({
          paths: state.paths.filter((p) => p.id !== id),
        })),

      updatePath: (id, updates) =>
        set((state) => ({
          paths: state.paths.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
    }),
    {
      name: 'learn-it-paths',
    },
  ),
)
