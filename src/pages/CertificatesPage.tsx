import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { canvaDiplomaCatalog, diplomaArtForKind } from '../data/diplomaArt'
import {
  certificateLearnerName,
  earnedCertificates,
  nextCertificateHint,
} from '../lib/certificates'
import { useProgress } from '../lib/useProgress'

export function CertificatesPage() {
  const { progress } = useProgress()
  const certs = useMemo(() => earnedCertificates(progress), [progress])
  const hint = nextCertificateHint(progress)
  const name = certificateLearnerName(progress)
  const base = import.meta.env.BASE_URL
  const earnedIds = useMemo(() => new Set(certs.map((c) => c.id)), [certs])

  function printCert(id: string) {
    document.body.setAttribute('data-print-cert', id)
    window.print()
    document.body.removeAttribute('data-print-cert')
  }

  return (
    <section className="section">
      <PageVisual sceneId="progreso" />
      <h2>Certificados</h2>
      <p className="lead">
        Diplomas con la Mora Maggie según lo logrado. Imprimí o guardá como PDF. Para Canva Bulk Create usá el CSV y
        las imágenes de fondo.
      </p>

      {hint ? <p className="banner-msg">{hint}</p> : null}

      <div className="cta-row no-print" style={{ marginBottom: '1rem' }}>
        <a className="btn btn-outline" href={`${base}diplomas/ulpan-diplomas-bulk-create.csv`} download>
          Descargar CSV Canva
        </a>
        <a className="btn btn-outline" href={`${base}diplomas/README.md`} target="_blank" rel="noreferrer">
          Guía Canva
        </a>
        <Link className="btn btn-outline" to="/progreso">
          Ver progreso
        </Link>
      </div>

      {certs.length === 0 ? (
        <div className="panel">
          <p className="lead" style={{ margin: 0 }}>
            Todavía no hay certificados. Completá una unidad o mantené una racha de 3 días.
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
            const art = diplomaArtForKind(c.kind)
            return (
              <article className="certificate certificate--art" id={`cert-${c.id}`} key={c.id}>
                <div className="certificate-art" aria-hidden="true">
                  <picture>
                    <source srcSet={`${base}${art.webp}`} type="image/webp" />
                    <img src={`${base}${art.jpg}`} alt="" />
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
                  <button type="button" className="btn btn-outline no-print" onClick={() => printCert(c.id)}>
                    Imprimir / PDF
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <DiplomaCatalog base={base} earnedIds={earnedIds} />
    </section>
  )
}

function DiplomaCatalog({ base, earnedIds }: { base: string; earnedIds: Set<string> }) {
  return (
    <div className="diploma-preview-rail no-print" style={{ marginTop: '1.75rem' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', margin: '0 0 0.35rem' }}>
        Catálogo Canva · Mora Maggie
      </h3>
      <p className="lead" style={{ marginTop: 0 }}>
        13 diseños listos para Bulk Create. El arte de fondo cambia según el tipo de logro.
      </p>
      <div className="diploma-catalog-grid">
        {canvaDiplomaCatalog.map((row) => {
          const art = diplomaArtForKind(row.kind)
          const unlocked = earnedIds.has(row.certId)
          return (
            <article key={row.diplomaId} className={`diploma-catalog-card${unlocked ? ' is-unlocked' : ''}`}>
              <figure className="diploma-preview-card">
                <picture>
                  <source srcSet={`${base}${art.webp}`} type="image/webp" />
                  <img src={`${base}${art.jpg}`} alt={art.alt} loading="lazy" />
                </picture>
              </figure>
              <div className="diploma-catalog-meta">
                <p className="he cert-he" style={{ fontSize: '1.35rem', margin: 0 }}>
                  {row.hebrewTitle}
                </p>
                <h4>{row.title}</h4>
                <p>{row.subtitle}</p>
                <p className="cert-detail">{row.detail}</p>
                <p className="diploma-catalog-status">{unlocked ? 'Desbloqueado' : 'Pendiente'}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
