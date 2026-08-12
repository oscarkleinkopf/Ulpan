import { NavLink, Outlet } from 'react-router-dom'
import { accountRoleLabel, canRecordAudio } from '../lib/accountRole'
import { useAuthContext } from '../lib/AuthProvider'
import { InstallPrompt } from './InstallPrompt'

export function Layout() {
  const { user, signOut, cloudReady } = useAuthContext()
  const showStudio = canRecordAudio(user)

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" title="Ulpan con la Mora Maggie">
          Ulpan <span className="brand-maggie">Maggie</span>
        </NavLink>
        <nav className="nav-links" aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Inicio
          </NavLink>
          <NavLink to="/lecciones" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Lecciones
          </NavLink>
          <NavLink to="/alefato" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Alefato
          </NavLink>
          <NavLink to="/vocabulario" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Vocabulario
          </NavLink>
          <NavLink to="/sionismo" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Sionismo
          </NavLink>
          <NavLink to="/calendario" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Calendario
          </NavLink>
          <NavLink to="/gramatica" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Gramática
          </NavLink>
          <NavLink to="/frases" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Frases
          </NavLink>
          <NavLink to="/audio-guiado" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Audio
          </NavLink>
          <NavLink to="/pareja" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Pareja
          </NavLink>
          <NavLink to="/practica" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Práctica
          </NavLink>
          <NavLink to="/tareas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Tareas
          </NavLink>
          {showStudio ? (
            <NavLink to="/estudio-audio" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Estudio
            </NavLink>
          ) : null}
          <NavLink to="/entrega-semanal" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Semanal
          </NavLink>
          <NavLink to="/certificados" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Diplomas
          </NavLink>
          <NavLink to="/perfiles" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Perfiles
          </NavLink>
          <NavLink to="/cuenta" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Cuenta
          </NavLink>
          <NavLink to="/progreso" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Progreso
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
          <span className="he-mini">ב</span>
          Inicio
        </NavLink>
        <NavLink to="/lecciones" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ל</span>
          Curso
        </NavLink>
        <NavLink to="/audio-guiado" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ש</span>
          Audio
        </NavLink>
        <NavLink to="/practica" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">ח</span>
          Práctica
        </NavLink>
        <NavLink to="/cuenta" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="he-mini">א</span>
          Cuenta
        </NavLink>
      </nav>
    </div>
  )
}
