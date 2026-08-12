import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import { alphabet } from '../data/alphabet'
import { phrases } from '../data/phrases'
import { vocabulary } from '../data/vocabulary'
import { canRecordAudio } from '../lib/accountRole'
import {
  clipIdForLetter,
  clipIdForPhrase,
  clipIdForVocab,
  deleteGuidedClip,
  fetchGuidedClips,
  getGuidedClipsCached,
  uploadGuidedClip,
  type GuidedAudioKind,
  type GuidedClip,
} from '../lib/guidedAudio'
import { useAuthContext } from '../lib/AuthProvider'
import { isCloudConfigured } from '../lib/supabase'

type Target =
  | { kind: 'phrase'; id: string; hebrew: string; translit: string; spanish: string; clipId: string }
  | { kind: 'vocab'; id: string; hebrew: string; translit: string; spanish: string; clipId: string }
  | { kind: 'letter'; id: string; hebrew: string; translit: string; spanish: string; clipId: string }
  | { kind: 'custom'; id: string; hebrew: string; translit: string; spanish: string; clipId: string }

const phraseTargets: Target[] = phrases.slice(0, 16).map((p) => ({
  kind: 'phrase',
  id: p.id,
  hebrew: p.hebrew,
  translit: p.translit,
  spanish: p.spanish,
  clipId: clipIdForPhrase(p.id),
}))

const vocabTargets: Target[] = vocabulary.slice(0, 24).map((v) => ({
  kind: 'vocab',
  id: v.id,
  hebrew: v.hebrew,
  translit: v.translit,
  spanish: v.spanish,
  clipId: clipIdForVocab(v.id),
}))

const letterTargets: Target[] = alphabet.slice(0, 12).map((l) => ({
  kind: 'letter',
  id: l.id,
  hebrew: l.hebrew,
  translit: l.translit,
  spanish: l.name,
  clipId: clipIdForLetter(l.id),
}))

