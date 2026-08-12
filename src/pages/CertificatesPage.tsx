import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageVisual } from '../components/PageVisual'
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

  function printCert(id: string) {
    const el = document.getElementById(`cert-${id}`)
    if (!el) return
    const prev = document.body.getAttribute('data-print-cert')
    document.body.setAttribute('data-print-cert', id)
    window.print()
    if (prev) document.body.setAttribute('data-print-cert', prev)
    else document.body.removeAttribute('data-print-cert')
  }

  return (
    <section className="section">
      <PageVisual sceneId="progreso" />
      <h2>Certificados</h2>
      <p className="lead">
        Reconocimientos livianos al completar unidades o rachas. Podés imprimirlos o guardarlos como PDF.
      </p>

      {hint ? <p className="banner-msg">{hint}</p> : null}

      {certs.length === 0 ? (
        <div className="panel">
          <p className="lead" style={{ margin: 0 }}>
            Todavía no hay certificados. Completá una unidad o mantené una racha de 3 días.
          </p>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <Link className="btn btn-solid" to="/lecciones">
              Ir a lecciones
            </Link>
            <Link className="btn btn-outline" to="/progreso">
              Ver progreso
            </Link>
          </div>
        </div>
      ) : (
        <div className="cert-grid">
          {certs.map((c) => (
            <article className="certificate" id={`cert-${c.id}`} key={c.id}>
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
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
