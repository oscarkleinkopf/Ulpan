import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { buildClassWeekDigest, digestWhatsAppText } from '../lib/classDigest'
import { isTeacher, weekKeyFromDate } from '../lib/classroom'
import { useClassroom } from '../lib/useClassroom'

export function ClassDigestPage() {
  const { state, activeProfile } = useClassroom()
  const [copied, setCopied] = useState(false)
  const weekKey = weekKeyFromDate()
  const digest = useMemo(() => buildClassWeekDigest(state, weekKey), [state, weekKey])

  if (!activeProfile || !isTeacher(activeProfile.role)) {
    return (
      <section className="section panel">
        <h2>Resumen de clase</h2>
        <p className="lead">Solo la Morá / Moré ve el avance semanal de la clase.</p>
        <Link className="btn btn-solid" to="/perfiles">
          Ir a perfiles
        </Link>
      </section>
    )
  }

  if (!digest) {
    return (
      <section className="section panel">
        <h2>Resumen de clase</h2>
        <p className="lead">Creá o uní una clase para ver la racha semanal de tus talmidim.</p>
        <Link className="btn btn-solid" to="/perfiles">
          Gestionar clase
        </Link>
      </section>
    )
  }

  async function copy() {
    const text = digestWhatsAppText(digest!)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copiá el resumen:', text)
    }
  }

  return (
    <section className="section">
      <PageVisual sceneId="tareas" />
      <h2>Resumen de clase</h2>
      <p className="lead">
        {digest.weekLabel} · <strong>{digest.className}</strong> · código {digest.code}
      </p>

      <div className="stats-inline">
        <div>
          <strong>{digest.taskCount}</strong>
          Tareas
        </div>
        <div>
          <strong>{digest.doneRate}%</strong>
          Avance
        </div>
        <div>
          <strong>{digest.approvedRate}%</strong>
          Visto bueno
        </div>
        <div>
          <strong>
            {digest.fullCompleters}/{digest.students.filter((s) => s.assigned > 0).length || 0}
          </strong>
          Completos
        </div>
      </div>

      <div className="cta-row" style={{ margin: '1rem 0' }}>
        <button type="button" className="btn btn-solid" onClick={() => void copy()}>
          {copied ? '¡Copiado!' : 'Copiar para WhatsApp'}
        </button>
        <Link className="btn btn-outline" to="/tareas">
          Ir a tareas
        </Link>
        <Link className="btn btn-outline" to="/entrega-semanal">
          Pack semanal
        </Link>
      </div>

      {digest.students.length === 0 ? (
        <p className="lead">Todavía no hay talmidim en la clase.</p>
      ) : (
        <div className="lesson-list">
          {digest.students.map((row) => (
            <div className="lesson-row" key={row.student.id}>
              <div>
                <h4>{row.student.name}</h4>
                <p>
                  {row.assigned === 0
                    ? 'Sin tareas asignadas esta semana'
                    : `${row.done}/${row.assigned} entregadas · ${row.pct}%${row.approved ? ` · ✓ ${row.approved}` : ''}${row.needsWork ? ` · ↺ ${row.needsWork}` : ''}`}
                </p>
              </div>
              <span className="badge">{row.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
