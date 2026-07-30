import type { Config, Context } from '@netlify/functions'

/**
 * Proxy TTS hebreo para evitar bloqueos de referrer/CORS en el navegador.
 * GET /api/tts?q=שלום
 */
export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim().slice(0, 180)
  if (!q) {
    return Response.json({ error: 'missing q' }, { status: 400 })
  }

  const tts = new URL('https://translate.google.com/translate_tts')
  tts.searchParams.set('ie', 'UTF-8')
  tts.searchParams.set('client', 'tw-ob')
  tts.searchParams.set('tl', 'he')
  tts.searchParams.set('q', q)

  const upstream = await fetch(tts.toString(), {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
    },
  })

  if (!upstream.ok) {
    return new Response('TTS upstream error', { status: 502 })
  }

  const buf = await upstream.arrayBuffer()
  return new Response(buf, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const config: Config = {
  path: '/api/tts',
}
