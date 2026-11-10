import { getSupabase } from './supabase'

/** Client must never send this key in auth.updateUser / signUp metadata. */
export const RECORD_PRIVILEGE_METADATA_KEY = 'ulpan_can_record'

export function metadataWritesRecordPrivilege(data: Record<string, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(data, RECORD_PRIVILEGE_METADATA_KEY)
}

/**
 * Recording privilege lives in public.ulpan_privileges (RLS: select-own only).
 * Fail closed if the table is missing or the row is absent.
 */
export async function fetchServerCanRecord(): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data, error } = await supabase
    .from('ulpan_privileges')
    .select('can_record')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !data) return false
  return data.can_record === true
}
