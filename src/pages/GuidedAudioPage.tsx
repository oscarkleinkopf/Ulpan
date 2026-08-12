import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GuidedListenCard } from '../components/GuidedListenCard'
import { PageVisual } from '../components/PageVisual'
import { phrases } from '../data/phrases'
import { vocabulary } from '../data/vocabulary'
import { canRecordAudio } from '../lib/accountRole'
import {
  clipIdForPhrase,
  clipIdForVocab,
  fetchGuidedClips,
  getGuidedClipsCached,
  type GuidedClip,
} from '../lib/guidedAudio'
import { useAuthContext } from '../lib/AuthProvider'

type Item = {
  clipId: string
  hebrew: string
  translit: string
  spanish: string
  hasMora: boolean
}

export function GuidedAudioPage() {
  const { user } = useAuthContext()
  const [clips, setClips] = useState<GuidedClip[]>(() => getGuidedClipsCached())
  const [onlyMora, setOnlyMora] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    void fetchGuidedClips(true).then(setClips)
  }, [])

  const items = useMemo(() => {
    const mora = new Set(clips.map((c) => c.clipId))
    const fromPhrases: Item[] = phrases.map((p) => ({
      clipId: clipIdForPhrase(p.id),
      hebrew: p.hebrew,
      translit: p.translit,
      spanish: p.spanish,
      hasMora: mora.has(clipIdForPhrase(p.id)),
    }))
    const fromVocab: Item[] = vocabulary.slice(0, 40).map((v) => ({
      clipId: clipIdForVocab(v.id),
      hebrew: v.hebrew,
      translit: v.translit,
      spanish: v.spanish,
      hasMora: mora.has(clipIdForVocab(v.id)),
    }))
    const merged = [...fromPhrases, ...fromVocab]
    // Preferir ítems con voz de la Mora al frente
    merged.sort((a, b) => Number(b.hasMora) - Number(a.hasMora))
    return onlyMora ? merged.filter((i) => i.hasMora) : merged
  }, [clips, onlyMora])

  const current = items[index] ?? items[0]

  useEffect(() => {
    setIndex(0)
  }, [onlyMora, items.length])

  return (
    <section className="section">
      <PageVisual sceneId="cafe" />
      <h2>Audio guiado</h2>
      <p className="lead">
        Escuchá y repetí. Si la Mora grabó su voz, se usa esa grabación; si no, un TTS de respaldo.
      </p>

      <div className="cta-row" style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className={`btn ${onlyMora ? 'btn-solid' : 'btn-outline'}`}
          onClick={() => setOnlyMora((v) => !v)}
        >
          {onlyMora ? 'Solo voz de la Mora' : 'Mostrar también TTS'}
        </button>
        {canRecordAudio(user) ? (
          <Link className="btn btn-outline" to="/estudio-audio">
            Grabar (estudio)
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="panel">
          <p className="lead" style={{ margin: 0 }}>
            Todavía no hay clips con voz de la Mora. Podés practicar igual con TTS, o pedirle a la Mora que grabe
            desde el estudio.
          </p>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-solid" onClick={() => setOnlyMora(false)}>
              Practicar con TTS
            </button>
          </div>
        </div>
      ) : current ? (
        <>
          <p className="meta-row" style={{ justifyContent: 'space-between' }}>
            <span>
              {index + 1}/{items.length}
            </span>
            <span>{current.hasMora ? 'Voz de la Mora' : 'TTS'}</span>
          </p>
          <GuidedListenCard
            key={current.clipId}
            hebrew={current.hebrew}
            translit={current.translit}
            spanish={current.spanish}
            clipId={current.clipId}
            audioUrl={clips.find((c) => c.clipId === current.clipId)?.url}
          />
          <div className="step-actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              disabled={index <= 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="btn btn-solid"
              disabled={index >= items.length - 1}
              onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : null}
    </section>
  )
}
