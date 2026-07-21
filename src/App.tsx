import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { MyCourses } from './pages/MyCourses'
import { LearningPaths } from './pages/LearningPaths'
import { LearningPathView } from './pages/LearningPathView'
import { Faq } from './pages/Faq'
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
          <Route path="/" element={<MyCourses />} />
          <Route path="/paths" element={<LearningPaths />} />
          <Route path="/paths/:id" element={<LearningPathView />} />
          <Route path="/faq" element={<Faq />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
