import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import {
  canvaDiplomaCatalog,
  catalogRowByCertId,
  diplomaArtForKind,
  generatedDiplomaPaths,
} from '../data/diplomaArt'
import {
  certificateLearnerName,
  earnedCertificates,
  nextCertificateHint,
} from '../lib/certificates'
import { downloadPersonalizedDiploma } from '../lib/personalizeDiploma'
import { useProgress } from '../lib/useProgress'

export function CertificatesPage() {
  const { progress } = useProgress()
  const certs = useMemo(() => earnedCertificates(progress), [progress])
  const hint = nextCertificateHint(progress)
  const name = certificateLearnerName(progress)
  const base = import.meta.env.BASE_URL
  const earnedIds = useMemo(() => new Set(certs.map((c) => c.id)), [certs])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasCustomName = Boolean(progress.displayName.trim())

  function printCert(id: string) {
    const el = document.getElementById(`cert-${id}`)
    document.querySelectorAll('.certificate.is-printing').forEach((n) => n.classList.remove('is-printing'))
    el?.classList.add('is-printing')
    document.body.setAttribute('data-print-cert', id)
    window.print()
    window.setTimeout(() => {
      document.body.removeAttribute('data-print-cert')
      el?.classList.remove('is-printing')
    }, 400)
  }

  async function downloadNamed(diplomaId: string, kind: 'unit' | 'streak' | 'lessons') {
    setError(null)
    setBusyId(diplomaId)
    try {
      const paths = generatedDiplomaPaths(diplomaId)
      const url = `${base}${paths.jpg}`
      const safe = name.replace(/[^\wáéíóúñüÁÉÍÓÚÑÜ -]+/gi, '').trim() || 'talmid'
      await downloadPersonalizedDiploma(url, kind, name, `ulpan-${diplomaId}-${safe}.jpg`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo personalizar el diploma')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="section">
      <PageVisual sceneId="progreso" />
      <h2>Certificados</h2>
      <p className="lead">
        Diplomas con la Mora Maggie listos para descargar. Si cargaste tu nombre en Progreso, podés bajarlos
        personalizados.
      </p>

      {hint ? <p className="banner-msg">{hint}</p> : null}
      {error ? <p className="banner-msg is-error">{error}</p> : null}

      {!hasCustomName ? (
        <p className="banner-msg no-print">
          Tip: poné tu nombre en <Link to="/progreso">Progreso</Link> para descargar diplomas a tu nombre.
        </p>
      ) : null}

      <div className="cta-row no-print" style={{ marginBottom: '1rem' }}>
        <a className="btn btn-solid" href={`${base}diplomas/ulpan-diplomas-maggie.zip`} download>
          Descargar ZIP (13 diplomas)
        </a>
        <a className="btn btn-outline" href={`${base}diplomas/ulpan-diplomas-bulk-create.csv`} download>
          CSV Canva
        </a>
        <Link className="btn btn-outline" to="/progreso">
          {hasCustomName ? 'Cambiar nombre' : 'Poner mi nombre'}
        </Link>
      </div>

      {certs.length === 0 ? (
        <div className="panel">
          <p className="lead" style={{ margin: 0 }}>
            Todavía no desbloqueaste certificados. Completá una unidad o mantené una racha de 3 días. Abajo están los
            13 diplomas del lote listos para descargar.
          </p>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <Link className="btn btn-solid" to="/lecciones">
              Ir a lecciones
            </Link>
          </div>
        </div>
      ) : (
        <div className="cert-grid">
          {certs.map((c) => {
            const row = catalogRowByCertId(c.id)
            const generated = row ? generatedDiplomaPaths(row.diplomaId) : null
            const art = diplomaArtForKind(c.kind)
            const imgJpg = generated?.jpg ?? art.jpg
            const imgWebp = generated?.webp ?? art.webp
            return (
              <article className="certificate certificate--art" id={`cert-${c.id}`} key={c.id}>
                <div className="certificate-art">
                  <picture>
                    <source srcSet={`${base}${imgWebp}`} type="image/webp" />
                    <img src={`${base}${imgJpg}`} alt={`${c.title} — ${name}`} />
                  </picture>
                </div>
                <div className="certificate-copy">
                  <p className="cert-brand">Ulpan con la Mora Maggie</p>
                  <p className="he cert-he">{c.hebrew}</p>
                  <h3>{c.title}</h3>
                  <p className="cert-sub">{c.subtitle}</p>
                  <p className="cert-name">{name}</p>
                  <p className="cert-detail">{c.detail}</p>
                  <p className="cert-date">{c.earnedAt}</p>
                  <div className="cta-row no-print" style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
                    {row && generated ? (
                      <button
                        type="button"
                        className="btn btn-solid"
                        disabled={busyId === row.diplomaId}
                        onClick={() => void downloadNamed(row.diplomaId, row.kind)}
                      >
                        {busyId === row.diplomaId ? 'Generando…' : 'Descargar con mi nombre'}
                      </button>
                    ) : null}
                    {generated ? (
                      <a className="btn btn-outline" href={`${base}${generated.jpg}`} download>
                        JPG base
                      </a>
                    ) : null}
                    <button type="button" className="btn btn-outline" onClick={() => printCert(c.id)}>
                      Imprimir
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <DiplomaCatalog
        base={base}
        earnedIds={earnedIds}
        name={name}
        busyId={busyId}
        onDownloadNamed={(id, kind) => void downloadNamed(id, kind)}
      />
    </section>
  )
}

function DiplomaCatalog({
  base,
  earnedIds,
  name,
  busyId,
  onDownloadNamed,
}: {
  base: string
  earnedIds: Set<string>
  name: string
  busyId: string | null
  onDownloadNamed: (diplomaId: string, kind: 'unit' | 'streak' | 'lessons') => void
}) {
  return (
    <div className="diploma-preview-rail no-print" style={{ marginTop: '1.75rem' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', margin: '0 0 0.35rem' }}>
        Lote generado · Mora Maggie
      </h3>
      <p className="lead" style={{ marginTop: 0 }}>
        13 diplomas listos. Descargá el JPG base o con tu nombre ({name}).
      </p>
      <div className="diploma-catalog-grid">
        {canvaDiplomaCatalog.map((row) => {
          const art = generatedDiplomaPaths(row.diplomaId)
          const unlocked = earnedIds.has(row.certId)
          return (
            <article key={row.diplomaId} className={`diploma-catalog-card${unlocked ? ' is-unlocked' : ''}`}>
              <figure className="diploma-preview-card">
                <picture>
                  <source srcSet={`${base}${art.webp}`} type="image/webp" />
                  <img src={`${base}${art.jpg}`} alt={`${row.title}: ${row.subtitle}`} loading="lazy" />
                </picture>
              </figure>
              <div className="diploma-catalog-meta">
                <p className="he cert-he" style={{ fontSize: '1.35rem', margin: 0 }}>
                  {row.hebrewTitle}
                </p>
                <h4>{row.title}</h4>
                <p>{row.subtitle}</p>
                <p className="cert-detail">{row.detail}</p>
                <p className="diploma-catalog-status">{unlocked ? 'Desbloqueado' : 'En el lote'}</p>
                <div className="cta-row" style={{ marginTop: '0.5rem', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-solid"
                    disabled={busyId === row.diplomaId}
                    onClick={() => onDownloadNamed(row.diplomaId, row.kind)}
                  >
                    {busyId === row.diplomaId ? '…' : 'Con mi nombre'}
                  </button>
                  <a className="btn btn-outline" href={`${base}${art.jpg}`} download>
                    JPG
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
