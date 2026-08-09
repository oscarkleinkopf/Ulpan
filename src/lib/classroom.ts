/** Perfiles (morim / talmidim) y tareas semanales — almacenamiento local */

export type Role = 'mora' | 'more' | 'talmid' | 'talmida'

export type Profile = {
  id: string
  name: string
  role: Role
  createdAt: string
}

export type TaskKind = 'lesson' | 'practice' | 'vocab' | 'alphabet' | 'custom'

export type WeeklyTask = {
  id: string
  title: string
  description: string
  kind: TaskKind
  /** Enlace opcional dentro de la app, p.ej. /lecciones/u1-l1 */
  href?: string
  /** Si está vacío, aplica a toda la clase */
  assigneeIds: string[]
  weekKey: string
  createdBy: string
}

export type TaskCompletion = {
  taskId: string
  studentId: string
  completedAt: string
}

export type Classroom = {
  id: string
  name: string
  code: string
  teacherProfileId: string
  studentIds: string[]
  tasks: WeeklyTask[]
  completions: TaskCompletion[]
}

export type ClassroomState = {
  activeProfileId: string | null
  profiles: Profile[]
  classroom: Classroom | null
}

const STORAGE_KEY = 'ulpan-classroom-v1'

export function roleLabel(role: Role): string {
  switch (role) {
    case 'mora':
      return 'Morá'
    case 'more':
      return 'Moré'
    case 'talmida':
      return 'Talmidá'
    case 'talmid':
      return 'Talmid'
  }
}

export function isTeacher(role: Role): boolean {
  return role === 'mora' || role === 'more'
}

export function isStudent(role: Role): boolean {
  return role === 'talmid' || role === 'talmida'
}

/** Semana ISO YYYY-Www */
export function weekKeyFromDate(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function weekLabel(weekKey: string): string {
  const [y, w] = weekKey.split('-W')
  return `Semana ${Number(w)} · ${y}`
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function defaultClassroomState(): ClassroomState {
  return {
    activeProfileId: null,
    profiles: [],
    classroom: null,
  }
}

export function loadClassroomState(): ClassroomState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultClassroomState()
    return { ...defaultClassroomState(), ...JSON.parse(raw) }
  } catch {
    return defaultClassroomState()
  }
}

export function saveClassroomState(state: ClassroomState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createProfile(state: ClassroomState, name: string, role: Role): ClassroomState {
  const profile: Profile = {
    id: uid('p'),
    name: name.trim() || (isTeacher(role) ? 'Morá Maggie' : 'Talmid'),
    role,
    createdAt: new Date().toISOString(),
  }
  return {
    ...state,
    profiles: [...state.profiles, profile],
    activeProfileId: profile.id,
  }
}

export function setActiveProfile(state: ClassroomState, profileId: string): ClassroomState {
  return { ...state, activeProfileId: profileId }
}

export function createClassroom(state: ClassroomState, name: string, teacherId: string): ClassroomState {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase()
  const classroom: Classroom = {
    id: uid('c'),
    name: name.trim() || 'Ulpan con la Mora Maggie',
    code,
    teacherProfileId: teacherId,
    studentIds: [],
    tasks: [],
    completions: [],
  }
  return { ...state, classroom }
}

export function joinClassroomAsStudent(state: ClassroomState, code: string, studentId: string): ClassroomState {
  if (!state.classroom) return state
  if (state.classroom.code.toUpperCase() !== code.trim().toUpperCase()) return state
  if (state.classroom.studentIds.includes(studentId)) return state
  return {
    ...state,
    classroom: {
      ...state.classroom,
      studentIds: [...state.classroom.studentIds, studentId],
    },
  }
}

export function addWeeklyTask(
  state: ClassroomState,
  input: Omit<WeeklyTask, 'id'>,
): ClassroomState {
  if (!state.classroom) return state
  const task: WeeklyTask = { ...input, id: uid('t') }
  return {
    ...state,
    classroom: {
      ...state.classroom,
      tasks: [...state.classroom.tasks, task],
    },
  }
}

export function toggleTaskComplete(
  state: ClassroomState,
  taskId: string,
  studentId: string,
): ClassroomState {
  if (!state.classroom) return state
  const exists = state.classroom.completions.some(
    (c) => c.taskId === taskId && c.studentId === studentId,
  )
  const completions = exists
    ? state.classroom.completions.filter((c) => !(c.taskId === taskId && c.studentId === studentId))
    : [
        ...state.classroom.completions,
        { taskId, studentId, completedAt: new Date().toISOString() },
      ]
  return {
    ...state,
    classroom: { ...state.classroom, completions },
  }
}

export function deleteTask(state: ClassroomState, taskId: string): ClassroomState {
  if (!state.classroom) return state
  return {
    ...state,
    classroom: {
      ...state.classroom,
      tasks: state.classroom.tasks.filter((t) => t.id !== taskId),
      completions: state.classroom.completions.filter((c) => c.taskId !== taskId),
    },
  }
}

export function tasksForWeek(classroom: Classroom, weekKey: string): WeeklyTask[] {
  return classroom.tasks.filter((t) => t.weekKey === weekKey)
}

export function tasksForStudent(
  classroom: Classroom,
  weekKey: string,
  studentId: string,
): WeeklyTask[] {
  return tasksForWeek(classroom, weekKey).filter(
    (t) => t.assigneeIds.length === 0 || t.assigneeIds.includes(studentId),
  )
}

export function isTaskDone(classroom: Classroom, taskId: string, studentId: string): boolean {
  return classroom.completions.some((c) => c.taskId === taskId && c.studentId === studentId)
}

export function exportClassroomJson(state: ClassroomState): string {
  return JSON.stringify(state, null, 2)
}

export function importClassroomJson(raw: string): ClassroomState | null {
  try {
    const data = JSON.parse(raw) as ClassroomState
    if (!data || !Array.isArray(data.profiles)) return null
    return { ...defaultClassroomState(), ...data }
  } catch {
    return null
  }
}

/** Plantillas rápidas para la mora */
export const taskTemplates: { title: string; description: string; kind: TaskKind; href?: string }[] = [
  {
    title: 'Completar 1 lección del curso',
    description: 'Elige la siguiente lección pendiente y termínala con el quiz.',
    kind: 'lesson',
    href: '/lecciones',
  },
  {
    title: 'Practicar 15 tarjetas SRS',
    description: 'Repasa al menos 15 tarjetas en el mazo de repetición espaciada.',
    kind: 'practice',
    href: '/practica',
  },
  {
    title: 'Estudiar 10 palabras nuevas',
    description: 'Revisa el vocabulario de la semana y añádelo a práctica.',
    kind: 'vocab',
    href: '/vocabulario',
  },
  {
    title: 'Repasar el alefato',
    description: 'Practica letras y vocales; haz el quiz de reconocimiento.',
    kind: 'alphabet',
    href: '/alefato',
  },
  {
    title: 'Escuchar y repetir 5 frases',
    description: 'En Frases útiles, escucha el audio y repite en voz alta.',
    kind: 'custom',
    href: '/frases',
  },
]
