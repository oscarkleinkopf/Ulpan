import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { springArc, zionistCalendarDays } from '../data/calendar'
import { zionismByGroup, zionismTerms, type ZionismGroup } from '../data/zionism'
import { SpeakButton } from '../components/SpeakButton'
import { enqueueForSrs } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function ZionismPage() {
  const groups = zionismByGroup()
  const [filter, setFilter] = useState<ZionismGroup | 'todos'>('todos')
  const { update } = useProgress()

  const visible = useMemo(() => {
    if (filter === 'todos') return groups
    return groups.filter((g) => g.group === filter)
  }, [filter, groups])

  const calendarTerms = zionismTerms.filter((t) => t.group === 'calendario')

  function addAll() {
    update((prev) =>
      enqueueForSrs(
        prev,
        zionismTerms.map((t) => ({ id: t.id, kind: 'vocab' as const })),
      ),
    )
  }

  function addCalendar() {
    update((prev) =>
      enqueueForSrs(
        prev,
        calendarTerms.map((t) => ({ id: t.id, kind: 'vocab' as const })),
      ),
    )
  }

  return (
    <section className="section">
      <h2>Sionismo</h2>
      <p className="lead">
        Léxico hebreo de conceptos, instituciones, símbolos y el calendario nacional. Enfoque lingüístico y cultural;
        transliteración en español (ח = j).
      </p>

      <div className="panel" style={{ marginBottom: '1.25rem' }}>
        <p className="he hebrew-xl" style={{ fontSize: '2.4rem', margin: '0 0 0.5rem' }}>
          צִיּוֹנוּת
        </p>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', margin: 0 }}>
          tzionút — sionismo · {zionismTerms.length} términos
        </p>
      </div>

      <div className="panel calendar-panel">
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Calendario sionista
        </h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
          El arco primaveral: de la memoria a la independencia.
        </p>
        <div className="calendar-arc" aria-label="Arco primaveral">
          {springArc.map((step, i) => (
            <div className="calendar-arc-step" key={step.id}>
              <span className="he">{step.he}</span>
              <strong>{step.label}</strong>
              {i < springArc.length - 1 ? <span className="calendar-arc-arrow" aria-hidden="true">→</span> : null}
            </div>
          ))}
        </div>
        <div className="calendar-day-list">
          {zionistCalendarDays.map((d) => (
            <div className={`calendar-day tone-${d.tone}`} key={d.id}>
              <div className="zion-term-head">
                <span className="he">{d.hebrew}</span>
                <SpeakButton text={d.hebrew.replace(/״/g, '')} />
              </div>
              <div className="es">{d.spanish}</div>
              <div className="tr">
                {d.translit} · {d.hebrewMonth}
              </div>
              <p className="zion-note">{d.note}</p>
            </div>
          ))}
        </div>
        <div className="cta-row" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-solid" to="/lecciones/u6-l1">
            Lecciones del calendario
          </Link>
          <button type="button" className="btn btn-outline" onClick={addCalendar}>
            Practicar léxico del calendario
          </button>
        </div>
      </div>

      <div className="filter-chips">
        <button
          type="button"
          className={filter === 'todos' ? 'active' : undefined}
          onClick={() => setFilter('todos')}
        >
          Todos
        </button>
        {groups.map((g) => (
          <button
            key={g.group}
            type="button"
            className={filter === g.group ? 'active' : undefined}
            onClick={() => setFilter(g.group)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        <button type="button" className="btn btn-solid" onClick={addAll}>
          Añadir todos a práctica
        </button>
        <Link className="btn btn-outline" to="/lecciones/u5-l1">
          Unidad 5 · Sionismo
        </Link>
        <Link className="btn btn-outline" to="/lecciones/u6-l1">
          Unidad 6 · Calendario
        </Link>
      </div>

      {visible.map(({ group, label, terms }) => (
        <div className="unit-block" key={group}>
          <h3>{label}</h3>
          <div className="vocab-list">
            {terms.map((t) => (
              <article className="zion-term" key={t.id}>
                <div className="zion-term-head">
                  <span className="he">{t.hebrew}</span>
                  <SpeakButton text={t.hebrew.replace(/״/g, '')} />
                </div>
                <div className="es">{t.spanish}</div>
                <div className="tr">{t.translit}</div>
                <p className="zion-note">{t.note}</p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
