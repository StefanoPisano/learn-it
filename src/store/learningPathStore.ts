import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

export interface ReferenceLink {
  title: string
  url: string
}

export interface Section {
  type: 'concept' | 'exercise' | 'quiz' | 'reference'
  variant?: 'single' | 'multiple'
  content: string
  questions?: QuizQuestion[]
  links?: ReferenceLink[]
}

export interface LearningPath {
  id: number
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  progress: number
  author: string
  language: string
  link?: string
  date?: string
  version?: string
  sections?: Section[]
}

interface LearningPathState {
  paths: LearningPath[]
  addPath: (path: Omit<LearningPath, 'id'>) => void
  removePath: (id: number) => void
  updatePath: (id: number, updates: Partial<LearningPath>) => void
}

export const useLearningPathStore = create<LearningPathState>()(
  persist(
    (set) => ({
      paths: [],

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
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