export function AudioStudioPage() {
  const { user, cloudReady } = useAuthContext()
  const allowed = canRecordAudio(user)
  const [clips, setClips] = useState<GuidedClip[]>(() => getGuidedClipsCached())
  const [tab, setTab] = useState<'phrase' | 'vocab' | 'letter' | 'custom'>('phrase')
  const [selected, setSelected] = useState<Target | null>(phraseTargets[0] ?? null)
  const [customHe, setCustomHe] = useState('שָׁלוֹם')
  const [customTr, setCustomTr] = useState('shalom')
  const [customEs, setCustomEs] = useState('hola / paz')
  const [customId, setCustomId] = useState('custom-shalom')
  const [recording, setRecording] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    void fetchGuidedClips(true).then(setClips)
  }, [])

  useEffect(() => {
    if (tab === 'phrase') setSelected(phraseTargets[0] ?? null)
    else if (tab === 'vocab') setSelected(vocabTargets[0] ?? null)
    else if (tab === 'letter') setSelected(letterTargets[0] ?? null)
    else {
      setSelected({
        kind: 'custom',
        id: customId,
        hebrew: customHe,
        translit: customTr,
        spanish: customEs,
        clipId: `custom:${customId}`,
      })
    }
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!cloudReady || !isCloudConfigured()) {
    return (
      <section className="section panel">
        <h2>Estudio de audio</h2>
        <p className="lead">Necesitás Supabase configurado para grabar y publicar la voz de la Mora.</p>
        <Link className="btn btn-solid" to="/cuenta">
          Ir a cuenta
        </Link>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="section panel">
        <h2>Estudio de audio</h2>
        <p className="lead">Iniciá sesión como Morá / Moré con permiso de grabación.</p>
        <Link className="btn btn-solid" to="/cuenta">
          Entrar
        </Link>
      </section>
    )
  }

  if (!allowed) {
    return (
      <section className="section panel">
        <PageVisual sceneId="srs" />
        <h2>Estudio de audio</h2>
        <p className="lead">
          Esta cuenta no tiene acceso a grabar. En <strong>Cuenta</strong>, como Morá/Moré, activá “Puedo grabar
          audio guiado”.
        </p>
        <Link className="btn btn-solid" to="/cuenta">
          Activar en mi cuenta
        </Link>
      </section>
    )
  }

  const list =
    tab === 'phrase' ? phraseTargets : tab === 'vocab' ? vocabTargets : tab === 'letter' ? letterTargets : []

  async function startRecording() {
    setMsg('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : ''
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        void saveRecording(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }))
      }
      mediaRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch {
      setMsg('No se pudo acceder al micrófono. Revisá los permisos del navegador.')
    }
  }

  function stopRecording() {
    mediaRef.current?.stop()
    mediaRef.current = null
    setRecording(false)
  }

  async function saveRecording(blob: Blob) {
    const target = resolveTarget()
    if (!target) {
      setMsg('Elegí un ítem para asociar la grabación.')
      return
    }
    setBusy(true)
    setMsg('Subiendo…')
    const result = await uploadGuidedClip({
      clipId: target.clipId,
      kind: target.kind as GuidedAudioKind,
      hebrew: target.hebrew,
      translit: target.translit,
      spanish: target.spanish,
      blob,
    })
    setBusy(false)
    if (!result.ok) {
      setMsg(result.error)
      return
    }
    setClips(await fetchGuidedClips(true))
    setMsg('Listo: la voz de la Mora quedó publicada para el curso.')
  }

  async function onUploadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('audioFile') as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    await saveRecording(file)
    form.reset()
  }

  function resolveTarget(): Target | null {
    if (tab === 'custom') {
      const id = customId.trim() || 'clip'
      return {
        kind: 'custom',
        id,
        hebrew: customHe.trim() || '…',
        translit: customTr.trim(),
        spanish: customEs.trim(),
        clipId: `custom:${id}`,
      }
    }
    return selected
  }

  async function onDelete(clipId: string) {
    if (!confirm('¿Borrar esta grabación?')) return
    setBusy(true)
    const result = await deleteGuidedClip(clipId)
    setBusy(false)
    if (!result.ok) {
      setMsg(result.error)
      return
    }
    setClips(await fetchGuidedClips(true))
    setMsg('Grabación eliminada.')
  }

  const current = resolveTarget()
  const existing = current ? clips.find((c) => c.clipId === current.clipId) : undefined

  return (
    <section className="section">
      <PageVisual sceneId="srs" />
      <h2>Estudio de audio · Mora Maggie</h2>
      <p className="lead">
        Grabá o subí tu voz para el audio guiado. Los talmidim escuchan primero tu grabación; si no hay, usan TTS.
      </p>

      {msg ? <p className="banner-msg">{msg}</p> : null}

      <div className="filter-chips" style={{ marginBottom: '1rem' }}>
        {(
          [
            ['phrase', 'Frases'],
            ['vocab', 'Vocabulario'],
            ['letter', 'Alefato'],
            ['custom', 'Personalizado'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? 'active' : undefined} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab !== 'custom' ? (
        <label className="field">
          <span>Asociar a</span>
          <select
            value={selected?.id ?? ''}
            onChange={(e) => {
              const next = list.find((t) => t.id === e.target.value) ?? null
              setSelected(next)
            }}
          >
            {list.map((t) => (
              <option key={t.id} value={t.id}>
                {t.hebrew} · {t.spanish}
                {clips.some((c) => c.clipId === t.clipId) ? ' ✓' : ''}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="studio-custom">
          <label className="field">
            <span>Id del clip</span>
            <input value={customId} onChange={(e) => setCustomId(e.target.value)} placeholder="custom-shalom" />
          </label>
          <label className="field">
            <span>Hebreo</span>
            <input className="he" dir="rtl" value={customHe} onChange={(e) => setCustomHe(e.target.value)} />
          </label>
          <label className="field">
            <span>Transliteración</span>
            <input value={customTr} onChange={(e) => setCustomTr(e.target.value)} />
          </label>
          <label className="field">
            <span>Español</span>
            <input value={customEs} onChange={(e) => setCustomEs(e.target.value)} />
          </label>
        </div>
      )}

      {current ? (
        <div className="panel studio-preview">
          <div className="guided-card-he">
            <span className="he hebrew-xl" style={{ fontSize: '2.2rem' }}>
              {current.hebrew}
            </span>
            <SpeakButton
              text={current.hebrew}
              clipId={current.clipId}
              audioUrl={existing?.url}
              label="Probar"
            />
          </div>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--ink-soft)' }}>
            {current.translit}
            {current.spanish ? ` · ${current.spanish}` : ''}
          </p>
          <p className="meta-row" style={{ marginTop: '0.5rem' }}>
            <span>
              Clip: <code>{current.clipId}</code>
            </span>
            <span>{existing ? 'Con voz de la Mora' : 'Sin grabación · TTS'}</span>
          </p>
        </div>
      ) : null}

      <div className="cta-row" style={{ marginTop: '1rem' }}>
        {!recording ? (
          <button type="button" className="btn btn-solid" disabled={busy} onClick={() => void startRecording()}>
            Grabar con micrófono
          </button>
        ) : (
          <button type="button" className="btn btn-solid is-recording" onClick={stopRecording}>
            Detener y subir
          </button>
        )}
        {existing ? (
          <button
            type="button"
            className="btn btn-outline"
            disabled={busy}
            onClick={() => void onDelete(existing.clipId)}
          >
            Borrar grabación
          </button>
        ) : null}
        <Link className="btn btn-outline" to="/audio-guiado">
          Ver como talmid
        </Link>
      </div>

      <form className="panel" style={{ marginTop: '1.25rem' }} onSubmit={(e) => void onUploadFile(e)}>
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          O subir un archivo
        </h3>
        <label className="field">
          <span>Audio (webm, mp3, m4a, wav…)</span>
          <input name="audioFile" type="file" accept="audio/*" required />
        </label>
        <button type="submit" className="btn btn-outline" disabled={busy}>
          Subir archivo
        </button>
      </form>

      <div style={{ marginTop: '1.75rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
          Publicados ({clips.length})
        </h3>
        {clips.length === 0 ? (
          <p className="lead">Todavía no hay grabaciones. Empezá por שָׁלוֹם.</p>
        ) : (
          <ul className="studio-clip-list">
            {clips.map((c) => (
              <li key={c.clipId}>
                <span className="he">{c.hebrew || c.clipId}</span>
                <span>{c.spanish || c.translit}</span>
                <SpeakButton text={c.hebrew || 'שלום'} clipId={c.clipId} audioUrl={c.url} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
