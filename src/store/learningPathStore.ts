import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { BuiltinPath } from '../lib/builtin-paths'

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
  slug: string
  source: 'builtin' | 'imported'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  progress: number
  followed: boolean
  author: string
  language: string
  link?: string
  date?: string
  version?: string
  sections?: Section[]
}

interface LearningPathState {
  paths: LearningPath[]
  addPath: (path: Omit<LearningPath, 'id' | 'slug' | 'source' | 'followed'>) => void
  removePath: (id: number) => void
  updatePath: (id: number, updates: Partial<LearningPath>) => void
  followPath: (id: number) => void
  unfollowPath: (id: number) => void
  loadBuiltIn: (builtinPaths: BuiltinPath[]) => void
}

function slugFromTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const useLearningPathStore = create<LearningPathState>()(
  persist(
    (set) => ({
      paths: [],

      addPath: (path) =>
        set((state) => {
          const slug = slugFromTitle(path.title)
          return {
            paths: [
              ...state.paths,
              { ...path, id: Math.max(0, ...state.paths.map((p) => p.id)) + 1, slug, source: 'imported' as const, followed: false },
            ],
          }
        }),

      removePath: (id) =>
        set((state) => ({
          paths: state.paths.filter((p) => p.id !== id || p.source === 'builtin'),
        })),

      updatePath: (id, updates) =>
        set((state) => ({
          paths: state.paths.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      followPath: (id) =>
        set((state) => ({
          paths: state.paths.map((p) => (p.id === id ? { ...p, followed: true } : p)),
        })),

      unfollowPath: (id) =>
        set((state) => ({
          paths: state.paths.map((p) => (p.id === id ? { ...p, followed: false, progress: 0 } : p)),
        })),

      loadBuiltIn: (builtinPaths) =>
        set((state) => {
          const existingBySlugVersion = new Map(
            state.paths.map((p) => [`${p.slug}::${p.version}`, p]),
          )

          const nextId = Math.max(0, ...state.paths.map((p) => p.id)) + 1
          const newPaths: LearningPath[] = []
          let id = nextId

          for (const bp of builtinPaths) {
            const key = `${bp.slug}::${bp.data.version ?? '1.0.0'}`
            const existing = existingBySlugVersion.get(key)
            newPaths.push({
              ...bp.data,
              id: existing?.id ?? id++,
              slug: bp.slug,
              source: 'builtin',
              progress: existing?.progress ?? 0,
              followed: existing?.followed ?? false,
            })
          }

          const importedPaths = state.paths.filter((p) => p.source === 'imported')
          return { paths: [...newPaths, ...importedPaths] }
        }),
    }),
    {
      name: 'learn-it-paths',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ paths: state.paths }),
    },
  ),
)
