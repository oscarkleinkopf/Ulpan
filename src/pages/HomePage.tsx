import { Link } from 'react-router-dom'
import { DedicationBanner } from '../components/DedicationBanner'
import { MaggieGallery } from '../components/MaggieGallery'
import { SpeakButton } from '../components/SpeakButton'
import { maggieHero } from '../data/maggieScenes'
import { clipIdForVocab } from '../lib/guidedAudio'
import { useAuthContext } from '../lib/AuthProvider'
import { enqueueForSrs } from '../lib/progress'
import { buildTodayView } from '../lib/today'
import { useClassroom } from '../lib/useClassroom'
import { useProgress } from '../lib/useProgress'

export function HomePage() {
  const { progress, update } = useProgress()
  const { user } = useAuthContext()
  const { state } = useClassroom()
  const today = buildTodayView(progress, state, {
    accountRole: user?.role,
    accountName: user?.name,
  })
  const { learner, teacher, calendar, isTeacher } = today
  const greet = learner.greetName ? `, ${learner.greetName}` : ''
  const base = import.meta.env.BASE_URL

  return (
    <>
      <section className="hero" aria-label="Hoy en el Ulpan">
        <div className="hero-bg hero-bg--photo" aria-hidden="true">
          <picture>
            <source srcSet={`${base}${maggieHero.webp}`} type="image/webp" />
            <img src={`${base}${maggieHero.jpg}`} alt="" className="hero-photo" />
          </picture>
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">Hoy en el Ulpan</p>
          <h1 className="hero-brand">
            {learner.completedLessons === 0 ? 'Ulpan con la Mora Maggie' : `Shalom${greet}`}
            <span className="he">אולפן עם המורה מגי</span>
          </h1>
          <p>
            {learner.completedLessons === 0
              ? 'Tres pasos para hoy: lección, repaso y la tarea de Maggie.'
              : `Lección ${learner.completedLessons}/${learner.totalLessons} · racha ${learner.streak} · ${learner.dueCount} para repasar.`}
          </p>
        </div>
      </section>

      <section className="section today-section" aria-label="Tu camino de hoy">
        <div className="today-cta-grid">
          <Link className="today-cta today-cta--primary" to={learner.primary.href}>
            <span className="today-cta-label">{learner.primary.label}</span>
            <span className="today-cta-hint">{learner.primary.hint}</span>
          </Link>
          <Link className="today-cta" to={learner.review.href}>
            <span className="today-cta-label">{learner.review.label}</span>
            <span className="today-cta-hint">{learner.review.hint}</span>
          </Link>
          <Link className="today-cta" to={learner.taskCta.href}>
            <span className="today-cta-label">{learner.taskCta.label}</span>
            <span className="today-cta-hint">{learner.taskCta.hint}</span>
          </Link>
        </div>
      </section>

      {isTeacher && teacher ? (
        <section className="section">
          <h2>Aula de hoy</h2>
          {teacher.digest ? (
            <>
              <p className="lead">
                {teacher.digest.weekLabel} · {teacher.digest.className} ({teacher.digest.code})
              </p>
              <div className="stats-inline">
                <div>
                  <strong>{teacher.studentCount}</strong>
                  Talmidim
                </div>
                <div>
                  <strong>{teacher.taskCount}</strong>
                  Tareas
                </div>
                <div>
                  <strong>{teacher.digest.doneRate}%</strong>
                  Avance
                </div>
                <div>
                  <strong>{teacher.pendingReview}</strong>
                  Por revisar
                </div>
              </div>
              {teacher.missingAll.length > 0 ? (
                <p className="banner-msg" style={{ marginTop: '1rem' }}>
                  Sin entregar: {teacher.missingAll.map((r) => r.student.name).join(', ')}
                </p>
              ) : null}
              <div className="cta-row" style={{ marginTop: '1rem' }}>
                <Link className="btn btn-solid" to="/tareas">
                  Revisar entregas
                </Link>
                <Link className="btn btn-outline" to="/resumen-clase">
                  Resumen
                </Link>
                <Link className="btn btn-outline" to="/entrega-semanal">
                  Pack semanal
                </Link>
              </div>
            </>
          ) : (
            <div className="panel">
              <p className="lead" style={{ margin: 0 }}>
                Todavía no hay clase. Creá el aula y el código para que se unan los talmidim.
              </p>
              <div className="cta-row" style={{ marginTop: '1rem' }}>
                <Link className="btn btn-solid" to="/perfiles">
                  Crear clase
                </Link>
              </div>
            </div>
          )}
        </section>
      ) : null}

      <section className="section">
        <h2>Palabra del día</h2>
        <article className="panel today-word">
          <p className="eyebrow" style={{ margin: 0 }}>
            {calendar.day.spanish}
          </p>
          <div className="guided-card-he">
            <span className="he hebrew-xl" style={{ fontSize: '2.2rem' }}>
              {calendar.wordOfDay.hebrew}
            </span>
            <SpeakButton text={calendar.wordOfDay.hebrew} clipId={clipIdForVocab(calendar.wordOfDay.id)} />
          </div>
          <p style={{ textAlign: 'center', margin: '0.35rem 0 0' }}>
            {calendar.wordOfDay.translit} — {calendar.wordOfDay.spanish}
          </p>
          <div className="cta-row" style={{ marginTop: '0.85rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => update((prev) => enqueueForSrs(prev, [{ id: calendar.wordOfDay.id, kind: 'vocab' }]))}
            >
              Añadir a práctica
            </button>
            <Link className="btn btn-outline" to="/calendario">
              Calendario
            </Link>
          </div>
        </article>
      </section>

      <DedicationBanner compact />

      <section className="section">
        <h2>Tu ritmo</h2>
        <div className="stats-inline">
          <div>
            <strong>
              {learner.completedLessons}/{learner.totalLessons}
            </strong>
            Lecciones
          </div>
          <div>
            <strong>{learner.streak}</strong>
            Días seguidos
          </div>
          <div>
            <strong>{learner.dueCount}</strong>
            Para repasar
          </div>
          <div>
            <strong>{learner.xp}</strong>
            XP
          </div>
        </div>
      </section>

      <MaggieGallery />
    </>
  )
}
