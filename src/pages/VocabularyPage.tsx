import { useMemo, useState } from 'react'
import { tagLabels, vocabulary, vocabTags } from '../data/vocabulary'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import { enqueueForSrs } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function VocabularyPage() {
  const [filter, setFilter] = useState<string>('todos')
  const [query, setQuery] = useState('')
  const { update } = useProgress()

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vocabulary.filter((v) => {
      const tagOk = filter === 'todos' || v.tags.includes(filter)
      if (!tagOk) return false
      if (!q) return true
      return (
        v.spanish.toLowerCase().includes(q) ||
        v.translit.toLowerCase().includes(q) ||
        v.hebrew.includes(query.trim())
      )
    })
  }, [filter, query])

  function addVisible() {
    update((prev) => enqueueForSrs(prev, list.map((v) => ({ id: v.id, kind: 'vocab' as const }))))
  }

  return (
    <section className="section">
      <PageVisual sceneId="shuk" />
      <h2>Vocabulario</h2>
      <p className="lead">Explora el léxico del curso. Filtra por tema o busca en español, hebreo o transliteración.</p>

      <label className="field">
        <span>Buscar</span>
        <input
          type="search"
          value={query}
          placeholder="Ej. agua, shalom, בַּיִת"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="filter-chips">
        <button
          type="button"
          className={filter === 'todos' ? 'active' : undefined}
          onClick={() => setFilter('todos')}
        >
          Todos
        </button>
        {vocabTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'active' : undefined}
            onClick={() => setFilter(tag)}
          >
            {tagLabels[tag] ?? tag}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-outline" onClick={addVisible} disabled={list.length === 0}>
          Añadir visibles a práctica
        </button>
        <span style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{list.length} palabras</span>
      </div>

      <div className="vocab-list">
        {list.map((v) => (
          <div className="vocab-item" key={v.id}>
            <span className="he">{v.hebrew}</span>
            <div>
              <div className="es">{v.spanish}</div>
              <div className="tr">
                {v.translit} · {v.tags.map((t) => tagLabels[t] ?? t).join(', ')}
              </div>
            </div>
            <SpeakButton text={v.hebrew} />
          </div>
        ))}
      </div>
      {list.length === 0 ? <p className="empty-state">No hay resultados.</p> : null}
    </section>
  )
}
