import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  addWeeklyTask,
  deleteTask,
  isStudent,
  isTaskDone,
  isTeacher,
  roleLabel,
  tasksForStudent,
  tasksForWeek,
  taskTemplates,
  toggleTaskComplete,
  weekKeyFromDate,
  weekLabel,
  type TaskKind,
} from '../lib/classroom'
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

    return (
      <section className="section">
        <h2>Tareas semanales · Morá</h2>
        <p className="lead">
          {weekLabel(weekKey)} · Clase <strong>{classroom.name}</strong> · código {classroom.code}
        </p>

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
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: 12,
                border: '1px solid var(--line)',
                background: 'var(--surface-solid)',
                font: 'inherit',
              }}
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
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: 12,
                border: '1px solid var(--line)',
                background: 'var(--surface-solid)',
                font: 'inherit',
              }}
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
          <h3>Tareas de {weekLabel(weekKey)}</h3>
          {weekTasks.length === 0 ? (
            <p className="empty-state">Aún no hay tareas esta semana.</p>
          ) : (
            <div className="task-list">
              {weekTasks.map((task) => {
                const doneCount = students.filter((s) => isTaskDone(classroom, task.id, s.id)).length
                const total = task.assigneeIds.length
                  ? task.assigneeIds.length
                  : Math.max(students.length, 1)
                return (
                  <article className="task-card" key={task.id}>
                    <div className="task-card-top">
                      <span className="task-kind">{kindLabel[task.kind]}</span>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                        onClick={() => update((prev) => deleteTask(prev, task.id))}
                      >
                        Borrar
                      </button>
                    </div>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p className="task-meta">
                      Completado: {doneCount}/{task.assigneeIds.length === 0 ? students.length : total}
                      {task.href ? (
                        <>
                          {' '}
                          · <Link to={task.href}>Abrir</Link>
                        </>
                      ) : null}
                    </p>
                    {students.length > 0 ? (
                      <ul className="task-students">
                        {students
                          .filter((s) => task.assigneeIds.length === 0 || task.assigneeIds.includes(s.id))
                          .map((s) => (
                            <li key={s.id}>
                              {s.name}:{' '}
                              {isTaskDone(classroom, task.id, s.id) ? (
                                <span className="badge">Hecho</span>
                              ) : (
                                <span style={{ color: 'var(--ink-soft)' }}>Pendiente</span>
                              )}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                        Todavía no hay talmidim unidos. Comparte el código {classroom.code}.
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (isStudent(activeProfile.role)) {
    const mine = tasksForStudent(classroom, weekKey, activeProfile.id)
    const done = mine.filter((t) => isTaskDone(classroom, t.id, activeProfile.id)).length

    return (
      <section className="section">
        <h2>Mis tareas · {activeProfile.name}</h2>
        <p className="lead">
          {weekLabel(weekKey)} · {done}/{mine.length} completadas · Ulpan con la Mora Maggie
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
              const completed = isTaskDone(classroom, task.id, activeProfile.id)
              return (
                <article className={`task-card${completed ? ' is-done' : ''}`} key={task.id}>
                  <span className="task-kind">{kindLabel[task.kind]}</span>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="cta-row">
                    {task.href ? (
                      <Link className="btn btn-outline" to={task.href}>
                        Empezar
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className={completed ? 'btn btn-outline' : 'btn btn-solid'}
                      onClick={() =>
                        update((prev) => toggleTaskComplete(prev, task.id, activeProfile.id))
                      }
                    >
                      {completed ? 'Desmarcar' : 'Marcar hecha'}
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

  return null
}
