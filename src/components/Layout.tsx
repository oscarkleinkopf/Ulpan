import { NavLink, Outlet } from 'react-router-dom'
import { accountRoleLabel, canRecordAudio } from '../lib/accountRole'
import { useAuthContext } from '../lib/AuthProvider'
import { isTeacher } from '../lib/classroom'
import { useClassroom } from '../lib/useClassroom'
import { InstallPrompt } from './InstallPrompt'

export function Layout() {
  const { user, signOut, cloudReady } = useAuthContext()
  const { activeProfile } = useClassroom()
  const teacher = Boolean(
    (user?.role && isTeacher(user.role)) || (activeProfile && isTeacher(activeProfile.role)),
  )
  const showStudio = canRecordAudio(user)

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" title="Ulpan con la Mora Maggie">
          Ulpan <span className="brand-maggie">Maggie</span>
        </NavLink>
        <nav className="nav-links" aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Hoy
          </NavLink>
          <NavLink to="/lecciones" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Lecciones
          </NavLink>
          <NavLink to="/practica" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Práctica
          </NavLink>
          <NavLink to="/tareas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Tareas
          </NavLink>
          {teacher ? (
            <NavLink to="/resumen-clase" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Aula
            </NavLink>
          ) : null}
          {showStudio ? (
            <NavLink to="/estudio-audio" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Estudio
            </NavLink>
          ) : null}
          <NavLink to="/mas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Más
          </NavLink>
          <NavLink to="/cuenta" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Cuenta
          </NavLink>
        </nav>
        {cloudReady ? (
          <div className="auth-chip">
            {user ? (
              <>
                <NavLink
                  to="/cuenta"
                  className="auth-chip-user"
                  title={`${user.email ?? ''} · ${accountRoleLabel(user.role)}`}
                >
                  {accountRoleLabel(user.role) !== 'Sin rol'
                    ? accountRoleLabel(user.role)
                    : user.name || user.email || 'Cuenta'}
                </NavLink>
                <button type="button" className="auth-chip-out" onClick={() => void signOut()}>
                  Salir
                </button>
              </>
            ) : (
              <NavLink to="/cuenta" className="auth-chip-in">
                Entrar
              </NavLink>
            )}
          </div>
        ) : null}
      </header>
      <main className="main">
        <InstallPrompt />
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Móvil">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ה</span>
          Hoy
        </NavLink>
        <NavLink to="/lecciones" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ל</span>
          Curso
        </NavLink>
        <NavLink to="/practica" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ח</span>
          Práctica
        </NavLink>
        <NavLink to="/tareas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ת</span>
          Tareas
        </NavLink>
        <NavLink to="/mas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ע</span>
          Más
        </NavLink>
      </nav>
    </div>
  )
}
