import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  canRecordAudio,
  ensureAccountClassroom,
  parseAccountRole,
  parseCanRecord,
  stashPendingRole,
  takePendingAccount,
  type Role,
} from './accountRole'
import { fetchGuidedClips } from './guidedAudio'
import { pullAndMergeCloud, setCloudAuthEnabled } from './cloudSync'
import {
  authRedirectTo,
  getSupabase,
  isCloudConfigured,
  type CloudUser,
} from './supabase'

export type AuthMessage = { type: 'ok' | 'error' | 'info'; text: string }

function toCloudUser(session: Session | null): CloudUser | null {
  const u = session?.user
  if (!u) return null
  const meta = u.user_metadata ?? {}
  const name =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    undefined
  const role = parseAccountRole(meta.ulpan_role)
  return {
    id: u.id,
    email: u.email,
    name,
    role,
    canRecord: role ? parseCanRecord(meta.ulpan_can_record) : false,
  }
}

async function afterLogin(user: CloudUser) {
  setCloudAuthEnabled(true)
  await pullAndMergeCloud()
  if (user.role) {
    ensureAccountClassroom(user.name || user.email || '', user.role)
  }
  void fetchGuidedClips(true)
}

async function applyPendingAccount(session: Session): Promise<CloudUser | null> {
  const supabase = getSupabase()
  if (!supabase) return toCloudUser(session)
  let current = toCloudUser(session)
  const pending = takePendingAccount()
  if (!current || !pending) return current

  const needsRole = !current.role
  const needsRecordFlag =
    pending.role &&
    (pending.role === 'mora' || pending.role === 'more') &&
    current.canRecord !== pending.canRecord

  if (!needsRole && !needsRecordFlag) return current

  const { data: updated, error } = await supabase.auth.updateUser({
    data: {
      ...(needsRole ? { ulpan_role: pending.role } : {}),
      ulpan_can_record: pending.canRecord,
    },
  })
  if (!error && updated.user) {
    current = toCloudUser({ ...session, user: updated.user })
  }
  return current
}

