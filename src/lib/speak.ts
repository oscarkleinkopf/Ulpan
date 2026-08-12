/** Pronunciación en hebreo: voz de la Mora / TTS en línea / Web Speech */

export type SpeakResult = 'ok' | 'unsupported' | 'empty'

let currentAudio: HTMLAudioElement | null = null
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null
let proxyKnownDead = false

/** Blob URLs de TTS ya descargados (clave = texto normalizado) */
const ttsBlobCache = new Map<string, string>()
/** Elementos <audio> precargados por URL (clips de la Mora) */
const audioElCache = new Map<string, HTMLAudioElement>()

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

function isGitHubPages(): boolean {
  if (typeof window === 'undefined') return false
  const base = import.meta.env.BASE_URL || '/'
  return (
    base.includes('/Ulpan') ||
    window.location.hostname.endsWith('github.io') ||
    window.location.hostname.endsWith('githubusercontent.com')
  )
}

function stopAll(): void {
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
    } catch {
      /* ignore */
    }
    // No vaciar src de clips cacheados: se reutilizan
    if (![...audioElCache.values()].includes(currentAudio)) {
      currentAudio.removeAttribute('src')
      currentAudio.load()
    }
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

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit): Promise<Response | null> {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...init, signal: ctrl.signal })
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

function playCachedElement(audio: HTMLAudioElement): Promise<SpeakResult> {
  return new Promise((resolve) => {
    stopAll()
    currentAudio = audio
    let settled = false
    const finish = (result: SpeakResult) => {
      if (settled) return
      settled = true
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      if (currentAudio === audio) currentAudio = null
      resolve(result)
    }
    const onEnded = () => finish('ok')
    const onError = () => finish('unsupported')
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    try {
      audio.currentTime = 0
    } catch {
      /* ignore */
    }

    void audio.play().then(
      () => {
        /* playing — el resultado final llega en ended */
      },
      () => finish('unsupported'),
    )
  })
}

function playHtmlAudio(src: string, timeoutMs = 2500): Promise<SpeakResult> {
  return new Promise((resolve) => {
    stopAll()
    const audio = document.createElement('audio')
    audio.preload = 'auto'
    audio.setAttribute('referrerpolicy', 'no-referrer')
    audio.crossOrigin = 'anonymous'
    audio.src = src
    currentAudio = audio

    let settled = false
    const finish = (result: SpeakResult) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      if (currentAudio === audio) currentAudio = null
      resolve(result)
    }

    const timer = window.setTimeout(() => {
      // Si ya está sonando, no cortamos por timeout de arranque
      if (!audio.paused && !audio.ended) return
      finish('unsupported')
    }, timeoutMs)

    audio.onended = () => finish('ok')
    audio.onerror = () => finish('unsupported')
    // canplaythrough: empezó a cargar bien
    audio.onplaying = () => {
      window.clearTimeout(timer)
    }
    void audio.play().then(
      () => {
        /* ok */
      },
      () => finish('unsupported'),
    )
  })
}

async function playBlob(blob: Blob): Promise<SpeakResult> {
  if (blob.size < 400) return 'unsupported'
  const type = blob.type || ''
  if (type && !type.includes('audio') && !type.includes('octet-stream') && !type.includes('mpeg')) {
    return 'unsupported'
  }
  const url = URL.createObjectURL(blob)
  return playHtmlAudio(url, 4000)
}

/** Proxy propio (Netlify). En GitHub Pages se omite. */
async function speakViaProxy(text: string): Promise<SpeakResult | null> {
  if (proxyKnownDead || isGitHubPages()) return null
  try {
    const base = import.meta.env.BASE_URL || '/'
    const endpoint = new URL('api/tts', window.location.origin + base)
    endpoint.searchParams.set('q', text)
    const res = await fetchWithTimeout(endpoint.toString(), 700)
    if (!res || !res.ok) {
      proxyKnownDead = true
      return null
    }
    const type = res.headers.get('content-type') || ''
    if (!type.includes('audio')) {
      proxyKnownDead = true
      return null
    }
    return await playBlob(await res.blob())
  } catch {
    proxyKnownDead = true
    return null
  }
}

function getHebrewVoiceSync(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith('he')) ??
    voices.find((v) => /hebrew|עברית/i.test(v.name)) ??
    null
  )
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
      window.setTimeout(() => resolve(synth.getVoices()), 400)
    })
  }
  return voicesReady
}

