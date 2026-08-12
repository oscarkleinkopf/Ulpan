import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  createClassroom,
  createProfile,
  exportClassroomJson,
  importClassroomJson,
  isStudent,
  isTeacher,
  joinClassroomAsStudent,
  roleLabel,
  setActiveProfile,
  type Role,
} from '../lib/classroom'
import { PageVisual } from '../components/PageVisual'
import { useClassroom } from '../lib/useClassroom'

const roles: { role: Role; blurb: string }[] = [
  { role: 'mora', blurb: 'Profesora — asigna tareas y sigue a la clase' },
  { role: 'more', blurb: 'Profesor — asigna tareas y sigue a la clase' },
  { role: 'talmida', blurb: 'Alumna — recibe tareas semanales' },
  { role: 'talmid', blurb: 'Alumno — recibe tareas semanales' },
]

export function ProfilesPage() {
  const { state, update, activeProfile } = useClassroom()
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('talmid')
  const [className, setClassName] = useState('Ulpan con la Mora Maggie')
  const [joinCode, setJoinCode] = useState('')
  const [importText, setImportText] = useState('')
  const [msg, setMsg] = useState('')

  function onCreateProfile(e: FormEvent) {
    e.preventDefault()
    update((prev) => createProfile(prev, name || (role === 'mora' ? 'Maggie' : ''), role))
    setName('')
    setMsg('Perfil creado.')
  }

  function onCreateClass(e: FormEvent) {
    e.preventDefault()
    if (!activeProfile || !isTeacher(activeProfile.role)) return
    update((prev) => createClassroom(prev, className, activeProfile.id))
    setMsg('Clase creada. Comparte el código con tus talmidim.')
  }

  function onJoin(e: FormEvent) {
    e.preventDefault()
    if (!activeProfile || !isStudent(activeProfile.role)) return
    if (!state.classroom) {
      setMsg('Aún no hay clase en este dispositivo. Pide a la mora el archivo exportado o crea la clase aquí primero.')
      return
    }
    const before = state.classroom.studentIds.length
    const next = joinClassroomAsStudent(state, joinCode, activeProfile.id)
    update(next)
    const joined = (next.classroom?.studentIds.length ?? 0) > before
    setMsg(joined ? '¡Te uniste a la clase!' : 'Código incorrecto o ya estás en la clase.')
  }

  function onExport() {
    const blob = new Blob([exportClassroomJson(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ulpan-maggie-${state.classroom?.code ?? 'clase'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function onImport(e: FormEvent) {
    e.preventDefault()
    const parsed = importClassroomJson(importText)
    if (!parsed) {
      setMsg('No se pudo importar el JSON.')
      return
    }
    update(parsed)
    setImportText('')
    setMsg('Clase importada. Elige o crea tu perfil de talmid/a.')
  }

  return (
    <section className="section">
      <PageVisual sceneId="perfiles" />
      <h2>Perfiles · מורים ותלמידים</h2>
      <p className="lead">
        Ulpan con la Mora Maggie distingue <strong>morim</strong> (profes) y <strong>talmidim</strong> (alumnos). Los
        datos se guardan en este dispositivo; la mora puede exportar/importar la clase.
      </p>

      {msg ? <p className="banner-msg">{msg}</p> : null}

      <div className="panel" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Perfil activo
        </h3>
        {activeProfile ? (
          <p style={{ margin: 0 }}>
            <strong>{activeProfile.name}</strong> · {roleLabel(activeProfile.role)}
            {state.classroom ? (
              <>
                {' '}
                · Clase <strong>{state.classroom.name}</strong> (código {state.classroom.code})
              </>
            ) : null}
          </p>
        ) : (
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Ninguno. Crea o selecciona un perfil.</p>
        )}
      </div>

      {state.profiles.length > 0 ? (
        <div className="unit-block">
          <h3>Tus perfiles</h3>
          <div className="lesson-list">
            {state.profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`lesson-row${p.id === state.activeProfileId ? ' done' : ''}`}
                onClick={() => update((prev) => setActiveProfile(prev, p.id))}
              >
                <div>
                  <h4>{p.name}</h4>
                  <p>{roleLabel(p.role)}</p>
                </div>
                {p.id === state.activeProfileId ? <span className="badge">Activo</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form className="panel" onSubmit={onCreateProfile} style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Crear perfil
        </h3>
        <label className="field">
          <span>Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'mora' ? 'Maggie' : 'Tu nombre'}
          />
        </label>
        <div className="filter-chips">
          {roles.map((r) => (
            <button
              key={r.role}
              type="button"
              className={role === r.role ? 'active' : undefined}
              onClick={() => setRole(r.role)}
            >
              {roleLabel(r.role)}
            </button>
          ))}
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
          {roles.find((r) => r.role === role)?.blurb}
        </p>
        <button type="submit" className="btn btn-solid">
          Guardar perfil
        </button>
      </form>

      {activeProfile && isTeacher(activeProfile.role) ? (
        <form className="panel" onSubmit={onCreateClass} style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
            Clase de la mora
          </h3>
          <label className="field">
            <span>Nombre de la clase</span>
            <input value={className} onChange={(e) => setClassName(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-solid">
            {state.classroom ? 'Crear / reemplazar clase' : 'Crear clase'}
          </button>
          {state.classroom ? (
            <p style={{ marginTop: '1rem', color: 'var(--ink-soft)' }}>
              Código para talmidim: <strong className="he" style={{ fontSize: '1.2rem' }}>{state.classroom.code}</strong>
              <br />
              Alumnos inscritos: {state.classroom.studentIds.length}
            </p>
          ) : null}
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={onExport}>
              Exportar clase (JSON)
            </button>
            <Link className="btn btn-outline" to="/tareas">
              Ir a tareas semanales
            </Link>
          </div>
        </form>
      ) : null}

      {activeProfile && isStudent(activeProfile.role) ? (
        <form className="panel" onSubmit={onJoin} style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
            Unirse a la clase
          </h3>
          <label className="field">
            <span>Código de clase</span>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ej. A1B2C3"
            />
          </label>
          <button type="submit" className="btn btn-solid">
            Unirme
          </button>
          <p style={{ marginTop: '0.75rem' }}>
            <Link className="btn btn-outline" to="/tareas">
              Ver mis tareas de la semana
            </Link>
          </p>
        </form>
      ) : null}

      <form className="panel" onSubmit={onImport}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Importar clase
        </h3>
        <p style={{ color: 'var(--ink-soft)' }}>
          Pega aquí el JSON exportado por la Mora Maggie (útil en otra computadora o celular).
        </p>
        <label className="field">
          <span>JSON</span>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={5}
            placeholder='{ "profiles": [], "classroom": ... }'
            style={{
              width: '100%',
              borderRadius: 12,
              border: '1px solid var(--line)',
              padding: '0.7rem',
              font: 'inherit',
              background: 'var(--surface-solid)',
            }}
          />
        </label>
        <button type="submit" className="btn btn-outline">
          Importar
        </button>
      </form>
    </section>
  )
}
