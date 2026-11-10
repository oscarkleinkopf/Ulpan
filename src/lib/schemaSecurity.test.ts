import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const schema = readFileSync(resolve(process.cwd(), 'supabase/schema.sql'), 'utf8')

function functionBody(name: string): string {
  const re = new RegExp(
    `create or replace function public\\.${name}\\([\\s\\S]*?as \\$\\$([\\s\\S]*?)\\$\\$;`,
    'i',
  )
  const match = schema.match(re)
  if (!match) throw new Error(`function ${name} not found`)
  return match[1]
}

describe('supabase recording authorization', () => {
  it('does not grant recording from client-writable user_metadata', () => {
    expect(functionBody('ulpan_can_record')).not.toMatch(/user_metadata/)
    expect(schema).not.toMatch(/user_metadata'\s*->>\s*'ulpan_can_record'/)
  })

  it('stores can_record in ulpan_privileges with select-own only', () => {
    expect(schema).toMatch(/create table if not exists public\.ulpan_privileges/)
    expect(schema).toMatch(/ulpan_privileges_select_own/)
    expect(schema).not.toMatch(/on public\.ulpan_privileges for insert/)
    expect(schema).not.toMatch(/on public\.ulpan_privileges for update/)
    expect(schema).not.toMatch(/on public\.ulpan_privileges for delete/)
    expect(schema).toMatch(/revoke insert, update, delete on public\.ulpan_privileges/)
  })

  it('defaults new and existing users to can_record = false', () => {
    expect(schema).toMatch(/values \(new\.id, false\)/)
    expect(schema).toMatch(/select id, false from auth\.users/)
  })

  it('reads ulpan_can_record() from the privileges table', () => {
    expect(functionBody('ulpan_can_record')).toMatch(/ulpan_privileges/)
    expect(functionBody('ulpan_can_record')).toMatch(/p\.can_record/)
  })
})
