import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import { pairPrompts } from '../lib/pairPractice'

export function PairPracticePage() {
  const prompts = useMemo(() => pairPrompts(), [])
  const [index, setIndex] = useState(0)
  const [turn, setTurn] = useState<'a' | 'b'>('a')
  const [revealed, setRevealed] = useState(false)
  const current = prompts[index] ?? prompts[0]

  if (!current) {
    return (
      <section className="section panel">
        <h2>Modo pareja</h2>
        <p className="lead">No hay prompts disponibles.</p>
      </section>
    )
  }

  const side = turn === 'a' ? current.a : current.b

  function nextPrompt() {
    setIndex((i) => (i + 1) % prompts.length)
    setTurn('a')
    setRevealed(false)
  }

  return (
    <section className="section">
      <PageVisual sceneId="aire" />
      <h2>Modo pareja</h2>
      <p className="lead">
        Dos personas, turnos cortos. La A habla, la B responde. Ideal en clase o en casa.
      </p>

      <p className="meta-row" style={{ justifyContent: 'space-between' }}>
        <span>
          {index + 1}/{prompts.length} · {current.situation}
        </span>
        <span>Turno {turn === 'a' ? 'A' : 'B'}</span>
      </p>

      <article className="panel pair-card">
        <p className="pair-tip">{side.tip}</p>
        {revealed ? (
          <>
            <div className="guided-card-he">
              <span className="he hebrew-xl" style={{ fontSize: '2.2rem' }}>
                {side.hebrew}
              </span>
              <SpeakButton text={side.hebrew} />
            </div>
            <p style={{ textAlign: 'center', margin: '0.35rem 0 0', color: 'var(--ink-soft)' }}>
              {side.translit}
            </p>
            <p style={{ textAlign: 'center', margin: '0.15rem 0 0', fontWeight: 600 }}>{side.spanish}</p>
          </>
        ) : (
          <p className="lead" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            Pensá tu línea… y tocá “Mostrar”.
          </p>
        )}
      </article>

      <div className="cta-row" style={{ marginTop: '1rem' }}>
        {!revealed ? (
          <button type="button" className="btn btn-solid" onClick={() => setRevealed(true)}>
            Mostrar línea
          </button>
        ) : turn === 'a' ? (
          <button
            type="button"
            className="btn btn-solid"
            onClick={() => {
              setTurn('b')
              setRevealed(false)
            }}
          >
            Pasar a turno B
          </button>
        ) : (
          <button type="button" className="btn btn-solid" onClick={nextPrompt}>
            Siguiente diálogo
          </button>
        )}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setTurn((t) => (t === 'a' ? 'b' : 'a'))
            setRevealed(false)
          }}
        >
          Cambiar turno
        </button>
        <Link className="btn btn-outline" to="/audio-guiado">
          Audio guiado
        </Link>
      </div>
    </section>
  )
}
