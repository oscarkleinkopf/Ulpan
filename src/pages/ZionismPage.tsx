import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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

  function addAll() {
    update((prev) =>
      enqueueForSrs(
        prev,
        zionismTerms.map((t) => ({ id: t.id, kind: 'vocab' as const })),
      ),
    )
  }

  return (
    <section className="section">
      <h2>Sionismo</h2>
      <p className="lead">
        Léxico hebreo de conceptos, instituciones y símbolos del sionismo y de la historia israelí moderna. Enfoque
        lingüístico y cultural; transliteración en español (ח = j).
      </p>

      <div className="panel" style={{ marginBottom: '1.25rem' }}>
        <p className="he hebrew-xl" style={{ fontSize: '2.4rem', margin: '0 0 0.5rem' }}>
          צִיּוֹנוּת
        </p>
        <p style={{ textAlign: 'center', color: 'var(--ink-soft)', margin: 0 }}>
          tzionút — sionismo · {zionismTerms.length} términos
        </p>
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
          Ir a la lección
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
                  <SpeakButton text={t.hebrew} />
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
