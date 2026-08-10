import { getClassroomSnapshot, replaceClassroomState } from './useClassroom'
import { getProgressSnapshot, replaceProgressState } from './useProgress'
import { getSupabase } from './supabase'
import { mergeClassroom, mergeProgress, normalizeBundle, type SyncBundle } from './syncMerge'

export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'error' | 'offline'

type SyncListener = (status: SyncStatus, detail?: string) => void

const listeners = new Set<SyncListener>()
let status: SyncStatus = 'idle'
let detail = ''
let pushTimer: ReturnType<typeof setTimeout> | null = null
let lastPushAt = 0
let cloudEnabled = false

/** Activa el auto-push solo cuando hay sesión (lo llama useAuth) */
export function setCloudAuthEnabled(enabled: boolean) {
  cloudEnabled = enabled
}

function setStatus(next: SyncStatus, nextDetail = '') {
  status = next
  detail = nextDetail
  for (const l of listeners) l(status, detail)
}

export function subscribeSyncStatus(listener: SyncListener) {
  listeners.add(listener)
  listener(status, detail)
  return () => {
    listeners.delete(listener)
  }
}

export function getSyncStatus() {
  return { status, detail }
}

function localBundle(): SyncBundle {
  return {
    progress: getProgressSnapshot(),
    classroom: getClassroomSnapshot(),
    clientUpdatedAt: new Date().toISOString(),
  }
}

async function requireUserId(): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user.id ?? null
}

async function fetchRemote(userId: string) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase no configurado')
  const { data, error } = await supabase
    .from('user_sync')
    .select('progress, classroom, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

async function upsertRemote(userId: string, bundle: SyncBundle) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('user_sync').upsert(
    {
      user_id: userId,
      progress: bundle.progress,
      classroom: bundle.classroom,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
  if (error) throw new Error(error.message)
}

/** Baja la copia remota, la fusiona con lo local y vuelve a subir el resultado */
export async function pullAndMergeCloud(): Promise<void> {
  const userId = await requireUserId()
  if (!userId) {
    setStatus('idle', 'Sin sesión')
    return
  }

  setStatus('syncing', 'Sincronizando…')
  try {
    const remote = await fetchRemote(userId)
    const local = localBundle()

    let merged = local
    if (remote && (remote.progress || remote.classroom)) {
      const remoteBundle = normalizeBundle({
        progress: remote.progress,
        classroom: remote.classroom,
        clientUpdatedAt: remote.updated_at,
      })
      if (remoteBundle) {
        merged = {
          progress: mergeProgress(local.progress, remoteBundle.progress),
          classroom: mergeClassroom(local.classroom, remoteBundle.classroom),
          clientUpdatedAt: new Date().toISOString(),
        }
        replaceProgressState(merged.progress)
        replaceClassroomState(merged.classroom)
      }
    }

    await upsertRemote(userId, merged)
    lastPushAt = Date.now()
    setStatus('ok', 'Sincronizado con la nube')
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudo sincronizar'
    setStatus(msg.includes('Failed to fetch') || msg.includes('Network') ? 'offline' : 'error', msg)
  }
}

export async function pushCloudNow(): Promise<void> {
  const userId = await requireUserId()
  if (!userId) return

  setStatus('syncing', 'Subiendo…')
  try {
    await upsertRemote(userId, localBundle())
    lastPushAt = Date.now()
    setStatus('ok', 'Guardado en la nube')
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudo subir'
    setStatus('error', msg)
  }
}

/** Empuja cambios locales con debounce (tras estudiar / marcar tareas) */
export function scheduleCloudPush() {
  if (!cloudEnabled) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushTimer = null
    if (Date.now() - lastPushAt < 800) return
    void pushCloudNow()
  }, 1600)
}
