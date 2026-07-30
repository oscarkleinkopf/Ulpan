import { useState, type MouseEvent } from 'react'
import { speakHebrew } from '../lib/speak'

type Props = {
  text: string
  label?: string
}

export function SpeakButton({ text, label = 'Escuchar' }: Props) {
  const [state, setState] = useState<'idle' | 'speaking' | 'error'>('idle')

  async function onSpeak(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    setState('speaking')
    const result = await speakHebrew(text)
    if (result === 'ok') {
      setState('idle')
      return
    }
    setState('error')
    window.setTimeout(() => setState('idle'), 2500)
  }

  const title =
    state === 'error'
      ? 'No hay voz en hebreo en este dispositivo. En Chrome/Edge instala el idioma hebreo en el sistema.'
      : state === 'speaking'
        ? 'Reproduciendo…'
        : label

  return (
    <button
      type="button"
      className={`speak-btn${state === 'speaking' ? ' is-speaking' : ''}${state === 'error' ? ' is-error' : ''}`}
      aria-label={title}
      title={title}
      onClick={onSpeak}
    >
      {state === 'error' ? '!' : state === 'speaking' ? '…' : '▶'}
    </button>
  )
}
