import { Link } from 'react-router-dom'
import { alphabet } from '../data/alphabet'
import { phrases } from '../data/phrases'
import { vocabulary } from '../data/vocabulary'
import { SpeakButton } from '../components/SpeakButton'
import { dueCards, enqueueForSrs, reviewCard, type SrsCard } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { useMemo, useState } from 'react'

type Prompt = {
  card: SrsCard
  front: string
  frontHe: string
  back: string
  backExtra?: string
}

function resolvePrompt(card: SrsCard): Prompt | null {
  if (card.kind === 'letter') {
    const letter = alphabet.find((l) => l.id === card.id)
    if (!letter) return null
    return {
      card,
      front: '¿Qué letra es?',
      frontHe: letter.hebrew,
      back: `${letter.name} · ${letter.sound}`,
      backExtra: letter.translit,
    }
  }
  if (card.kind === 'vocab') {
    const v = vocabulary.find((x) => x.id === card.id)
    if (!v) return null
    return {
      card,
      front: '¿Qué significa?',
      frontHe: v.hebrew,
      back: v.spanish,
      backExtra: v.translit,
    }
  }
  const p = phrases.find((x) => x.id === card.id)
  if (!p) return null
  return {
    card,
    front: '¿Qué significa esta frase?',
    frontHe: p.hebrew,
    back: p.spanish,
    backExtra: p.translit,
  }
}

export function PracticePage() {
  const { progress, update } = useProgress()
  const [mode, setMode] = useState<'hub' | 'srs'>('hub')
  const [revealed, setRevealed] = useState(false)
  const [sessionDone, setSessionDone] = useState(0)

  const queue = useMemo(() => dueCards(progress, 25).map(resolvePrompt).filter(Boolean) as Prompt[], [progress])
  const current = queue[0]
  const due = dueCards(progress).length

  function seedStarterDeck() {
    update((prev) =>
      enqueueForSrs(prev, [
        ...vocabulary.slice(0, 12).map((v) => ({ id: v.id, kind: 'vocab' as const })),
        ...alphabet.slice(0, 8).map((l) => ({ id: l.id, kind: 'letter' as const })),
        ...phrases.slice(0, 6).map((p) => ({ id: p.id, kind: 'phrase' as const })),
      ]),
    )
  }

  function rate(q: 0 | 1 | 2 | 3) {
    if (!current) return
    update((prev) => reviewCard(prev, current.card.id, current.card.kind, q))
    setRevealed(false)
    setSessionDone((n) => n + 1)
  }

  if (mode === 'hub') {
    return (
      <section className="section">
        <h2>Práctica</h2>
        <p className="lead">Elige cómo quieres entrenar hoy.</p>
        <div className="lesson-list">
          <button type="button" className="lesson-row" onClick={() => { setMode('srs'); setSessionDone(0); setRevealed(false) }}>
            <div>
              <h4>Repetición espaciada</h4>
              <p>{due > 0 ? `${due} tarjetas pendientes` : 'Sin pendientes · puedes cargar un mazo'}</p>
            </div>
          </button>
          <Link className="lesson-row" to="/quiz">
            <div>
              <h4>Quiz rápido</h4>
              <p>Letras y vocabulario a opción múltiple</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/vocabulario">
            <div>
              <h4>Explorar vocabulario</h4>
              <p>{vocabulary.length} palabras del curso</p>
            </div>
          </Link>
        </div>
      </section>
    )
  }

  if (!current) {
    return (
      <section className="section panel">
        <h2>Repetición espaciada</h2>
        <p className="lead">
          {sessionDone > 0
            ? `Repasaste ${sessionDone} tarjeta${sessionDone === 1 ? '' : 's'}. No hay más pendientes ahora.`
            : 'Aún no hay tarjetas pendientes. Completa lecciones o carga un mazo inicial.'}
        </p>
        <div className="cta-row" style={{ marginTop: '1rem' }}>
          <button type="button" className="btn btn-solid" onClick={seedStarterDeck}>
            Cargar mazo inicial
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setMode('hub')}>
            Volver
          </button>
        </div>
        <p className="empty-state" style={{ paddingTop: '1.5rem' }}>
          Mazo total: {Object.keys(progress.srs).length} · Racha: {progress.streak} días
        </p>
      </section>
    )
  }

  return (
    <section className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0 }}>Repetición espaciada</h2>
        <button type="button" className="btn btn-outline" onClick={() => setMode('hub')}>
          Salir
        </button>
      </div>
      <p className="lead">Mira el hebreo, intenta recordar, revela y valora cómo te fue.</p>
      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, ((sessionDone + 1) / (sessionDone + queue.length)) * 100)}%` }}
        />
      </div>
      <p className="meta-row" style={{ justifyContent: 'space-between' }}>
        <span>Pendientes: {queue.length}</span>
        <span>En esta sesión: {sessionDone}</span>
      </p>

      <div className="panel" onClick={() => !revealed && setRevealed(true)} role="presentation">
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', marginTop: 0 }}>{current.front}</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <p className="hebrew-xl">{current.frontHe}</p>
          <SpeakButton text={current.frontHe} />
        </div>

        {!revealed ? (
          <>
            <p className="flip-hint">Toca la tarjeta para revelar</p>
            <div className="step-actions" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn btn-solid" onClick={() => setRevealed(true)}>
                Mostrar respuesta
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
              {current.back}
            </h3>
            {current.backExtra ? (
              <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>{current.backExtra}</p>
            ) : null}
            <div className="srs-quality">
              <button type="button" onClick={() => rate(0)}>
                Otra vez
              </button>
              <button type="button" onClick={() => rate(1)}>
                Difícil
              </button>
              <button type="button" onClick={() => rate(2)}>
                Bien
              </button>
              <button type="button" onClick={() => rate(3)}>
                Fácil
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
