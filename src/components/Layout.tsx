import { NavLink, Outlet } from 'react-router-dom'

const desktopLinks = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/lecciones', label: 'Lecciones' },
  { to: '/alefato', label: 'Alefato' },
  { to: '/vocabulario', label: 'Vocabulario' },
  { to: '/sionismo', label: 'Sionismo' },
  { to: '/gramatica', label: 'Gramática' },
  { to: '/frases', label: 'Frases' },
  { to: '/practica', label: 'Práctica' },
  { to: '/progreso', label: 'Progreso' },
]

const mobileLinks = [
  { to: '/', label: 'Inicio', end: true, he: 'ב' },
  { to: '/lecciones', label: 'Curso', he: 'ל' },
  { to: '/vocabulario', label: 'Vocab', he: 'מ' },
  { to: '/practica', label: 'Práctica', he: 'ח' },
  { to: '/progreso', label: 'Yo', he: 'א' },
]

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          Ulpan <span>אולפן</span>
        </NavLink>
        <nav className="nav-links" aria-label="Principal">
          {desktopLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main">
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
