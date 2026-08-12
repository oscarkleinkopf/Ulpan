import { useMemo, useState } from 'react'
import { phrases } from '../data/phrases'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import { enqueueForSrs } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function PhrasesPage() {
  const situations = useMemo(
    () => [...new Set(phrases.map((p) => p.situation))],
    [],
  )
  const [filter, setFilter] = useState<string>('Todas')
  const { update } = useProgress()
  const list = filter === 'Todas' ? phrases : phrases.filter((p) => p.situation === filter)

  function addVisible() {
    update((prev) =>
      enqueueForSrs(
        prev,
        list.map((p) => ({ id: p.id, kind: 'phrase' as const })),
      ),
    )
  }

  return (
    <section className="section">
      <PageVisual sceneId="cafe" />
      <h2>Frases útiles</h2>
      <p className="lead">Expresiones listas para presentarte, pedir en un café o desenvolverte en la calle.</p>
      <div className="filter-chips">
        <button type="button" className={filter === 'Todas' ? 'active' : undefined} onClick={() => setFilter('Todas')}>
          Todas
        </button>
        {situations.map((s) => (
          <button
            key={s}
            type="button"
            className={filter === s ? 'active' : undefined}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" className="btn btn-outline" onClick={addVisible}>
          Añadir a práctica
        </button>
      </div>
      <div className="phrase-list">
        {list.map((p) => (
          <div className="phrase-item" key={p.id}>
            <span className="he">{p.hebrew}</span>
            <div>
              <div className="es">{p.spanish}</div>
              <div className="tr">
                {p.translit} · {p.situation}
              </div>
            </div>
            <SpeakButton text={p.hebrew} />
          </div>
        ))}
      </div>
    </section>
  )
}
