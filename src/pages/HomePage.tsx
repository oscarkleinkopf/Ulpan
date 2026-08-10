import { Link } from 'react-router-dom'
import { DedicationBanner } from '../components/DedicationBanner'
import { lessons } from '../data/lessons'
import { useAuthContext } from '../lib/AuthProvider'
import { isTeacher } from '../lib/classroom'
import { dueCards } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function HomePage() {
  const { progress } = useProgress()
  const { user } = useAuthContext()
  const done = progress.completedLessons.length
  const due = dueCards(progress).length
  const next = lessons.find((l) => !progress.completedLessons.includes(l.id)) ?? lessons[0]
  const greet = progress.displayName.trim()
    ? `, ${progress.displayName.trim()}`
    : user?.name
      ? `, ${user.name}`
      : ''

  return (
    <>
      <section className="hero" aria-label="Portada">
        <div className="hero-bg" aria-hidden="true" />
        <div>
          <h1 className="hero-brand">
            Ulpan con la Mora Maggie
            <span className="he">אולפן עם המורה מגי</span>
          </h1>
          <p>
            {done === 0
              ? 'Hebreo desde cero con la Mora Maggie: alefato, vocabulario, gramática, frases y tareas semanales.'
              : `Shalom${greet}. Sigue tu camino o repasa lo pendiente.`}
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" to={next ? `/lecciones/${next.id}` : '/lecciones'}>
              {done === 0 ? 'Empezar' : 'Continuar'}
            </Link>
            <Link className="btn btn-ghost" to="/tareas">
              {user?.role && isTeacher(user.role) ? 'Asignar tareas' : 'Tareas'}
            </Link>
          </div>
        </div>
      </section>

      <DedicationBanner />

      <section className="section">
        <h2>Tu ritmo</h2>
        <p className="lead">El progreso se guarda en este dispositivo. Estudia un poco cada día.</p>
        <div className="stats-inline">
          <div>
            <strong>
              {done}/{lessons.length}
            </strong>
            Lecciones
          </div>
          <div>
            <strong>{progress.streak}</strong>
            Días seguidos
          </div>
          <div>
            <strong>{due}</strong>
            Para repasar
          </div>
          <div>
            <strong>{progress.xp}</strong>
            XP
          </div>
        </div>
        <div className="cta-row" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-outline" to="/cuenta">
            {user ? 'Mi cuenta' : 'Cuenta · Moré o Talmid'}
          </Link>
          <Link className="btn btn-outline" to={user?.role && isTeacher(user.role) ? '/tareas' : '/perfiles'}>
            {user?.role && isTeacher(user.role) ? 'Clase y tareas' : 'Unirme / perfiles'}
          </Link>
          <Link className="btn btn-outline" to="/progreso">
            Progreso
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Camino de aprendizaje</h2>
        <p className="lead">Del alefato a frases útiles. Transliteración en español: ח y כ suave = j (slijá, jaláv).</p>
        <div className="lesson-list">
          <Link className="lesson-row" to="/alefato">
            <div>
              <h4>1 · Alefato</h4>
              <p>22 letras, formas finales y vocales</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/lecciones">
            <div>
              <h4>2 · Lecciones</h4>
              <p>Saludos, números, días, verbos y más</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/vocabulario">
            <div>
              <h4>3 · Vocabulario</h4>
              <p>Léxico del curso por temas</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/gramatica">
            <div>
              <h4>4 · Gramática</h4>
              <p>Género, artículo ה, יֵשׁ/אֵין y presente</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/frases">
            <div>
              <h4>5 · Frases</h4>
              <p>Café, presentaciones y la calle</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/sionismo">
            <div>
              <h4>6 · Sionismo y calendario</h4>
              <p>Aliá, instituciones, Shoá–Zikarón–Atzmaút</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
