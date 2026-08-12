import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthProvider } from './lib/AuthProvider'
import { AccountPage } from './pages/AccountPage'
import { AlphabetPage } from './pages/AlphabetPage'
import { AudioStudioPage } from './pages/AudioStudioPage'
import { CertificatesPage } from './pages/CertificatesPage'
import { ClassDigestPage } from './pages/ClassDigestPage'
import { GrammarPage } from './pages/GrammarPage'
import { GuidedAudioPage } from './pages/GuidedAudioPage'
import { HomeCalendarPage } from './pages/HomeCalendarPage'
import { HomePage } from './pages/HomePage'
import { LessonPlayerPage } from './pages/LessonPlayerPage'
import { LessonsPage } from './pages/LessonsPage'
import { PairPracticePage } from './pages/PairPracticePage'
import { PhrasesPage } from './pages/PhrasesPage'
import { PracticePage } from './pages/PracticePage'
import { ProfilesPage } from './pages/ProfilesPage'
import { ProgressPage } from './pages/ProgressPage'
import { QuizPage } from './pages/QuizPage'
import { TasksPage } from './pages/TasksPage'
import { VocabularyPage } from './pages/VocabularyPage'
import { WeeklyPackPage } from './pages/WeeklyPackPage'
import { ZionismPage } from './pages/ZionismPage'

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="lecciones" element={<LessonsPage />} />
            <Route path="lecciones/:lessonId" element={<LessonPlayerPage />} />
            <Route path="alefato" element={<AlphabetPage />} />
            <Route path="gramatica" element={<GrammarPage />} />
            <Route path="vocabulario" element={<VocabularyPage />} />
            <Route path="sionismo" element={<ZionismPage />} />
            <Route path="calendario" element={<HomeCalendarPage />} />
            <Route path="frases" element={<PhrasesPage />} />
            <Route path="practica" element={<PracticePage />} />
            <Route path="pareja" element={<PairPracticePage />} />
            <Route path="audio-guiado" element={<GuidedAudioPage />} />
            <Route path="estudio-audio" element={<AudioStudioPage />} />
            <Route path="entrega-semanal" element={<WeeklyPackPage />} />
            <Route path="resumen-clase" element={<ClassDigestPage />} />
            <Route path="certificados" element={<CertificatesPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="progreso" element={<ProgressPage />} />
            <Route path="perfiles" element={<ProfilesPage />} />
            <Route path="tareas" element={<TasksPage />} />
            <Route path="cuenta" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
