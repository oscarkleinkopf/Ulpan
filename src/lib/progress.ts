/** SM-2 lite para repetición espaciada */

export type SrsCard = {
  id: string
  kind: 'vocab' | 'letter' | 'phrase'
  ease: number
  interval: number
  repetitions: number
  due: number
}

export type ProgressState = {
  completedLessons: string[]
  lessonScores: Record<string, number>
  srs: Record<string, SrsCard>
  streak: number
  lastStudyDay: string | null
  xp: number
}

const STORAGE_KEY = 'ulpan-progress-v1'

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function defaultProgress(): ProgressState {
  return {
    completedLessons: [],
    lessonScores: {},
    srs: {},
    streak: 0,
    lastStudyDay: null,
    xp: 0,
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function markLessonComplete(
  state: ProgressState,
  lessonId: string,
  scorePercent: number,
): ProgressState {
  const completed = state.completedLessons.includes(lessonId)
    ? state.completedLessons
    : [...state.completedLessons, lessonId]
  const day = todayKey()
  let streak = state.streak
  if (state.lastStudyDay !== day) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yKey = yesterday.toISOString().slice(0, 10)
    streak = state.lastStudyDay === yKey ? state.streak + 1 : 1
  }
  return {
    ...state,
    completedLessons: completed,
    lessonScores: { ...state.lessonScores, [lessonId]: Math.max(scorePercent, state.lessonScores[lessonId] ?? 0) },
    streak,
    lastStudyDay: day,
    xp: state.xp + (completed ? 10 : 40) + Math.round(scorePercent / 10),
  }
}

function ensureCard(state: ProgressState, id: string, kind: SrsCard['kind']): SrsCard {
  return (
    state.srs[id] ?? {
      id,
      kind,
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      due: Date.now(),
    }
  )
}

/** quality: 0 falló, 1 difícil, 2 bien, 3 fácil */
export function reviewCard(
  state: ProgressState,
  id: string,
  kind: SrsCard['kind'],
  quality: 0 | 1 | 2 | 3,
): ProgressState {
  const card = { ...ensureCard(state, id, kind) }
  const now = Date.now()

  if (quality === 0) {
    card.repetitions = 0
    card.interval = 0
    card.due = now + 10 * 60 * 1000
    card.ease = Math.max(1.3, card.ease - 0.2)
  } else {
    card.ease = Math.max(1.3, card.ease + (quality - 2) * 0.1)
    if (card.repetitions === 0) card.interval = quality === 1 ? 0.05 : 1
    else if (card.repetitions === 1) card.interval = quality === 3 ? 4 : 3
    else card.interval = Math.round(card.interval * card.ease * 10) / 10
    card.repetitions += 1
    card.due = now + card.interval * 24 * 60 * 60 * 1000
  }

  const day = todayKey()
  let streak = state.streak
  if (state.lastStudyDay !== day) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yKey = yesterday.toISOString().slice(0, 10)
    streak = state.lastStudyDay === yKey ? state.streak + 1 : 1
  }

  return {
    ...state,
    srs: { ...state.srs, [id]: card },
    streak,
    lastStudyDay: day,
    xp: state.xp + (quality === 0 ? 2 : 5 + quality),
  }
}

export function dueCards(state: ProgressState, limit = 20): SrsCard[] {
  const now = Date.now()
  return Object.values(state.srs)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due)
    .slice(0, limit)
}

export function enqueueForSrs(
  state: ProgressState,
  items: { id: string; kind: SrsCard['kind'] }[],
): ProgressState {
  const srs = { ...state.srs }
  for (const item of items) {
    if (!srs[item.id]) {
      srs[item.id] = {
        id: item.id,
        kind: item.kind,
        ease: 2.5,
        interval: 0,
        repetitions: 0,
        due: Date.now(),
      }
    }
  }
  return { ...state, srs }
}
