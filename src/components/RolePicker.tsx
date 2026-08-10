import { ACCOUNT_ROLE_OPTIONS, type Role } from '../lib/accountRole'

type Props = {
  value: Role
  onChange: (role: Role) => void
  legend?: string
}

export function RolePicker({ value, onChange, legend = 'Tipo de cuenta' }: Props) {
  const teachers = ACCOUNT_ROLE_OPTIONS.filter((o) => o.kind === 'more')
  const students = ACCOUNT_ROLE_OPTIONS.filter((o) => o.kind === 'talmid')

  return (
    <fieldset className="role-picker">
      <legend>{legend}</legend>
      <p className="role-picker-lead">
        <strong>Moré / Morá</strong> crea la clase y asigna tareas. <strong>Talmid / Talmidá</strong> es el
        alumno del curso.
      </p>
      <div className="role-groups">
        <div>
          <h4>Equipo docente</h4>
          <div className="role-cards">
            {teachers.map((o) => (
              <button
                key={o.role}
                type="button"
                className={`role-card${value === o.role ? ' active' : ''}`}
                onClick={() => onChange(o.role)}
              >
                <strong>{o.title}</strong>
                <span>{o.blurb}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4>Alumnado</h4>
          <div className="role-cards">
            {students.map((o) => (
              <button
                key={o.role}
                type="button"
                className={`role-card${value === o.role ? ' active' : ''}`}
                onClick={() => onChange(o.role)}
              >
                <strong>{o.title}</strong>
                <span>{o.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  )
}
