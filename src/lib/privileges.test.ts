import { describe, expect, it } from 'vitest'
import { metadataWritesRecordPrivilege, RECORD_PRIVILEGE_METADATA_KEY } from './privileges'

describe('metadataWritesRecordPrivilege', () => {
  it('detects the client-writable privilege key', () => {
    expect(metadataWritesRecordPrivilege({ ulpan_role: 'mora' })).toBe(false)
    expect(metadataWritesRecordPrivilege({ [RECORD_PRIVILEGE_METADATA_KEY]: true })).toBe(true)
    expect(metadataWritesRecordPrivilege({ ulpan_can_record: false })).toBe(true)
  })
})
