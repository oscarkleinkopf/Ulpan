/** Pronunciación con Web Speech API (hebreo si el navegador lo permite) */

export function speakHebrew(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  const he =
    voices.find((v) => v.lang.startsWith('he')) ??
    voices.find((v) => v.lang.toLowerCase().includes('he'))
  if (he) utter.voice = he
  utter.lang = he?.lang ?? 'he-IL'
  utter.rate = 0.9
  window.speechSynthesis.speak(utter)
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