async function speakViaWebSpeech(text: string, voice?: SpeechSynthesisVoice | null): Promise<SpeakResult> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return 'unsupported'
  const he = voice ?? getHebrewVoiceSync() ?? (await loadVoices()).find((v) => v.lang.toLowerCase().startsWith('he'))
  if (!he) return 'unsupported'

  const synth = window.speechSynthesis
  synth.cancel()

  return await new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.voice = he
    utter.lang = he.lang || 'he-IL'
    utter.rate = 0.92
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
      }, 40)
      window.setTimeout(() => {
        if (!settled && !synth.speaking) finish('unsupported')
      }, 900)
    } catch {
      finish('unsupported')
    }
  })
}

async function fetchGoogleTtsBlob(text: string): Promise<Blob | null> {
  const target = googleTtsUrl(text)
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(target)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
  ]

  for (const proxy of proxies) {
    const res = await fetchWithTimeout(proxy, 1800)
    if (!res || !res.ok) continue
    try {
      const blob = await res.blob()
      if (blob.size < 800) continue
      return blob
    } catch {
      /* siguiente */
    }
  }
  return null
}

/**
 * Precarga un clip (voz Mora u otra URL) para que el play sea casi inmediato.
 */
export function prefetchAudioUrl(url: string | undefined | null): void {
  if (!url || typeof window === 'undefined') return
  if (audioElCache.has(url)) return
  const audio = new Audio()
  audio.preload = 'auto'
  audio.src = url
  audioElCache.set(url, audio)
}

/** Precarga TTS (en segundo plano) para un texto hebreo. */
export function prefetchHebrew(text: string): void {
  const clean = normalizeHebrew(text)
  if (!clean || ttsBlobCache.has(clean)) return
  void (async () => {
    const blob = await fetchGoogleTtsBlob(clean)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    ttsBlobCache.set(clean, url)
  })()
}

export function warmSpeech(): void {
  void loadVoices()
}

export async function speakHebrew(text: string): Promise<SpeakResult> {
  const clean = normalizeHebrew(text)
  if (!clean) return 'empty'

  stopAll()

  // 1) Caché local: respuesta inmediata
  const cached = ttsBlobCache.get(clean)
  if (cached) {
    const played = await playHtmlAudio(cached, 4000)
    if (played === 'ok') return 'ok'
    ttsBlobCache.delete(clean)
  }

  // 2) Web Speech si ya hay voz hebrea (sin red)
  const heReady = getHebrewVoiceSync()
  if (heReady) {
    const local = await speakViaWebSpeech(clean, heReady)
    if (local === 'ok') return 'ok'
  }

  // 3) Proxy Netlify solo fuera de Pages, con timeout corto
  const viaProxy = await speakViaProxy(clean)
  if (viaProxy === 'ok') return 'ok'

  // 4) Google TTS vía proxy CORS (el directo suele bloquearse)
  const blob = await fetchGoogleTtsBlob(clean)
  if (blob) {
    const url = URL.createObjectURL(blob)
    ttsBlobCache.set(clean, url)
    const played = await playHtmlAudio(url, 4000)
    if (played === 'ok') return 'ok'
  }

  // 5) Intento directo corto
  const viaGoogle = await playHtmlAudio(googleTtsUrl(clean), 1200)
  if (viaGoogle === 'ok') return 'ok'

  // 6) Web Speech esperando voces
  return speakViaWebSpeech(clean)
}

/** Reproduce un archivo de audio (voz de la Mora) por URL. */
export async function playAudioUrl(url: string): Promise<SpeakResult> {
  if (!url.trim()) return 'empty'
  let audio = audioElCache.get(url)
  if (!audio) {
    audio = new Audio()
    audio.preload = 'auto'
    audio.src = url
    audioElCache.set(url, audio)
  }

  // Si aún no cargó, esperar un tope breve a canplay
  if (audio.readyState < 2) {
    await new Promise<void>((resolve) => {
      const done = () => {
        audio!.removeEventListener('canplay', done)
        audio!.removeEventListener('error', done)
        resolve()
      }
      audio!.addEventListener('canplay', done)
      audio!.addEventListener('error', done)
      window.setTimeout(done, 900)
    })
  }

  return playCachedElement(audio)
}

/**
 * Preferí la grabación de la Mora si hay URL; si no, TTS.
 * Devuelve `{ result, source }`.
 */
export async function speakGuided(
  text: string,
  recordedUrl?: string | null,
): Promise<{ result: SpeakResult; source: 'mora' | 'tts' | 'none' }> {
  if (recordedUrl) {
    prefetchAudioUrl(recordedUrl)
    const played = await playAudioUrl(recordedUrl)
    if (played === 'ok') return { result: 'ok', source: 'mora' }
  }
  const result = await speakHebrew(text)
  if (result === 'ok') return { result, source: 'tts' }
  return { result, source: 'none' }
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined'
}

export function stopSpeaking(): void {
  stopAll()
}
