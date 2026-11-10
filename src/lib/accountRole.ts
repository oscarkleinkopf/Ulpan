import {
  createClassroom,
  createProfile,
  isStudent,
  isTeacher,
  roleLabel,
  setActiveProfile,
  type Role,
} from './classroom'
import { getClassroomSnapshot, replaceClassroomState } from './useClassroom'
import { scheduleCloudPush } from './cloudSync'

export type { Role }

export const ACCOUNT_ROLE_OPTIONS: {
  role: Role
  title: string
  kind: 'more' | 'talmid'
  blurb: string
}[] = [
  {
    role: 'mora',
    title: 'Morá',
    kind: 'more',
    blurb: 'Profesora — crea la clase, genera contenido y asigna tareas',
  },
  {
    role: 'more',
    title: 'Moré',
    kind: 'more',
    blurb: 'Profesor — crea la clase, genera contenido y asigna tareas',
  },
  {
    role: 'talmida',
    title: 'Talmidá',
    kind: 'talmid',
    blurb: 'Alumna — recibe y completa las tareas del curso',
  },
  {
    role: 'talmid',
    title: 'Talmid',
    kind: 'talmid',
    blurb: 'Alumno — recibe y completa las tareas del curso',
  },
]

export function parseAccountRole(raw: unknown): Role | null {
  if (raw === 'mora' || raw === 'more' || raw === 'talmid' || raw === 'talmida') return raw
  return null
}

export function accountRoleLabel(role: Role | null | undefined): string {
  return role ? roleLabel(role) : 'Sin rol'
}

const PENDING_KEY = 'ulpan_pending_account'

export type PendingAccount = {
  role: Role
}

export function stashPendingRole(role: Role) {
  try {
    const payload: PendingAccount = { role }
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export function takePendingRole(): Role | null {
  const pending = takePendingAccount()
  return pending?.role ?? null
}

export function takePendingAccount(): PendingAccount | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    sessionStorage.removeItem(PENDING_KEY)
    if (!raw) return null
    // Compat: antes solo se guardaba el rol como string
    if (raw === 'mora' || raw === 'more' || raw === 'talmid' || raw === 'talmida') {
      return { role: raw }
    }
    const parsed = JSON.parse(raw) as PendingAccount
    const role = parseAccountRole(parsed.role)
    if (!role) return null
    return { role }
  } catch {
    return null
  }
}

/**
 * Metadata the client may write on sign-up / role change.
 * Recording privilege is server-granted and must never appear here.
 */
export function clientAuthUserData(input: { role: Role; name?: string }): Record<string, string> {
  const data: Record<string, string> = { ulpan_role: input.role }
  const name = input.name?.trim()
  if (name) data.full_name = name
  return data
}

/** ¿Puede esta cuenta abrir el estudio de grabación? Solo el flag de servidor. */
export function canRecordAudio(user: { canRecord?: boolean } | null | undefined): boolean {
  return Boolean(user?.canRecord)
}

/**
 * Asegura un perfil de aula alineado con el rol de la cuenta
 * (Moré crea clase; Talmid queda listo para unirse).
 */
export function ensureAccountClassroom(displayName: string, role: Role) {
  let state = getClassroomSnapshot()
  const name = displayName.trim() || (isTeacher(role) ? 'Morá Maggie' : 'Talmid')
  const active = state.profiles.find((p) => p.id === state.activeProfileId)

  const sameLane =
    active &&
    ((isTeacher(active.role) && isTeacher(role)) || (isStudent(active.role) && isStudent(role)))

  if (sameLane && active) {
    if (active.role !== role) {
      state = {
        ...state,
        profiles: state.profiles.map((p) => (p.id === active.id ? { ...p, role, name: name || p.name } : p)),
      }
      replaceClassroomState(state)
      scheduleCloudPush()
    }
    if (isTeacher(role) && !state.classroom) {
      state = createClassroom(state, 'Ulpan con la Mora Maggie', active.id)
      replaceClassroomState(state)
      scheduleCloudPush()
    }
    return
  }

  const existing = state.profiles.find((p) => p.role === role)
  if (existing) {
    state = setActiveProfile(state, existing.id)
  } else {
    state = createProfile(state, name, role)
  }

  const profileId = state.activeProfileId
  if (profileId && isTeacher(role) && !state.classroom) {
    state = createClassroom(state, 'Ulpan con la Mora Maggie', profileId)
  }

  replaceClassroomState(state)
  scheduleCloudPush()
}
