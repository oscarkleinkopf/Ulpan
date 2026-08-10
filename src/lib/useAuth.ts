import { useEffect, useState } from 'react'
import {
  AuthError,
  MissingIdentityError,
  getSettings,
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  requestPasswordRecovery,
  signup,
  type User,
} from '@netlify/identity'
import { pullAndMergeCloud, setCloudAuthEnabled } from './cloudSync'

export type AuthMessage = { type: 'ok' | 'error' | 'info'; text: string }

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [identityReady, setIdentityReady] = useState(true)
  const [message, setMessage] = useState<AuthMessage | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        await getSettings()
        await handleAuthCallback()
        const current = await getUser()
        if (!alive) return
        setUser(current)
        setCloudAuthEnabled(Boolean(current))
        if (current) void pullAndMergeCloud()
      } catch (err) {
        if (err instanceof MissingIdentityError) {
          if (alive) setIdentityReady(false)
        } else if (alive) {
          // Entornos sin Identity (p.ej. GitHub Pages / vite puro)
          setIdentityReady(false)
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()

    try {
      return onAuthChange((_event, currentUser) => {
        setUser(currentUser)
        setCloudAuthEnabled(Boolean(currentUser))
        if (currentUser) void pullAndMergeCloud()
      })
    } catch {
      return undefined
    }
  }, [])

  async function signIn(email: string, password: string) {
    setMessage(null)
    try {
      const current = await login(email, password)
      setUser(current)
      setCloudAuthEnabled(true)
      setMessage({ type: 'ok', text: `Shalom, ${current.name ?? current.email}` })
      await pullAndMergeCloud()
    } catch (err) {
      setMessage({ type: 'error', text: authErrorText(err) })
    }
  }

  async function signUp(email: string, password: string, name: string) {
    setMessage(null)
    try {
      const current = await signup(email, password, { full_name: name })
      if (current.confirmedAt) {
        setUser(current)
        setCloudAuthEnabled(true)
        setMessage({ type: 'ok', text: 'Cuenta creada. Sincronizando…' })
        await pullAndMergeCloud()
      } else {
        setMessage({
          type: 'info',
          text: 'Revisa tu correo para confirmar la cuenta. Luego inicia sesión.',
        })
      }
    } catch (err) {
      setMessage({ type: 'error', text: authErrorText(err) })
    }
  }

  async function signOut() {
    await logout()
    setUser(null)
    setCloudAuthEnabled(false)
    setMessage({ type: 'info', text: 'Sesión cerrada. Los datos locales siguen en este dispositivo.' })
  }

  async function recover(email: string) {
    setMessage(null)
    try {
      await requestPasswordRecovery(email)
      setMessage({ type: 'info', text: 'Te enviamos un enlace para restablecer la contraseña.' })
    } catch (err) {
      setMessage({ type: 'error', text: authErrorText(err) })
    }
  }

  return {
    user,
    loading,
    identityReady,
    message,
    setMessage,
    signIn,
    signUp,
    signOut,
    recover,
  }
}

function authErrorText(err: unknown): string {
  if (err instanceof MissingIdentityError) {
    return 'Identity no está activo. Despliega en Netlify y actívalo en Project configuration → Identity.'
  }
  if (err instanceof AuthError) {
    if (err.status === 401) return 'Correo o contraseña incorrectos.'
    if (err.status === 403) return 'Registros deshabilitados o acción no permitida.'
    if (err.status === 422) return 'Datos inválidos (revisa el correo o usa una contraseña más fuerte).'
    return err.message
  }
  if (err instanceof Error) return err.message
  return 'No se pudo completar la operación.'
}
