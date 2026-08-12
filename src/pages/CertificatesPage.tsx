import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
import { diplomaArtForKind } from '../data/diplomaArt'
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
        Diplomas con la Mora Maggie según lo logrado. Imprimí o guardá como PDF. También hay un CSV para Canva Bulk
        Create en la carpeta del proyecto.
      </p>

      {hint ? <p className="banner-msg">{hint}</p> : null}

      <div className="cta-row no-print" style={{ marginBottom: '1rem' }}>
        <a className="btn btn-outline" href={`${base}diplomas/ulpan-diplomas-bulk-create.csv`} download>
          Descargar CSV Canva
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
          <DiplomaPreviewGallery base={base} />
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
    </section>
  )
}

function DiplomaPreviewGallery({ base }: { base: string }) {
  const samples = [
    diplomaArtForKind('unit'),
    diplomaArtForKind('streak'),
    diplomaArtForKind('lessons'),
  ]
  return (
    <div className="diploma-preview-rail no-print" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', margin: '0 0 0.75rem' }}>
        Plantillas con Maggie
      </h3>
      <div className="diploma-preview-grid">
        {samples.map((art) => (
          <figure key={art.jpg} className="diploma-preview-card">
            <picture>
              <source srcSet={`${base}${art.webp}`} type="image/webp" />
              <img src={`${base}${art.jpg}`} alt={art.alt} loading="lazy" />
            </picture>
          </figure>
        ))}
      </div>
    </div>
  )
}
