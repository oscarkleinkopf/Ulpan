import { lessons } from '../data/lessons'
import { buildClassWeekDigest, type ClassWeekDigest, type StudentWeekRow } from './classDigest'
import {
  getCompletion,
  isStudent,
  isTaskDone,
  isTeacher,
  tasksForStudent,
  weekKeyFromDate,
  type ClassroomState,
  type Profile,
  type Role,
  type WeeklyTask,
} from './classroom'
import { dueCards, type ProgressState } from './progress'
import { homeCalendarForDate, type PackItem } from './weeklyPack'
import type { CalendarDay } from '../data/calendar'

export type TodayPrimary = {
  label: string
  href: string
  hint: string
}

export type TodayLearner = {
  greetName: string
  nextLesson: (typeof lessons)[number] | null
  nextLessonHref: string
  allLessonsDone: boolean
  dueCount: number
  streak: number
  xp: number
  completedLessons: number
  totalLessons: number
  weeklyTasks: WeeklyTask[]
  weeklyDone: number
  openTask: WeeklyTask | null
  needsWorkTask: WeeklyTask | null
  primary: TodayPrimary
  review: TodayPrimary
  taskCta: TodayPrimary
}

export type TodayTeacher = {
  digest: ClassWeekDigest | null
  pendingReview: number
  needsWork: number
  missingAll: StudentWeekRow[]
  studentCount: number
  taskCount: number
}

export type TodayView = {
  isTeacher: boolean
  learner: TodayLearner
  teacher: TodayTeacher | null
  calendar: { day: CalendarDay; wordOfDay: PackItem }
}

function greetName(progress: ProgressState, fallback?: string) {
  return progress.displayName.trim() || fallback?.trim() || ''
}

export function buildTodayLearner(
  progress: ProgressState,
  classroomState: ClassroomState,
  opts?: { accountName?: string },
): TodayLearner {
  const nextLesson = lessons.find((l) => !progress.completedLessons.includes(l.id)) ?? null
  const allLessonsDone = nextLesson === null
  const dueCount = dueCards(progress, 50).length
  const profile =
    classroomState.profiles.find((p) => p.id === classroomState.activeProfileId) ??
    classroomState.profiles.find((p) => isStudent(p.role)) ??
    null
  const studentId = profile && isStudent(profile.role) ? profile.id : null
  const classroom = classroomState.classroom
  const weekKey = weekKeyFromDate()
  const weeklyTasks =
    classroom && studentId ? tasksForStudent(classroom, weekKey, studentId) : []
  const weeklyDone =
    classroom && studentId
      ? weeklyTasks.filter((t) => isTaskDone(classroom, t.id, studentId)).length
      : 0

  let needsWorkTask: WeeklyTask | null = null
  let openTask: WeeklyTask | null = null
  if (classroom && studentId) {
    for (const t of weeklyTasks) {
      const c = getCompletion(classroom, t.id, studentId)
      if (c?.reviewStatus === 'needs_work') {
        needsWorkTask = t
        break
      }
    }
    openTask = weeklyTasks.find((t) => !isTaskDone(classroom, t.id, studentId)) ?? null
  }

  const nextLessonHref = nextLesson ? `/lecciones/${nextLesson.id}` : '/lecciones'
  const primary: TodayPrimary = allLessonsDone
    ? {
        label: dueCount > 0 ? 'Repasar lo aprendido' : 'Ver lecciones',
        href: dueCount > 0 ? '/practica' : '/lecciones',
        hint: dueCount > 0 ? `${dueCount} tarjetas para hoy` : 'Curso A1 completo',
      }
    : {
        label: progress.completedLessons.length === 0 ? 'Empezar la primera lección' : 'Continuar lección',
        href: nextLessonHref,
        hint: nextLesson?.title ?? 'Siguiente lección',
      }

  const review: TodayPrimary = {
    label: dueCount > 0 ? `Repasar ${dueCount} tarjeta${dueCount === 1 ? '' : 's'}` : 'Practicar',
    href: '/practica',
    hint: dueCount > 0 ? 'Vencen hoy' : 'Cuando hayas visto palabras, aparecen aquí',
  }

  const taskCta: TodayPrimary = needsWorkTask
    ? {
        label: 'Corregir tarea',
        href: needsWorkTask.href || '/tareas',
        hint: needsWorkTask.title,
      }
    : openTask
      ? {
          label: 'Tarea de esta semana',
          href: openTask.href || '/tareas',
          hint: `${weeklyDone}/${weeklyTasks.length} · ${openTask.title}`,
        }
      : weeklyTasks.length > 0
        ? {
            label: 'Tareas hechas',
            href: '/tareas',
            hint: `${weeklyDone}/${weeklyTasks.length} esta semana`,
          }
        : {
            label: 'Ver tareas',
            href: '/tareas',
            hint: classroom ? 'La mora aún no asignó esta semana' : 'Unite a una clase para recibir tareas',
          }

  return {
    greetName: greetName(progress, opts?.accountName),
    nextLesson,
    nextLessonHref,
    allLessonsDone,
    dueCount,
    streak: progress.streak,
    xp: progress.xp,
    completedLessons: progress.completedLessons.length,
    totalLessons: lessons.length,
    weeklyTasks,
    weeklyDone,
    openTask,
    needsWorkTask,
    primary,
    review,
    taskCta,
  }
}

export function buildTodayTeacher(state: ClassroomState): TodayTeacher {
  const digest = buildClassWeekDigest(state)
  const classroom = state.classroom
  let pendingReview = 0
  let needsWork = 0
  if (classroom) {
    for (const c of classroom.completions) {
      if (c.reviewStatus === 'pending' || !c.reviewStatus) pendingReview += 1
      if (c.reviewStatus === 'needs_work') needsWork += 1
    }
  }
  const missingAll = digest?.students.filter((r) => r.assigned > 0 && r.done === 0) ?? []
  return {
    digest,
    pendingReview,
    needsWork,
    missingAll,
    studentCount: digest?.students.length ?? 0,
    taskCount: digest?.taskCount ?? 0,
  }
}

export function teacherFromRole(
  accountRole?: Role | null,
  activeProfile?: Profile | null,
): boolean {
  if (accountRole && isTeacher(accountRole)) return true
  if (activeProfile && isTeacher(activeProfile.role)) return true
  return false
}

export function buildTodayView(
  progress: ProgressState,
  classroomState: ClassroomState,
  opts?: { accountRole?: Role | null; accountName?: string },
): TodayView {
  const active = classroomState.profiles.find((p) => p.id === classroomState.activeProfileId) ?? null
  const teacher = teacherFromRole(opts?.accountRole, active)
  return {
    isTeacher: teacher,
    learner: buildTodayLearner(progress, classroomState, { accountName: opts?.accountName }),
    teacher: teacher ? buildTodayTeacher(classroomState) : null,
    calendar: (() => {
      const { day, wordOfDay } = homeCalendarForDate()
      return { day, wordOfDay }
    })(),
  }
}
