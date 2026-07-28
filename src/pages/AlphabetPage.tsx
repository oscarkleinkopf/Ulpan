import { useState } from 'react'
import { alphabet, vowelMarks } from '../data/alphabet'
import { SpeakButton } from '../components/SpeakButton'
import { enqueueForSrs } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function AlphabetPage() {
  const [selectedId, setSelectedId] = useState(alphabet[0]?.id)
  const { update } = useProgress()
  const selected = alphabet.find((l) => l.id === selectedId) ?? alphabet[0]

  function addAllToPractice() {
    update((prev) =>
      enqueueForSrs(
        prev,
        alphabet.map((l) => ({ id: l.id, kind: 'letter' as const })),
      ),
    )
  }

  return (
    <section className="section">
      <h2>Alefato</h2>
      <p className="lead">
        Las 22 letras del hebreo. Toca una letra para ver detalles y escucharla. Cinco letras tienen forma final
        (sofit).
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" className="btn btn-solid" onClick={addAllToPractice}>
          Añadir letras a práctica
        </button>
      </div>
      <div className="letter-grid">
        {alphabet.map((letter) => (
          <button
            key={letter.id}
            type="button"
            className="letter-tile"
            aria-pressed={letter.id === selectedId}
            onClick={() => setSelectedId(letter.id)}
          >
            <span className="glyph">{letter.hebrew}</span>
            <span className="name">{letter.name}</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="detail-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <p className="hebrew-xl" style={{ margin: 0 }}>
              {selected.hebrew}
              {selected.final ? ` · ${selected.final}` : ''}
            </p>
            <SpeakButton text={selected.hebrew} />
          </div>
          <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
            {selected.name}
          </h3>
          <div className="meta-row">
            <span>Sonido: {selected.sound}</span>
            <span>Translit.: {selected.translit}</span>
          </div>
          {selected.note ? <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>{selected.note}</p> : null}
        </div>
      ) : null}

      <div className="panel" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Vocales (nikud)
        </h3>
        <p style={{ color: 'var(--ink-soft)' }}>
          En textos para principiantes verás estos signos. En carteles y periódicos suelen omitirse.
        </p>
        <div className="vocab-list">
          {vowelMarks.map((v) => (
            <div className="vocab-item" key={v.id}>
              <span className="he">{v.example}</span>
              <div>
                <div className="es">
                  {v.name} — {v.sound}
                </div>
                <div className="tr">Marca: {v.mark || '(combinada)'}</div>
              </div>
              <SpeakButton text={v.example} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
