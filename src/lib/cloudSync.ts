import { getUser } from '@netlify/identity'
import { getClassroomSnapshot, replaceClassroomState } from './useClassroom'
import { getProgressSnapshot, replaceProgressState } from './useProgress'
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

async function apiFetch(method: 'GET' | 'PUT', body?: SyncBundle) {
  const res = await fetch('/api/sync', {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) throw new Error('Inicia sesión para sincronizar.')
  if (res.status === 503) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error || 'La nube aún no está disponible en este entorno.')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Error de sincronización (${res.status})`)
  }
  return res.json()
}

/** Baja la copia remota, la fusiona con lo local y vuelve a subir el resultado */
export async function pullAndMergeCloud(): Promise<void> {
  const user = await getUser()
  if (!user) {
    setStatus('idle', 'Sin sesión')
    return
  }

  setStatus('syncing', 'Sincronizando…')
  try {
    const remote = await apiFetch('GET')
    const local = localBundle()
    const remoteBundle = normalizeBundle({
      progress: remote.progress,
      classroom: remote.classroom,
      clientUpdatedAt: remote.updatedAt ?? remote.clientUpdatedAt,
    })

    let merged = local
    if (remoteBundle && (remote.progress || remote.classroom)) {
      merged = {
        progress: mergeProgress(local.progress, remoteBundle.progress),
        classroom: mergeClassroom(local.classroom, remoteBundle.classroom),
        clientUpdatedAt: new Date().toISOString(),
      }
      replaceProgressState(merged.progress)
      replaceClassroomState(merged.classroom)
    }

    await apiFetch('PUT', merged)
    lastPushAt = Date.now()
    setStatus('ok', `Sincronizado · ${user.email ?? user.name ?? 'cuenta'}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'No se pudo sincronizar'
    setStatus(msg.includes('Failed to fetch') || msg.includes('Network') ? 'offline' : 'error', msg)
  }
}

export async function pushCloudNow(): Promise<void> {
  const user = await getUser()
  if (!user) return

  setStatus('syncing', 'Subiendo…')
  try {
    await apiFetch('PUT', localBundle())
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
    // Evita empujar si acabamos de hacer pullAndMerge
    if (Date.now() - lastPushAt < 800) return
    void pushCloudNow()
  }, 1600)
}
