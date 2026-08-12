import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  addWeeklyTask,
  deleteTask,
  getCompletion,
  isStudent,
  isTaskDone,
  isTeacher,
  reviewLabel,
  roleLabel,
  setTaskReview,
  tasksForStudent,
  tasksForWeek,
  taskTemplates,
  toggleTaskComplete,
  weekKeyFromDate,
  weekLabel,
  type Classroom,
  type Profile,
  type TaskKind,
  type WeeklyTask,
} from '../lib/classroom'
import { PageVisual } from '../components/PageVisual'
import { useClassroom } from '../lib/useClassroom'

const kindLabel: Record<TaskKind, string> = {
  lesson: 'Lección',
  practice: 'Práctica',
  vocab: 'Vocabulario',
  alphabet: 'Alefato',
  custom: 'Otra',
}

export function TasksPage() {
  const { state, update, activeProfile } = useClassroom()
  const weekKey = weekKeyFromDate()
  const classroom = state.classroom

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [kind, setKind] = useState<TaskKind>('lesson')
  const [href, setHref] = useState('/lecciones')
  const [assigneeId, setAssigneeId] = useState('')

  const students = useMemo(() => {
    if (!classroom) return []
    return state.profiles.filter((p) => classroom.studentIds.includes(p.id))
  }, [classroom, state.profiles])

  if (!activeProfile) {
    return (
      <section className="section panel">
        <PageVisual sceneId="tareas" />
        <h2>Tareas semanales</h2>
        <p className="lead">Primero elige o crea tu perfil (morá o talmid).</p>
        <Link className="btn btn-solid" to="/perfiles">
          Ir a perfiles
        </Link>
      </section>
    )
  }

  if (!classroom) {
    return (
      <section className="section panel">
        <PageVisual sceneId="tareas" />
        <h2>Tareas semanales</h2>
        <p className="lead">
          {isTeacher(activeProfile.role)
            ? 'Crea tu clase en Perfiles para asignar tareas.'
            : 'Únete a la clase de la Mora Maggie con el código, o importa el JSON de la clase.'}
        </p>
        <Link className="btn btn-solid" to="/perfiles">
          Ir a perfiles
        </Link>
      </section>
    )
  }

  const weekTasks = tasksForWeek(classroom, weekKey)

  if (isTeacher(activeProfile.role)) {
    function applyTemplate(i: number) {
      const t = taskTemplates[i]
      setTitle(t.title)
      setDescription(t.description)
      setKind(t.kind)
      setHref(t.href ?? '')
    }

    function onCreate(e: FormEvent) {
      e.preventDefault()
      if (!title.trim()) return
      update((prev) =>
        addWeeklyTask(prev, {
          title: title.trim(),
          description: description.trim(),
          kind,
          href: href.trim() || undefined,
          assigneeIds: assigneeId ? [assigneeId] : [],
          weekKey,
          createdBy: activeProfile!.id,
        }),
      )
      setTitle('')
      setDescription('')
    }

    const awaitingReview = weekTasks.reduce((n, task) => {
      const assignees =
        task.assigneeIds.length > 0
          ? students.filter((s) => task.assigneeIds.includes(s.id))
          : students
      return (
        n +
        assignees.filter((s) => {
          const c = getCompletion(classroom, task.id, s.id)
          return c && c.reviewStatus !== 'approved'
        }).length
      )
    }, 0)

    return (
      <section className="section">
        <PageVisual sceneId="tareas" />
        <h2>Tareas semanales · Corrección</h2>
        <p className="lead">
          {weekLabel(weekKey)} · Clase <strong>{classroom.name}</strong> · código {classroom.code}
          {awaitingReview > 0 ? (
            <>
              {' '}
              · <strong>{awaitingReview}</strong> para revisar
            </>
          ) : null}
        </p>
        <div className="cta-row" style={{ marginBottom: '1rem' }}>
          <Link className="btn btn-outline" to="/resumen-clase">
            Resumen de clase
          </Link>
          <Link className="btn btn-outline" to="/entrega-semanal">
            Pack semanal
          </Link>
        </div>

        <div className="panel" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
            Plantillas rápidas
          </h3>
          <div className="filter-chips">
            {taskTemplates.map((t, i) => (
              <button key={t.title} type="button" onClick={() => applyTemplate(i)}>
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <form className="panel" onSubmit={onCreate} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
            Nueva tarea
          </h3>
          <label className="field">
            <span>Título</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>Descripción</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="field">
            <span>Tipo</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as TaskKind)}
              className="field-select"
            >
              {Object.entries(kindLabel).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Enlace en la app (opcional)</span>
            <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/lecciones" />
          </label>
          <label className="field">
            <span>Asignar a</span>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="field-select"
            >
              <option value="">Toda la clase</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({roleLabel(s.role)})
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-solid">
            Publicar tarea de la semana
          </button>
        </form>

        <div className="unit-block">
          <h3>Entregas de {weekLabel(weekKey)}</h3>
          {weekTasks.length === 0 ? (
            <p className="empty-state">Aún no hay tareas esta semana.</p>
          ) : (
            <div className="task-list">
              {weekTasks.map((task) => (
                <TeacherTaskCard
                  key={task.id}
                  task={task}
                  classroom={classroom}
                  students={students}
                  onDelete={() => update((prev) => deleteTask(prev, task.id))}
                  onReview={(studentId, status, comment) =>
                    update((prev) =>
                      setTaskReview(prev, task.id, studentId, {
                        status,
                        comment,
                        reviewedBy: activeProfile.id,
                      }),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (isStudent(activeProfile.role)) {
    return (
      <StudentTasksView
        classroom={classroom}
        weekKey={weekKey}
        profile={activeProfile}
        onToggle={(taskId, note) =>
          update((prev) => toggleTaskComplete(prev, taskId, activeProfile.id, note))
        }
      />
    )
  }

  return null
}

function TeacherTaskCard({
  task,
  classroom,
  students,
  onDelete,
  onReview,
}: {
  task: WeeklyTask
  classroom: Classroom
  students: Profile[]
  onDelete: () => void
  onReview: (studentId: string, status: 'approved' | 'needs_work' | 'pending', comment?: string) => void
}) {
  const assignees =
    task.assigneeIds.length > 0
      ? students.filter((s) => task.assigneeIds.includes(s.id))
      : students
  const doneCount = assignees.filter((s) => isTaskDone(classroom, task.id, s.id)).length
  const approvedCount = assignees.filter((s) => {
    const c = getCompletion(classroom, task.id, s.id)
    return c?.reviewStatus === 'approved'
  }).length

  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className="task-kind">{kindLabel[task.kind]}</span>
        <button
          type="button"
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
          onClick={onDelete}
        >
          Borrar
        </button>
      </div>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p className="task-meta">
        Entregado: {doneCount}/{assignees.length || students.length} · Visto bueno: {approvedCount}
        {task.href ? (
          <>
            {' '}
            · <Link to={task.href}>Abrir</Link>
          </>
        ) : null}
      </p>
      {assignees.length > 0 ? (
        <ul className="task-students">
          {assignees.map((s) => (
            <TeacherStudentReview
              key={s.id}
              student={s}
              classroom={classroom}
              taskId={task.id}
              onReview={onReview}
            />
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
          Todavía no hay talmidim unidos. Comparte el código {classroom.code}.
        </p>
      )}
    </article>
  )
}

function TeacherStudentReview({
  student,
  classroom,
  taskId,
  onReview,
}: {
  student: Profile
  classroom: Classroom
  taskId: string
  onReview: (studentId: string, status: 'approved' | 'needs_work' | 'pending', comment?: string) => void
}) {
  const completion = getCompletion(classroom, taskId, student.id)
  const [comment, setComment] = useState(completion?.reviewComment ?? '')

  if (!completion) {
    return (
      <li className="review-row">
        <div>
          <strong>{student.name}</strong>
          <span className="review-status is-waiting">Pendiente</span>
        </div>
      </li>
    )
  }

  const status = completion.reviewStatus ?? 'pending'

  return (
    <li className="review-row">
      <div className="review-row-head">
        <strong>{student.name}</strong>
        <span className={`review-status is-${status}`}>{reviewLabel(status)}</span>
      </div>
      {completion.studentNote ? (
        <p className="review-note">Nota del alumno: {completion.studentNote}</p>
      ) : null}
      <label className="field" style={{ marginBottom: '0.55rem' }}>
        <span>Comentario de la mora</span>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bien hecho / practica más las vocales…"
        />
      </label>
      <div className="cta-row">
        <button
          type="button"
          className="btn btn-solid"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          onClick={() => onReview(student.id, 'approved', comment)}
        >
          Visto bueno
        </button>
        <button
          type="button"
          className="btn btn-outline"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          onClick={() => onReview(student.id, 'needs_work', comment)}
        >
          Para corregir
        </button>
      </div>
    </li>
  )
}

function StudentTasksView({
  classroom,
  weekKey,
  profile,
  onToggle,
}: {
  classroom: Classroom
  weekKey: string
  profile: Profile
  onToggle: (taskId: string, note?: string) => void
}) {
  const mine = tasksForStudent(classroom, weekKey, profile.id)
  const done = mine.filter((t) => isTaskDone(classroom, t.id, profile.id)).length
  const approved = mine.filter((t) => {
    const c = getCompletion(classroom, t.id, profile.id)
    return c?.reviewStatus === 'approved'
  }).length
  const [notes, setNotes] = useState<Record<string, string>>({})

  return (
    <section className="section">
      <PageVisual sceneId="tareas" />
      <h2>Mis tareas · {profile.name}</h2>
      <p className="lead">
        {weekLabel(weekKey)} · {done}/{mine.length} entregadas · {approved} con visto bueno
      </p>
      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${mine.length ? (done / mine.length) * 100 : 0}%` }}
        />
      </div>

      {mine.length === 0 ? (
        <div className="panel empty-state">
          <p>No hay tareas publicadas para esta semana. ¡Aprovecha para practicar libremente!</p>
          <Link className="btn btn-solid" to="/practica">
            Ir a práctica
          </Link>
        </div>
      ) : (
        <div className="task-list">
          {mine.map((task) => {
            const completion = getCompletion(classroom, task.id, profile.id)
            const completed = Boolean(completion)
            const status = completion?.reviewStatus
            return (
              <article
                className={`task-card${completed ? ' is-done' : ''}${status === 'approved' ? ' is-approved' : ''}${status === 'needs_work' ? ' is-needs-work' : ''}`}
                key={task.id}
              >
                <div className="task-card-top">
                  <span className="task-kind">{kindLabel[task.kind]}</span>
                  {completion ? (
                    <span className={`review-status is-${status ?? 'pending'}`}>
                      {reviewLabel(status)}
                    </span>
                  ) : null}
                </div>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                {completion?.reviewComment ? (
                  <p className="review-feedback">
                    <strong>Morá:</strong> {completion.reviewComment}
                  </p>
                ) : null}
                {!completed ? (
                  <label className="field" style={{ marginTop: '0.75rem' }}>
                    <span>Nota para la mora (opcional)</span>
                    <input
                      value={notes[task.id] ?? ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      placeholder="Ej. terminé la lección u1-l2"
                    />
                  </label>
                ) : completion?.studentNote ? (
                  <p className="review-note">Tu nota: {completion.studentNote}</p>
                ) : null}
                <div className="cta-row">
                  {task.href ? (
                    <Link className="btn btn-outline" to={task.href}>
                      Empezar
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={completed ? 'btn btn-outline' : 'btn btn-solid'}
                    onClick={() => onToggle(task.id, notes[task.id])}
                  >
                    {completed ? 'Desmarcar' : 'Entregar'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
