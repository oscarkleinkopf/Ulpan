import type { Config, Context } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { userSync } from '../../db/schema'

/**
 * GET/PUT /api/sync — copia progreso + aula del usuario autenticado (Identity).
 */
export default async (req: Request, _context: Context) => {
  try {
    const user = await getUser()
    if (!user) {
      return Response.json({ error: 'unauthorized' }, { status: 401 })
    }

    if (req.method === 'GET') {
      const [row] = await db.select().from(userSync).where(eq(userSync.userId, user.id)).limit(1)
      if (!row) {
        return Response.json({ progress: null, classroom: null, updatedAt: null })
      }
      return Response.json({
        progress: row.progress,
        classroom: row.classroom,
        updatedAt: row.updatedAt,
        clientUpdatedAt:
          row.progress && typeof row.progress === 'object' && 'clientUpdatedAt' in (row.progress as object)
            ? undefined
            : row.updatedAt,
      })
    }

    if (req.method === 'PUT') {
      const body = (await req.json()) as {
        progress?: unknown
        classroom?: unknown
        clientUpdatedAt?: string
      }
      const now = new Date()
      const progress = body.progress ?? {}
      const classroom = body.classroom ?? {}

      await db
        .insert(userSync)
        .values({
          userId: user.id,
          progress,
          classroom,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: userSync.userId,
          set: {
            progress,
            classroom,
            updatedAt: now,
          },
        })

      return Response.json({ ok: true, updatedAt: now.toISOString() })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'sync failed'
    console.error('sync error', err)
    return Response.json(
      {
        error:
          msg.includes('connect') || msg.includes('NETLIFY_DB') || msg.includes('database')
            ? 'Base de datos no disponible aún. Despliega en Netlify con @netlify/database.'
            : msg,
      },
      { status: 503 },
    )
  }
}

export const config: Config = {
  path: '/api/sync',
  method: ['GET', 'PUT'],
}
