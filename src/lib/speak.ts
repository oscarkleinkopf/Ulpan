/** Pronunciación en hebreo vía Web Speech API */

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null

function normalizeHebrew(text: string): string {
  return text
    .replace(/[״״""]/g, '')
    .replace(/[־–—]/g, ' ')
    .replace(/[·•]/g, ' ')
    .replace(/[?!¡¿.,;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }

  const synth = window.speechSynthesis
  const current = synth.getVoices()
  if (current.length > 0) return Promise.resolve(current)

  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const done = () => {
        synth.removeEventListener('voiceschanged', done)
        resolve(synth.getVoices())
      }
      synth.addEventListener('voiceschanged', done)
      // Algunos navegadores nunca disparan voiceschanged
      window.setTimeout(() => resolve(synth.getVoices()), 750)
    })
  }
  return voicesReady
}

function pickHebrewVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const scored = voices
    .map((v) => {
      const lang = v.lang.toLowerCase()
      let score = 0
      if (lang === 'he-il' || lang === 'he_il') score += 5
      if (lang.startsWith('he')) score += 4
      if (lang.includes('hebrew') || /עברית/.test(v.name)) score += 3
      if (/google|premium|enhanced|natural/i.test(v.name)) score += 1
      return { v, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored[0]?.v
}

export function warmSpeech(): void {
  void loadVoices()
}

export type SpeakResult = 'ok' | 'unsupported' | 'empty'

export async function speakHebrew(text: string): Promise<SpeakResult> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return 'unsupported'

  const clean = normalizeHebrew(text)
  if (!clean) return 'empty'

  const synth = window.speechSynthesis
  const voices = await loadVoices()
  const he = pickHebrewVoice(voices)

  synth.cancel()

  // Chrome a veces ignora el primer speak tras cancel(); un tick ayuda.
  await new Promise((r) => window.setTimeout(r, 40))

  const utter = new SpeechSynthesisUtterance(clean)
  if (he) {
    utter.voice = he
    utter.lang = he.lang
  } else {
    utter.lang = 'he-IL'
  }
  utter.rate = 0.88
  utter.pitch = 1

  return await new Promise((resolve) => {
    let settled = false
    const finish = (result: SpeakResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }
    utter.onend = () => finish('ok')
    utter.onerror = () => finish('unsupported')
    try {
      synth.speak(utter)
      // Si el motor queda en pausa (bug de Chrome), reanudar
      window.setTimeout(() => {
        if (synth.paused) synth.resume()
      }, 80)
      // Si nunca arranca, no dejar la promesa colgada
      window.setTimeout(() => {
        if (!settled && !synth.speaking) finish('unsupported')
      }, 1500)
    } catch {
      finish('unsupported')
    }
  })
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
