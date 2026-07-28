import { speakHebrew } from '../lib/speak'

type Props = {
  text: string
  label?: string
}

export function SpeakButton({ text, label = 'Escuchar' }: Props) {
  return (
    <button
      type="button"
      className="speak-btn"
      aria-label={label}
      title={label}
      onClick={() => speakHebrew(text)}
    >
      ▶
    </button>
  )
}
