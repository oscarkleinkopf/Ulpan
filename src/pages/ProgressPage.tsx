import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { vocabulary } from '../data/vocabulary'
import { phrases } from '../data/phrases'
import { alphabet } from '../data/alphabet'
import { PageVisual } from '../components/PageVisual'
import { dueCards, resetProgress, setPreferences, type LearnerGender } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function ProgressPage() {
  const { progress, update } = useProgress()
  const due = dueCards(progress).length
  const mastered = Object.values(progress.srs).filter((c) => c.repetitions >= 3).length

  function onGender(value: LearnerGender) {
    update((prev) => setPreferences(prev, { learnerGender: value }))
  }

  function onReset() {
    if (!confirm('¿Borrar todo el progreso de este dispositivo?')) return
    update(() => resetProgress())
  }

  return (
    <section className="section">
      <PageVisual sceneId="progreso" />
      <h2>Tu progreso</h2>
      <p className="lead">Resumen de estudio y preferencias. Todo se guarda solo en este navegador.</p>

      <div className="stats-inline">
        <div>
          <strong>
            {progress.completedLessons.length}/{lessons.length}
          </strong>
          Lecciones
        </div>
        <div>
          <strong>{progress.streak}</strong>
          Racha
        </div>
        <div>
          <strong>{progress.xp}</strong>
          XP
        </div>
        <div>
          <strong>{due}</strong>
          Pendientes SRS
        </div>
        <div>
          <strong>{Object.keys(progress.srs).length}</strong>
          En el mazo
        </div>
        <div>
          <strong>{mastered}</strong>
          Con 3+ aciertos
        </div>
      </div>

      <div className="panel" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Preferencias
        </h3>
        <label className="field">
          <span>Nombre (opcional)</span>
          <input
            type="text"
            value={progress.displayName}
            placeholder="Cómo te gusta que te llamemos"
            onChange={(e) => update((prev) => setPreferences(prev, { displayName: e.target.value }))}
          />
        </label>
        <p style={{ marginBottom: '0.5rem', color: 'var(--ink-soft)' }}>
          Género gramatical preferido (para formas m./f.):
        </p>
        <div className="filter-chips">
          {(
            [
              ['unset', 'Sin preferencia'],
              ['m', 'Masculino'],
              ['f', 'Femenino'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={progress.learnerGender === value ? 'active' : undefined}
              onClick={() => onGender(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Contenido disponible
        </h3>
        <ul style={{ color: 'var(--ink-soft)', marginBottom: '1rem' }}>
          <li>{lessons.length} lecciones guiadas</li>
          <li>{alphabet.length} letras del alefato</li>
          <li>{vocabulary.length} palabras</li>
          <li>{phrases.length} frases</li>
        </ul>
        <div className="cta-row">
          <Link className="btn btn-solid" to="/practica">
            Ir a práctica
          </Link>
          <button type="button" className="btn btn-outline" onClick={onReset}>
            Reiniciar progreso
          </button>
        </div>
      </div>
    </section>
  )
}
