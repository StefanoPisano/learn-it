import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { LearningPaths } from './pages/LearningPaths'
import { LearningPathView } from './pages/LearningPathView'
import { useLearningPathStore } from './store/learningPathStore'
import { loadBuiltinPaths } from './lib/builtin-paths'

function App() {
  const loadBuiltIn = useLearningPathStore((state) => state.loadBuiltIn)

  useEffect(() => {
    const builtins = loadBuiltinPaths()
    loadBuiltIn(builtins)
  }, [loadBuiltIn])

  return (
    <BrowserRouter basename="/learn-it">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/paths" element={<LearningPaths />} />
          <Route path="/paths/:id" element={<LearningPathView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
