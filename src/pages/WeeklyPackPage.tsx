import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import { isTeacher, weekLabel } from '../lib/classroom'
import { useClassroom } from '../lib/useClassroom'
import { buildWeeklyPack, weeklyPackWhatsApp } from '../lib/weeklyPack'

export function WeeklyPackPage() {
  const { state, activeProfile } = useClassroom()
  const pack = useMemo(() => buildWeeklyPack(), [])
  const [copied, setCopied] = useState(false)
  const className = state.classroom?.name
  const text = weeklyPackWhatsApp(pack, className)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copiá el mensaje:', text)
    }
  }

  function printPack() {
    window.print()
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(text)}`

  return (
    <section className="section weekly-pack-page">
      <PageVisual sceneId="cafe" />
      <h2>Entrega semanal</h2>
      <p className="lead">
        {weekLabel(pack.weekKey)} · 5 palabras + 3 frases + foco cultural. Listo para WhatsApp o imprimir.
      </p>

      <div className="cta-row" style={{ marginBottom: '1rem' }}>
        <button type="button" className="btn btn-solid" onClick={() => void copy()}>
          {copied ? '¡Copiado!' : 'Copiar texto'}
        </button>
        <a className="btn btn-outline" href={waHref} target="_blank" rel="noreferrer">
          Abrir WhatsApp
        </a>
        <button type="button" className="btn btn-outline" onClick={printPack}>
          Imprimir / PDF
        </button>
        {activeProfile && isTeacher(activeProfile.role) ? (
          <Link className="btn btn-outline" to="/resumen-clase">
            Resumen de clase
          </Link>
        ) : null}
      </div>

      <article className="panel print-pack">
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Palabras
        </h3>
        <ul className="pack-list">
          {pack.words.map((w) => (
            <li key={w.id}>
              <span className="he">{w.hebrew}</span>
              <span>
                {w.translit} — {w.spanish}
              </span>
              <SpeakButton text={w.hebrew} />
            </li>
          ))}
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>Frases</h3>
        <ul className="pack-list">
          {pack.phrases.map((p) => (
            <li key={p.id}>
              <span className="he">{p.hebrew}</span>
              <span>
                {p.translit} — {p.spanish}
              </span>
              <SpeakButton text={p.hebrew} />
            </li>
          ))}
        </ul>

        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>Foco cultural</h3>
        <p className="he" style={{ fontSize: '1.4rem', margin: '0 0 0.35rem' }}>
          {pack.focusDay.hebrew}
        </p>
        <p style={{ margin: '0 0 0.75rem' }}>
          {pack.focusDay.spanish} · {pack.focusDay.hebrewMonth}
        </p>
        <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
          {pack.focusTerm.hebrew} ({pack.focusTerm.translit}) — {pack.focusTerm.spanish}
        </p>
      </article>

      <pre className="pack-preview" aria-label="Texto para WhatsApp">
        {text}
      </pre>
    </section>
  )
}
