import { afterEach, describe, expect, it } from 'vitest'
import {
  canRecordAudio,
  clientAuthUserData,
  parseAccountRole,
  stashPendingRole,
  takePendingAccount,
} from './accountRole'
import { metadataWritesRecordPrivilege } from './privileges'

describe('clientAuthUserData', () => {
  it('writes display role and name only', () => {
    const data = clientAuthUserData({ role: 'mora', name: ' Maggie ' })
    expect(data).toEqual({ ulpan_role: 'mora', full_name: 'Maggie' })
    expect(metadataWritesRecordPrivilege(data)).toBe(false)
  })

  it('omits empty names and never sends a record flag', () => {
    const data = clientAuthUserData({ role: 'talmid', name: '  ' })
    expect(data).toEqual({ ulpan_role: 'talmid' })
    expect(data).not.toHaveProperty('ulpan_can_record')
  })
})

describe('canRecordAudio', () => {
  it('is false without the server grant, even for a teacher role', () => {
    expect(canRecordAudio({ canRecord: false })).toBe(false)
    expect(canRecordAudio({ role: 'mora' } as { role: 'mora'; canRecord?: boolean })).toBe(false)
    expect(canRecordAudio(null)).toBe(false)
  })

  it('follows only the server-granted flag', () => {
    expect(canRecordAudio({ canRecord: true })).toBe(true)
    expect(canRecordAudio({ canRecord: true, role: 'talmid' } as { role: 'talmid'; canRecord: boolean })).toBe(
      true,
    )
  })
})

describe('parseAccountRole', () => {
  it('accepts known roles and rejects anything else', () => {
    expect(parseAccountRole('mora')).toBe('mora')
    expect(parseAccountRole('admin')).toBeNull()
    expect(parseAccountRole({ ulpan_role: 'mora' })).toBeNull()
  })
})

describe('pending account stash', () => {
  afterEach(() => {
    try {
      sessionStorage.removeItem('ulpan_pending_account')
    } catch {
      /* node */
    }
  })

  it('stores a role without a recording privilege', () => {
    const store: Record<string, string> = {}
    globalThis.sessionStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v
      },
      removeItem: (k: string) => {
        delete store[k]
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k]
      },
      key: () => null,
      length: 0,
    }

    stashPendingRole('more')
    const pending = takePendingAccount()
    expect(pending).toEqual({ role: 'more' })
    expect(pending).not.toHaveProperty('canRecord')
    expect(store.ulpan_pending_account).toBeUndefined()
  })

  it('ignores a legacy canRecord flag when reading old payloads', () => {
    const store: Record<string, string> = {
      ulpan_pending_account: JSON.stringify({ role: 'mora', canRecord: true }),
    }
    globalThis.sessionStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v
      },
      removeItem: (k: string) => {
        delete store[k]
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k]
      },
      key: () => null,
      length: 0,
    }

    expect(takePendingAccount()).toEqual({ role: 'mora' })
  })
})
