/** Pronunciación en hebreo: TTS en línea + Web Speech como respaldo */

export type SpeakResult = 'ok' | 'unsupported' | 'empty'

let currentAudio: HTMLAudioElement | null = null
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null

function normalizeHebrew(text: string): string {
  return text
    .replace(/[״״""']/g, '')
    .replace(/[־–—]/g, ' ')
    .replace(/[·•]/g, ' ')
    .replace(/[?!¡¿.,;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

function stopAll(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

function googleTtsUrl(text: string): string {
  const q = encodeURIComponent(text)
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=he&q=${q}`
}

function playHtmlAudio(src: string): Promise<SpeakResult> {
  return new Promise((resolve) => {
    stopAll()
    const audio = document.createElement('audio')
    audio.preload = 'auto'
    audio.setAttribute('referrerpolicy', 'no-referrer')
    audio.src = src
    currentAudio = audio

    let settled = false
    const finish = (result: SpeakResult) => {
      if (settled) return
      settled = true
      if (currentAudio === audio) currentAudio = null
      resolve(result)
    }

    audio.onended = () => finish('ok')
    audio.onerror = () => finish('unsupported')
    void audio.play().then(
      () => {
        /* playing */
      },
      () => finish('unsupported'),
    )
  })
}

async function playBlob(blob: Blob): Promise<SpeakResult> {
  if (!blob.type.includes('audio') && blob.size < 500) return 'unsupported'
  const url = URL.createObjectURL(blob)
  try {
    const result = await playHtmlAudio(url)
    return result
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
  }
}

/** Proxy propio (Netlify). En GitHub Pages no existe y se ignora. */
async function speakViaProxy(text: string): Promise<SpeakResult | null> {
  try {
    const base = import.meta.env.BASE_URL || '/'
    const endpoint = new URL('api/tts', window.location.origin + base)
    endpoint.searchParams.set('q', text)
    const res = await fetch(endpoint.toString())
    if (!res.ok) return null
    const type = res.headers.get('content-type') || ''
    if (!type.includes('audio')) return null
    return await playBlob(await res.blob())
  } catch {
    return null
  }
}

async function speakViaGoogleAudio(text: string): Promise<SpeakResult> {
  return playHtmlAudio(googleTtsUrl(text))
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([])
  const synth = window.speechSynthesis
  const now = synth.getVoices()
  if (now.length) return Promise.resolve(now)
  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const done = () => {
        synth.removeEventListener('voiceschanged', done)
        resolve(synth.getVoices())
      }
      synth.addEventListener('voiceschanged', done)
      window.setTimeout(() => resolve(synth.getVoices()), 800)
    })
  }
  return voicesReady
}

async function speakViaWebSpeech(text: string): Promise<SpeakResult> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return 'unsupported'
  const voices = await loadVoices()
  const he =
    voices.find((v) => v.lang.toLowerCase().startsWith('he')) ??
    voices.find((v) => /hebrew|עברית/i.test(v.name))

  // Sin voz hebrea instalada, Web Speech suele fallar o leer mal
  if (!he) return 'unsupported'

  const synth = window.speechSynthesis
  synth.cancel()
  await new Promise((r) => setTimeout(r, 40))

  return await new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.voice = he
    utter.lang = he.lang || 'he-IL'
    utter.rate = 0.9
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
      window.setTimeout(() => {
        if (synth.paused) synth.resume()
      }, 60)
      window.setTimeout(() => {
        if (!settled && !synth.speaking) finish('unsupported')
      }, 1200)
    } catch {
      finish('unsupported')
    }
  })
}

export function warmSpeech(): void {
  void loadVoices()
  // Prefetch silencioso no aplica; solo calentar voces
}

async function speakViaCorsProxy(text: string): Promise<SpeakResult> {
  const target = googleTtsUrl(text)
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(target)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
  ]

  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy)
      if (!res.ok) continue
      const blob = await res.blob()
      if (blob.size < 800) continue
      const result = await playBlob(blob)
      if (result === 'ok') return result
    } catch {
      /* probar siguiente */
    }
  }
  return 'unsupported'
}

export async function speakHebrew(text: string): Promise<SpeakResult> {
  const clean = normalizeHebrew(text)
  if (!clean) return 'empty'

  stopAll()

  const viaProxy = await speakViaProxy(clean)
  if (viaProxy === 'ok') return 'ok'

  const viaGoogle = await speakViaGoogleAudio(clean)
  if (viaGoogle === 'ok') return 'ok'

  const viaCors = await speakViaCorsProxy(clean)
  if (viaCors === 'ok') return 'ok'

  return speakViaWebSpeech(clean)
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined'
}
