import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../lib/AuthProvider'
import { getSyncStatus, pullAndMergeCloud, pushCloudNow, subscribeSyncStatus } from '../lib/cloudSync'

type Mode = 'login' | 'signup' | 'recover'

export function AccountPage() {
  const {
    user,
    loading,
    cloudReady,
    message,
    needsNewPassword,
    signIn,
    signUp,
    signOut,
    recover,
    updatePassword,
  } = useAuthContext()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [syncLabel, setSyncLabel] = useState('')

  useEffect(() => {
    return subscribeSyncStatus((status, detail) => {
      if (status === 'syncing') setSyncLabel(detail || 'Sincronizando…')
      else if (status === 'ok') setSyncLabel(detail || 'Al día')
      else if (status === 'error' || status === 'offline') setSyncLabel(detail || 'Error')
      else setSyncLabel(detail || '')
    })
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (mode === 'login') await signIn(email, password)
    else if (mode === 'signup') await signUp(email, password, name)
    else await recover(email)
  }

  async function onResetPassword(e: FormEvent) {
    e.preventDefault()
    if (!newPassword.trim()) return
    await updatePassword(newPassword)
    setNewPassword('')
  }

  if (loading) {
    return (
      <section className="section panel">
        <h2>Cuenta en la nube</h2>
        <p className="lead">Cargando sesión…</p>
      </section>
    )
  }

  if (!cloudReady) {
    return (
      <section className="section panel">
        <h2>Cuenta en la nube</h2>
        <p className="lead">
          El progreso sigue guardándose en este dispositivo. Para sincronizar entre celular y PC en
          GitHub Pages, configura un proyecto <strong>Supabase</strong> gratuito.
        </p>
        <ol className="setup-steps">
          <li>
            Crea un proyecto en{' '}
            <a href="https://supabase.com" target="_blank" rel="noreferrer">
              supabase.com
            </a>
            .
          </li>
          <li>
            En SQL Editor, ejecuta el archivo <code>supabase/schema.sql</code> del repo.
          </li>
          <li>
            En Authentication → URL configuration, agrega{' '}
            <code>https://oscarkleinkopf.github.io/Ulpan/*</code> como Redirect URL.
          </li>
          <li>
            En GitHub → Settings → Secrets → Actions, crea{' '}
            <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> (Project Settings →
            API).
          </li>
          <li>Vuelve a publicar el sitio (push a main o workflow “Build GitHub Pages”).</li>
        </ol>
        <Link className="btn btn-outline" to="/">
          Volver al inicio
        </Link>
      </section>
    )
  }

  return (
    <section className="section">
      <h2>Cuenta en la nube</h2>
      <p className="lead">
        Misma cuenta en el celular y la computadora (también en GitHub Pages): progreso, perfiles y
        tareas se fusionan automáticamente.
      </p>

      {message ? <p className={`banner-msg${message.type === 'error' ? ' is-error' : ''}`}>{message.text}</p> : null}
      {syncLabel ? <p className="sync-status">{syncLabel}</p> : null}

      {user ? (
        <div className="panel">
          <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
            Sesión activa
          </h3>
          <p style={{ margin: '0 0 1rem' }}>
            <strong>{user.name ?? 'Sin nombre'}</strong>
            <br />
            <span style={{ color: 'var(--ink-soft)' }}>{user.email}</span>
          </p>
          <div className="cta-row">
            <button type="button" className="btn btn-solid" onClick={() => void pullAndMergeCloud()}>
              Sincronizar ahora
            </button>
            <button type="button" className="btn btn-outline" onClick={() => void pushCloudNow()}>
              Subir este dispositivo
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>
              Cerrar sesión
            </button>
          </div>

          <form onSubmit={onResetPassword} style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
              {needsNewPassword ? 'Nueva contraseña (recuperación)' : 'Cambiar contraseña'}
            </h3>
            <label className="field">
              <span>Contraseña</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button type="submit" className="btn btn-outline">
              Guardar contraseña
            </button>
          </form>

          <p style={{ marginTop: '1.25rem', color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
            Estado: {getSyncStatus().status}. También puedes gestionar{' '}
            <Link to="/perfiles">perfiles</Link> y <Link to="/tareas">tareas</Link>.
          </p>
        </div>
      ) : (
        <form className="panel" onSubmit={onSubmit}>
          <div className="filter-chips" style={{ marginBottom: '1rem' }}>
            <button type="button" className={mode === 'login' ? 'active' : undefined} onClick={() => setMode('login')}>
              Entrar
            </button>
            <button type="button" className={mode === 'signup' ? 'active' : undefined} onClick={() => setMode('signup')}>
              Crear cuenta
            </button>
            <button type="button" className={mode === 'recover' ? 'active' : undefined} onClick={() => setMode('recover')}>
              Olvidé contraseña
            </button>
          </div>

          {mode === 'signup' ? (
            <label className="field">
              <span>Nombre</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maggie / tu nombre" />
            </label>
          ) : null}

          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          {mode !== 'recover' ? (
            <label className="field">
              <span>Contraseña</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </label>
          ) : null}

          <button type="submit" className="btn btn-solid">
            {mode === 'login' ? 'Iniciar sesión' : mode === 'signup' ? 'Registrarme' : 'Enviar enlace'}
          </button>
        </form>
      )}
    </section>
  )
}
