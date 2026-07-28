import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AlphabetPage } from './pages/AlphabetPage'
import { GrammarPage } from './pages/GrammarPage'
import { HomePage } from './pages/HomePage'
import { LessonPlayerPage } from './pages/LessonPlayerPage'
import { LessonsPage } from './pages/LessonsPage'
import { PhrasesPage } from './pages/PhrasesPage'
import { PracticePage } from './pages/PracticePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="lecciones" element={<LessonsPage />} />
          <Route path="lecciones/:lessonId" element={<LessonPlayerPage />} />
          <Route path="alefato" element={<AlphabetPage />} />
          <Route path="gramatica" element={<GrammarPage />} />
          <Route path="frases" element={<PhrasesPage />} />
          <Route path="practica" element={<PracticePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
