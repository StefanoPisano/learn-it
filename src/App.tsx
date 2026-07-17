import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { LearningPaths } from './pages/LearningPaths'

function App() {
  return (
    <BrowserRouter basename="/learn-it">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/paths" element={<LearningPaths />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
