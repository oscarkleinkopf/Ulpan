import { NavLink, Outlet } from 'react-router-dom'
import { accountRoleLabel } from '../lib/accountRole'
import { useAuthContext } from '../lib/AuthProvider'
import { InstallPrompt } from './InstallPrompt'

const desktopLinks = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/lecciones', label: 'Lecciones' },
  { to: '/alefato', label: 'Alefato' },
  { to: '/vocabulario', label: 'Vocabulario' },
  { to: '/sionismo', label: 'Sionismo' },
  { to: '/gramatica', label: 'Gramática' },
  { to: '/frases', label: 'Frases' },
  { to: '/practica', label: 'Práctica' },
  { to: '/tareas', label: 'Tareas' },
  { to: '/perfiles', label: 'Perfiles' },
  { to: '/cuenta', label: 'Cuenta' },
  { to: '/progreso', label: 'Progreso' },
]

const mobileLinks = [
  { to: '/', label: 'Inicio', end: true, he: 'ב' },
  { to: '/lecciones', label: 'Curso', he: 'ל' },
  { to: '/tareas', label: 'Tareas', he: 'מ' },
  { to: '/practica', label: 'Práctica', he: 'ח' },
  { to: '/cuenta', label: 'Cuenta', he: 'א' },
]

export function Layout() {
  const { user, signOut, cloudReady } = useAuthContext()

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" title="Ulpan con la Mora Maggie">
          Ulpan <span className="brand-maggie">Maggie</span>
        </NavLink>
        <nav className="nav-links" aria-label="Principal">
          {desktopLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {l.label}
            </NavLink>
          ))}
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
        {mobileLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            <span className="he-mini">{l.he}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
