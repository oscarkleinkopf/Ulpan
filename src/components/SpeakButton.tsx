import { useEffect, useState, type MouseEvent } from 'react'
import { guidedAudioUrl, getGuidedClip } from '../lib/guidedAudio'
import { speakGuided } from '../lib/speak'

type Props = {
  text: string
  /** Clave del clip (letter:… / phrase:… / …). Si hay grabación de la Mora, se usa primero. */
  clipId?: string
  label?: string
  /** Forzar URL de audio (p. ej. recién subida) */
  audioUrl?: string
}

export function SpeakButton({ text, clipId, label = 'Escuchar', audioUrl }: Props) {
  const [state, setState] = useState<'idle' | 'speaking' | 'error'>('idle')
  const [hasMora, setHasMora] = useState(Boolean(audioUrl || (clipId && guidedAudioUrl(clipId))))

  useEffect(() => {
    setHasMora(Boolean(audioUrl || (clipId && getGuidedClip(clipId))))
  }, [clipId, audioUrl])

  async function onSpeak(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    setState('speaking')
    const url = audioUrl || (clipId ? guidedAudioUrl(clipId) : undefined)
    const { result, source } = await speakGuided(text, url)
    if (source === 'mora') setHasMora(true)
    if (result === 'ok') {
      setState('idle')
      return
    }
    setState('error')
    window.setTimeout(() => setState('idle'), 2500)
  }

  const title =
    state === 'error'
      ? 'No se pudo reproducir el audio. Revisa tu conexión o prueba otro navegador.'
      : state === 'speaking'
        ? 'Reproduciendo…'
        : hasMora
          ? `${label} · voz de la Mora`
          : label

  return (
    <button
      type="button"
      className={`speak-btn${state === 'speaking' ? ' is-speaking' : ''}${state === 'error' ? ' is-error' : ''}${hasMora ? ' has-mora' : ''}`}
      aria-label={title}
      title={title}
      onClick={onSpeak}
    >
      {state === 'error' ? '!' : state === 'speaking' ? '…' : '▶'}
    </button>
  )
}
