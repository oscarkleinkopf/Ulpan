import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { canRecordAudio } from '../lib/accountRole'
import { useAuthContext } from '../lib/AuthProvider'
import { isTeacher } from '../lib/classroom'
import { useClassroom } from '../lib/useClassroom'

const LEARNER_LINKS: { to: string; title: string; hint: string }[] = [
  { to: '/alefato', title: 'Alefato', hint: 'Letras, finales y nikud' },
  { to: '/vocabulario', title: 'Vocabulario', hint: 'Léxico por temas' },
  { to: '/gramatica', title: 'Gramática', hint: 'Género, artículo, presente' },
  { to: '/frases', title: 'Frases', hint: 'Café, calle, presentaciones' },
  { to: '/sionismo', title: 'Sionismo', hint: 'Léxico e historia' },
  { to: '/calendario', title: 'Calendario', hint: 'Foco cultural del día' },
  { to: '/audio-guiado', title: 'Audio guiado', hint: 'Escuchá y repetí' },
  { to: '/pareja', title: 'Modo pareja', hint: 'Diálogos por turnos' },
  { to: '/entrega-semanal', title: 'Entrega semanal', hint: '5 palabras + 3 frases' },
  { to: '/certificados', title: 'Diplomas', hint: 'Logros con Maggie' },
  { to: '/quiz', title: 'Quiz rápido', hint: 'Repaso corto' },
  { to: '/progreso', title: 'Progreso', hint: 'Racha, XP y tu nombre' },
  { to: '/perfiles', title: 'Perfiles', hint: 'Unirse a la clase' },
]

const TEACHER_LINKS: { to: string; title: string; hint: string }[] = [
  { to: '/tareas', title: 'Tareas de la clase', hint: 'Asignar y revisar' },
  { to: '/resumen-clase', title: 'Resumen de clase', hint: 'Avance semanal' },
  { to: '/estudio-audio', title: 'Estudio de audio', hint: 'Grabar voz de la mora' },
  { to: '/entrega-semanal', title: 'Pack semanal', hint: 'WhatsApp / imprimir' },
  { to: '/perfiles', title: 'Perfiles y código', hint: 'Alumnos de la clase' },
  { to: '/certificados', title: 'Diplomas', hint: 'Lote Maggie' },
]

export function MorePage() {
  const { user } = useAuthContext()
  const { activeProfile } = useClassroom()
  const teacher = Boolean(
    (user?.role && isTeacher(user.role)) || (activeProfile && isTeacher(activeProfile.role)),
  )
  const studio = canRecordAudio(user)

  return (
    <section className="section">
      <PageVisual sceneId="progreso" />
      <h2>Más</h2>
      <p className="lead">El resto del Ulpan, agrupado. El camino de hoy está en Inicio.</p>

      {teacher ? (
        <>
          <h3 className="more-heading">Aula</h3>
          <div className="more-grid">
            {TEACHER_LINKS.filter((l) => l.to !== '/estudio-audio' || studio).map((l) => (
              <Link className="more-card" to={l.to} key={l.to}>
                <h4>{l.title}</h4>
                <p>{l.hint}</p>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <h3 className="more-heading">{teacher ? 'Material' : 'Explorar'}</h3>
      <div className="more-grid">
        {LEARNER_LINKS.map((l) => (
          <Link className="more-card" to={l.to} key={l.to}>
            <h4>{l.title}</h4>
            <p>{l.hint}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