export function useAuth() {
  const [user, setUser] = useState<CloudUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [cloudReady, setCloudReady] = useState(true)
  const [needsNewPassword, setNeedsNewPassword] = useState(false)
  const [message, setMessage] = useState<AuthMessage | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase || !isCloudConfigured()) {
      setCloudReady(false)
      setLoading(false)
      return
    }

    let alive = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!alive) return
      let current = data.session ? await applyPendingAccount(data.session) : null
      setUser(current)
      if (current) await afterLogin(current)
      else void fetchGuidedClips(true)
      setLoading(false)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      void (async () => {
        if (event === 'PASSWORD_RECOVERY') {
          setNeedsNewPassword(true)
          setMessage({ type: 'info', text: 'Elige una nueva contraseña para tu cuenta.' })
        }
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
          const current = await applyPendingAccount(session)
          setUser(current)
          if (current) await afterLogin(current)
        } else {
          const current = toCloudUser(session)
          setUser(current)
          setCloudAuthEnabled(Boolean(current))
        }
      })()
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
      return
    }
    const current = toCloudUser(data.session)
    setUser(current)
    if (current) {
      await afterLogin(current)
      setMessage({
        type: 'ok',
        text: current.role
          ? `Shalom, ${current.name ?? current.email} · ${roleHello(current.role)}`
          : `Shalom, ${current.name ?? current.email}. Elige tu rol (Moré o Talmid).`,
      })
    }
  }

  async function signUp(
    email: string,
    password: string,
    name: string,
    role: Role,
    canRecord = false,
  ) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    const record = role === 'mora' || role === 'more' ? Boolean(canRecord) : false
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim() || undefined,
          ulpan_role: role,
          ulpan_can_record: record,
        },
        emailRedirectTo: authRedirectTo('cuenta'),
      },
    })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
      return
    }
    if (data.session) {
      const current = toCloudUser(data.session)
      setUser(current)
      if (current) await afterLogin(current)
      setMessage({
        type: 'ok',
        text: record
          ? `Cuenta de ${roleHello(role)} creada con acceso a grabar audio.`
          : `Cuenta de ${roleHello(role)} creada. Sincronizando…`,
      })
    } else {
      stashPendingRole(role, record)
      setMessage({
        type: 'info',
        text: 'Revisa tu correo para confirmar. Tu rol se guardará al confirmar / iniciar sesión.',
      })
    }
  }

  async function signOut() {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setCloudAuthEnabled(false)
    setNeedsNewPassword(false)
    setMessage({ type: 'info', text: 'Sesión cerrada. Los datos locales siguen en este dispositivo.' })
  }

  async function recover(email: string) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authRedirectTo('cuenta'),
    })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
      return
    }
    setMessage({ type: 'info', text: 'Te enviamos un enlace para restablecer la contraseña.' })
  }

  async function updatePassword(newPassword: string) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
      return
    }
    setNeedsNewPassword(false)
    setMessage({ type: 'ok', text: 'Contraseña actualizada.' })
  }

  async function signInWithGoogle(role?: Role, canRecord = false) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    if (role) {
      const record = role === 'mora' || role === 'more' ? Boolean(canRecord) : false
      stashPendingRole(role, record)
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirectTo('cuenta'),
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
    }
  }

  async function setAccountRole(role: Role, canRecord?: boolean) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    const record =
      role === 'mora' || role === 'more'
        ? canRecord !== undefined
          ? Boolean(canRecord)
          : true
        : false
    const { data, error } = await supabase.auth.updateUser({
      data: { ulpan_role: role, ulpan_can_record: record },
    })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
      return
    }
    const { data: sessionData } = await supabase.auth.getSession()
    const current = toCloudUser(
      sessionData.session && data.user
        ? { ...sessionData.session, user: data.user }
        : sessionData.session,
    )
    setUser(current)
    if (current) await afterLogin(current)
    setMessage({
      type: 'ok',
      text: record
        ? `Rol guardado: ${roleHello(role)} · puede grabar audio`
        : `Rol guardado: ${roleHello(role)}`,
    })
  }

  async function setCanRecord(canRecord: boolean) {
    setMessage(null)
    const supabase = getSupabase()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase no está configurado.' })
      return
    }
    if (!user?.role || (user.role !== 'mora' && user.role !== 'more')) {
      setMessage({ type: 'error', text: 'Solo Morá / Moré pueden activar la grabación.' })
      return
    }
    const { data, error } = await supabase.auth.updateUser({
      data: { ulpan_can_record: Boolean(canRecord) },
    })
    if (error) {
      setMessage({ type: 'error', text: authErrorText(error.message) })
      return
    }
    const { data: sessionData } = await supabase.auth.getSession()
    const current = toCloudUser(
      sessionData.session && data.user
        ? { ...sessionData.session, user: data.user }
        : sessionData.session,
    )
    setUser(current)
    setMessage({
      type: 'ok',
      text: canRecord
        ? 'Acceso a grabar audio activado. Abrí Estudio de audio.'
        : 'Acceso a grabar audio desactivado.',
    })
  }

  return {
    user,
    loading,
    cloudReady,
    identityReady: cloudReady,
    needsNewPassword,
    message,
    setMessage,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    recover,
    updatePassword,
    setAccountRole,
    setCanRecord,
    canRecord: canRecordAudio(user),
  }
}

function roleHello(role: Role): string {
  switch (role) {
    case 'mora':
      return 'Morá'
    case 'more':
      return 'Moré'
    case 'talmida':
      return 'Talmidá'
    case 'talmid':
      return 'Talmid'
  }
}

function authErrorText(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) {
    return 'Correo o contraseña incorrectos.'
  }
  if (m.includes('email not confirmed')) {
    return 'Confirma tu correo antes de iniciar sesión.'
  }
  if (m.includes('user already registered')) {
    return 'Ese correo ya tiene cuenta. Prueba iniciar sesión.'
  }
  if (m.includes('password')) return 'Usa una contraseña más fuerte (mín. 8 caracteres).'
  if (m.includes('provider is not enabled') || m.includes('unsupported provider')) {
    return 'Google aún no está activado en Supabase (Authentication → Providers → Google).'
  }
  return msg
}
