import {
  getCompletion,
  isStudent,
  isTaskDone,
  tasksForStudent,
  tasksForWeek,
  weekKeyFromDate,
  weekLabel,
  type ClassroomState,
  type Profile,
} from './classroom'

export type StudentWeekRow = {
  student: Profile
  assigned: number
  done: number
  approved: number
  needsWork: number
  pct: number
}

export type ClassWeekDigest = {
  weekKey: string
  weekLabel: string
  className: string
  code: string
  taskCount: number
  students: StudentWeekRow[]
  doneRate: number
  approvedRate: number
  /** Alumnos que entregaron todo lo asignado esta semana */
  fullCompleters: number
}

export function buildClassWeekDigest(
  state: ClassroomState,
  weekKey = weekKeyFromDate(),
): ClassWeekDigest | null {
  const classroom = state.classroom
  if (!classroom) return null

  const tasks = tasksForWeek(classroom, weekKey)
  const students = state.profiles.filter(
    (p) => isStudent(p.role) && classroom.studentIds.includes(p.id),
  )

  const rows: StudentWeekRow[] = students.map((student) => {
    const mine = tasksForStudent(classroom, weekKey, student.id)
    let done = 0
    let approved = 0
    let needsWork = 0
    for (const t of mine) {
      if (isTaskDone(classroom, t.id, student.id)) done += 1
      const c = getCompletion(classroom, t.id, student.id)
      if (c?.reviewStatus === 'approved') approved += 1
      if (c?.reviewStatus === 'needs_work') needsWork += 1
    }
    const assigned = mine.length
    return {
      student,
      assigned,
      done,
      approved,
      needsWork,
      pct: assigned === 0 ? 0 : Math.round((done / assigned) * 100),
    }
  })

  const withTasks = rows.filter((r) => r.assigned > 0)
  const doneRate =
    withTasks.length === 0
      ? 0
      : Math.round(withTasks.reduce((s, r) => s + r.pct, 0) / withTasks.length)
  const approvedSlots = withTasks.reduce((s, r) => s + r.approved, 0)
  const doneSlots = withTasks.reduce((s, r) => s + r.done, 0)
  const approvedRate = doneSlots === 0 ? 0 : Math.round((approvedSlots / doneSlots) * 100)

  return {
    weekKey,
    weekLabel: weekLabel(weekKey),
    className: classroom.name,
    code: classroom.code,
    taskCount: tasks.length,
    students: rows.sort((a, b) => b.pct - a.pct || a.student.name.localeCompare(b.student.name)),
    doneRate,
    approvedRate,
    fullCompleters: withTasks.filter((r) => r.done === r.assigned).length,
  }
}

export function digestWhatsAppText(digest: ClassWeekDigest): string {
  const lines = [
    `📊 Ulpan Maggie · ${digest.weekLabel}`,
    `Clase: ${digest.className} (${digest.code})`,
    `Tareas: ${digest.taskCount} · Avance medio: ${digest.doneRate}% · Visto bueno: ${digest.approvedRate}%`,
    `Completaron todo: ${digest.fullCompleters}/${digest.students.filter((s) => s.assigned > 0).length}`,
    '',
    ...digest.students.map(
      (r) =>
        `• ${r.student.name}: ${r.done}/${r.assigned} (${r.pct}%)${r.approved ? ` · ✓ ${r.approved}` : ''}${r.needsWork ? ` · ↺ ${r.needsWork}` : ''}`,
    ),
    '',
    'שבוע טוב · Shavúa tov',
  ]
  return lines.join('\n')
}
