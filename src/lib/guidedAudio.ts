import { getSupabase, isCloudConfigured } from './supabase'

export type GuidedAudioKind = 'letter' | 'vocab' | 'phrase' | 'lesson' | 'custom'

export type GuidedClip = {
  clipId: string
  kind: GuidedAudioKind
  hebrew: string
  translit: string
  spanish: string
  storagePath: string
  /** URL pública lista para <audio> */
  url: string
  updatedAt: string
}

const BUCKET = 'guided-audio'
const CACHE_KEY = 'ulpan-guided-audio-v1'

type CacheShape = { fetchedAt: number; clips: GuidedClip[] }

let memory: GuidedClip[] | null = null
let inflight: Promise<GuidedClip[]> | null = null

export function clipIdForLetter(id: string) {
  return `letter:${id}`
}
export function clipIdForVocab(id: string) {
  return `vocab:${id}`
}
export function clipIdForPhrase(id: string) {
  return `phrase:${id}`
}
export function clipIdForLessonStep(lessonId: string, stepIndex: number) {
  return `lesson:${lessonId}:${stepIndex}`
}

function publicUrlFor(path: string): string {
  const supabase = getSupabase()
  if (!supabase) return ''
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

function readCache(): GuidedClip[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CacheShape
    return Array.isArray(parsed.clips) ? parsed.clips : []
  } catch {
    return []
  }
}

function writeCache(clips: GuidedClip[]) {
  memory = clips
  try {
    const payload: CacheShape = { fetchedAt: Date.now(), clips }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
}

function mapRow(row: {
  clip_id: string
  kind: GuidedAudioKind
  hebrew: string
  translit: string
  spanish: string
  storage_path: string
  updated_at: string
}): GuidedClip {
  return {
    clipId: row.clip_id,
    kind: row.kind,
    hebrew: row.hebrew ?? '',
    translit: row.translit ?? '',
    spanish: row.spanish ?? '',
    storagePath: row.storage_path,
    url: publicUrlFor(row.storage_path),
    updatedAt: row.updated_at,
  }
}

/** Catálogo en memoria/caché (sin red). */
export function getGuidedClipsCached(): GuidedClip[] {
  if (memory) return memory
  memory = readCache()
  return memory
}

export function getGuidedClip(clipId: string): GuidedClip | undefined {
  return getGuidedClipsCached().find((c) => c.clipId === clipId)
}

export function guidedAudioUrl(clipId: string | undefined | null): string | undefined {
  if (!clipId) return undefined
  return getGuidedClip(clipId)?.url
}

/** Refresca el catálogo desde Supabase (público). */
export async function fetchGuidedClips(force = false): Promise<GuidedClip[]> {
  if (!isCloudConfigured()) {
    memory = memory ?? readCache()
    return memory
  }
  if (!force && memory && memory.length) return memory
  if (inflight) return inflight

  inflight = (async () => {
    const supabase = getSupabase()
    if (!supabase) {
      const cached = readCache()
      memory = cached
      return cached
    }
    const { data, error } = await supabase
      .from('guided_audio')
      .select('clip_id, kind, hebrew, translit, spanish, storage_path, updated_at')
      .order('updated_at', { ascending: false })

    if (error || !data) {
      const cached = readCache()
      memory = cached
      return cached
    }

    const clips = data.map((row) =>
      mapRow(row as {
        clip_id: string
        kind: GuidedAudioKind
        hebrew: string
        translit: string
        spanish: string
        storage_path: string
        updated_at: string
      }),
    )
    writeCache(clips)
    return clips
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
}

export type UploadClipInput = {
  clipId: string
  kind: GuidedAudioKind
  hebrew: string
  translit?: string
  spanish?: string
  blob: Blob
  ext?: string
}

export async function uploadGuidedClip(input: UploadClipInput): Promise<{ ok: true; clip: GuidedClip } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!supabase) return { ok: false, error: 'Supabase no está configurado.' }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Inicia sesión como Morá/Moré con permiso de grabación.' }

  const ext = input.ext || guessExt(input.blob.type) || 'webm'
  const path = `${user.id}/${sanitizeId(input.clipId)}.${ext}`

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, input.blob, {
    upsert: true,
    contentType: input.blob.type || `audio/${ext}`,
  })
  if (upErr) return { ok: false, error: upErr.message }

  const row = {
    clip_id: input.clipId,
    kind: input.kind,
    hebrew: input.hebrew,
    translit: input.translit ?? '',
    spanish: input.spanish ?? '',
    storage_path: path,
    created_by: user.id,
    updated_at: new Date().toISOString(),
  }

  const { error: dbErr } = await supabase.from('guided_audio').upsert(row, { onConflict: 'clip_id' })
  if (dbErr) return { ok: false, error: dbErr.message }

  const clip = mapRow({
    clip_id: row.clip_id,
    kind: row.kind,
    hebrew: row.hebrew,
    translit: row.translit,
    spanish: row.spanish,
    storage_path: row.storage_path,
    updated_at: row.updated_at,
  })

  const next = [clip, ...getGuidedClipsCached().filter((c) => c.clipId !== clip.clipId)]
  writeCache(next)
  return { ok: true, clip }
}

export async function deleteGuidedClip(clipId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!supabase) return { ok: false, error: 'Supabase no está configurado.' }

  const existing = getGuidedClip(clipId)
  if (existing?.storagePath) {
    await supabase.storage.from(BUCKET).remove([existing.storagePath])
  }

  const { error } = await supabase.from('guided_audio').delete().eq('clip_id', clipId)
  if (error) return { ok: false, error: error.message }

  writeCache(getGuidedClipsCached().filter((c) => c.clipId !== clipId))
  return { ok: true }
}

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9:_-]+/g, '_').slice(0, 120)
}

function guessExt(mime: string): string {
  if (mime.includes('mpeg') || mime.includes('mp3')) return 'mp3'
  if (mime.includes('mp4') || mime.includes('m4a')) return 'm4a'
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('wav')) return 'wav'
  if (mime.includes('webm')) return 'webm'
  return 'webm'
}
