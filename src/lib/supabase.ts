import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Role } from './classroom'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? ''
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? ''

export function isCloudConfigured(): boolean {
  return Boolean(url && anonKey)
}

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isCloudConfigured()) return null
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  }
  return client
}

/** URL de retorno para emails de Supabase (confirma / recupera) */
export function authRedirectTo(path = 'cuenta'): string {
  const base = import.meta.env.BASE_URL || '/'
  const root = `${window.location.origin}${base}`.replace(/\/?$/, '/')
  return `${root}${path.replace(/^\//, '')}`
}

export type CloudUser = {
  id: string
  email?: string
  name?: string
  /** Rol de cuenta: Moré/Morá (profesor) o Talmid/Talmidá (alumno) */
  role?: Role | null
}
