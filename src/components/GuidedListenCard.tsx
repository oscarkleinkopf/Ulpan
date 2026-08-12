import { useEffect, useRef, useState } from 'react'
import { SpeakButton } from './SpeakButton'
import { speakGuided, stopSpeaking } from '../lib/speak'
import { guidedAudioUrl } from '../lib/guidedAudio'

type Props = {
  hebrew: string
  translit?: string
  spanish?: string
  clipId?: string
  audioUrl?: string
  /** Si true, muestra “escuchá · repetí” con pausa para el alumno */
  guided?: boolean
}

/**
 * Bloque de audio guiado: voz de la Mora (si hay clip) o TTS,
 * con modo escuchá-y-repetí.
 */
export function GuidedListenCard({
  hebrew,
  translit,
  spanish,
  clipId,
  audioUrl,
  guided = true,
}: Props) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'repeat' | 'done'>('idle')
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
      stopSpeaking()
    }
  }, [])

  async function startGuided() {
    setPhase('playing')
    const url = audioUrl || (clipId ? guidedAudioUrl(clipId) : undefined)
    const { result } = await speakGuided(hebrew, url)
    if (result !== 'ok') {
      setPhase('idle')
      return
    }
    setPhase('repeat')
    timer.current = window.setTimeout(() => setPhase('done'), 3500)
  }

  return (
    <article className="guided-card">
      <div className="guided-card-he">
        <span className="he hebrew-xl" style={{ fontSize: '2.4rem' }}>
          {hebrew}
        </span>
        <SpeakButton text={hebrew} clipId={clipId} audioUrl={audioUrl} label="Escuchar" />
      </div>
      {translit ? <p className="guided-card-translit">{translit}</p> : null}
      {spanish ? <p className="guided-card-es">{spanish}</p> : null}

      {guided ? (
        <div className="guided-card-actions">
          <button
            type="button"
            className="btn btn-solid"
            onClick={() => void startGuided()}
            disabled={phase === 'playing'}
          >
            {phase === 'playing' ? 'Escuchá…' : phase === 'repeat' ? '¡Ahora repetí!' : 'Escuchá y repetí'}
          </button>
          {phase === 'repeat' || phase === 'done' ? (
            <span className="guided-hint" aria-live="polite">
              {phase === 'repeat' ? 'Decilo en voz alta…' : '¡Bien! Tocá de nuevo cuando quieras.'}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
