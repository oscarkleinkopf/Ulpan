import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import { springArc } from '../data/calendar'
import { clipIdForVocab } from '../lib/guidedAudio'
import { homeCalendarForDate } from '../lib/weeklyPack'
import { enqueueForSrs } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function HomeCalendarPage() {
  const { day, term, wordOfDay } = homeCalendarForDate()
  const { update } = useProgress()

  function addWord() {
    update((prev) => enqueueForSrs(prev, [{ id: wordOfDay.id, kind: 'vocab' }]))
  }

  return (
    <section className="section">
      <PageVisual sceneId="calendario" />
      <h2>Calendario en casa</h2>
      <p className="lead">
        Un foco cultural del día + una palabra para llevar a la mesa. Fechas del ciclo nacional según el calendario
        hebreo (orientativo).
      </p>

      <article className="panel home-cal-hero">
        <p className="eyebrow" style={{ margin: 0 }}>
          Hoy en el Ulpan
        </p>
        <p className="he hebrew-xl" style={{ fontSize: '2.6rem', margin: '0.4rem 0' }}>
          {day.hebrew}
        </p>
        <h3 style={{ margin: '0 0 0.35rem', fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          {day.spanish}
        </h3>
        <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
          {day.translit} · {day.hebrewMonth}
        </p>
        <p style={{ marginTop: '0.85rem' }}>{day.note}</p>
      </article>

      <div className="calendar-arc" aria-label="Arco primaveral" style={{ margin: '1.25rem 0' }}>
        {springArc.map((step) => (
          <div className="calendar-arc-step" key={step.id}>
            <span className="he">{step.he}</span>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <article className="panel">
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Palabra del día
        </h3>
        <div className="guided-card-he">
          <span className="he hebrew-xl" style={{ fontSize: '2.2rem' }}>
            {wordOfDay.hebrew}
          </span>
          <SpeakButton text={wordOfDay.hebrew} clipId={clipIdForVocab(wordOfDay.id)} />
        </div>
        <p style={{ textAlign: 'center', margin: '0.35rem 0 0' }}>
          {wordOfDay.translit} — {wordOfDay.spanish}
        </p>
        <div className="cta-row" style={{ marginTop: '1rem', justifyContent: 'center' }}>
          <button type="button" className="btn btn-solid" onClick={addWord}>
            Añadir a práctica
          </button>
          <Link className="btn btn-outline" to="/sionismo">
            Más calendario
          </Link>
        </div>
      </article>

      <article className="panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Término para la casa
        </h3>
        <p className="he" style={{ fontSize: '1.5rem', margin: '0 0 0.35rem' }}>
          {term.hebrew}
        </p>
        <p style={{ margin: 0 }}>
          {term.translit} — {term.spanish}
        </p>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 0 }}>{term.note}</p>
      </article>
    </section>
  )
}
