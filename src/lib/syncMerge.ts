import type { ClassroomState } from './classroom'
import { defaultClassroomState } from './classroom'
import type { ProgressState, SrsCard } from './progress'
import { defaultProgress } from './progress'

export type SyncBundle = {
  progress: ProgressState
  classroom: ClassroomState
  clientUpdatedAt: string
}

function mergeSrs(a: Record<string, SrsCard>, b: Record<string, SrsCard>): Record<string, SrsCard> {
  const out = { ...a }
  for (const [id, card] of Object.entries(b)) {
    const prev = out[id]
    if (!prev) {
      out[id] = card
      continue
    }
    // Conserva la carta más avanzada (más repeticiones / intervalo)
    if (card.repetitions > prev.repetitions || card.interval > prev.interval) {
      out[id] = card
    }
  }
  return out
}

/** Une progreso local y remoto sin perder lecciones ni XP */
export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  const completed = Array.from(new Set([...local.completedLessons, ...remote.completedLessons]))
  const lessonScores = { ...remote.lessonScores, ...local.lessonScores }
  for (const id of Object.keys(remote.lessonScores)) {
    lessonScores[id] = Math.max(local.lessonScores[id] ?? 0, remote.lessonScores[id] ?? 0)
  }
  const localDay = local.lastStudyDay ?? ''
  const remoteDay = remote.lastStudyDay ?? ''
  const newerLocal = localDay >= remoteDay
  return {
    completedLessons: completed,
    lessonScores,
    srs: mergeSrs(local.srs, remote.srs),
    streak: Math.max(local.streak, remote.streak),
    lastStudyDay: newerLocal ? local.lastStudyDay : remote.lastStudyDay,
    xp: Math.max(local.xp, remote.xp),
    learnerGender: local.learnerGender !== 'unset' ? local.learnerGender : remote.learnerGender,
    displayName: local.displayName.trim() || remote.displayName,
  }
}

/** Prefiere el aula con más actividad (tareas/perfiles); si empatan, el más reciente */
export function mergeClassroom(local: ClassroomState, remote: ClassroomState): ClassroomState {
  const localScore =
    local.profiles.length + (local.classroom?.tasks.length ?? 0) + (local.classroom?.completions.length ?? 0)
  const remoteScore =
    remote.profiles.length + (remote.classroom?.tasks.length ?? 0) + (remote.classroom?.completions.length ?? 0)

  if (remoteScore > localScore) {
    return {
      ...remote,
      activeProfileId: local.activeProfileId ?? remote.activeProfileId,
      profiles: mergeProfiles(local.profiles, remote.profiles),
      classroom: mergeClassroomData(local.classroom, remote.classroom),
    }
  }
  if (localScore > remoteScore) {
    return {
      ...local,
      profiles: mergeProfiles(local.profiles, remote.profiles),
      classroom: mergeClassroomData(local.classroom, remote.classroom),
    }
  }
  return {
    activeProfileId: local.activeProfileId ?? remote.activeProfileId,
    profiles: mergeProfiles(local.profiles, remote.profiles),
    classroom: mergeClassroomData(local.classroom, remote.classroom),
  }
}

function mergeProfiles(
  a: ClassroomState['profiles'],
  b: ClassroomState['profiles'],
): ClassroomState['profiles'] {
  const map = new Map<string, ClassroomState['profiles'][number]>()
  for (const p of [...b, ...a]) map.set(p.id, p)
  // También une por nombre+rol si ids distintos (mismo dispositivo vs import)
  return Array.from(map.values())
}

function mergeClassroomData(
  a: ClassroomState['classroom'],
  b: ClassroomState['classroom'],
): ClassroomState['classroom'] {
  if (!a) return b
  if (!b) return a
  if (a.code !== b.code) {
    // Misma cuenta con clases distintas: conserva la que tenga más tareas
    return (a.tasks.length + a.completions.length) >= (b.tasks.length + b.completions.length) ? a : b
  }
  const studentIds = Array.from(new Set([...a.studentIds, ...b.studentIds]))
  const taskMap = new Map(a.tasks.map((t) => [t.id, t]))
  for (const t of b.tasks) {
    if (!taskMap.has(t.id)) taskMap.set(t.id, t)
  }
  const completionKey = (c: { taskId: string; studentId: string }) => `${c.taskId}:${c.studentId}`
  const compMap = new Map(a.completions.map((c) => [completionKey(c), c]))
  for (const c of b.completions) {
    const key = completionKey(c)
    const prev = compMap.get(key)
    if (!prev) {
      compMap.set(key, c)
      continue
    }
    // Prefiere la entrega con revisión más reciente o más completa
    const prevScore =
      (prev.reviewedAt ? 2 : 0) + (prev.reviewStatus === 'approved' ? 2 : prev.reviewComment ? 1 : 0)
    const nextScore =
      (c.reviewedAt ? 2 : 0) + (c.reviewStatus === 'approved' ? 2 : c.reviewComment ? 1 : 0)
    if (nextScore > prevScore || (c.completedAt || '') > (prev.completedAt || '')) {
      compMap.set(key, { ...prev, ...c })
    }
  }
  return {
    ...a,
    name: a.name || b.name,
    studentIds,
    tasks: Array.from(taskMap.values()),
    completions: Array.from(compMap.values()),
  }
}

export function normalizeBundle(raw: unknown): SyncBundle | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Partial<SyncBundle>
  return {
    progress: { ...defaultProgress(), ...(o.progress ?? {}) },
    classroom: { ...defaultClassroomState(), ...(o.classroom ?? {}) },
    clientUpdatedAt: typeof o.clientUpdatedAt === 'string' ? o.clientUpdatedAt : new Date().toISOString(),
  }
}
