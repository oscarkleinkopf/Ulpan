import { Link } from 'react-router-dom'
import { maggieScenes } from '../data/maggieScenes'
import { MaggieImg } from './MaggieImg'

export function MaggieGallery() {
  return (
    <section className="section maggie-gallery" aria-label="Escenas con la Mora Maggie">
      <h2>Con la Mora Maggie</h2>
      <p className="lead">Ilustraciones del Ulpan: del alefato a Israel, con humor y cariño.</p>
      <div className="maggie-rail">
        {maggieScenes.map((scene) => (
          <Link key={scene.id} to={scene.to} className="maggie-rail-item">
            <MaggieImg src={scene.src} alt={scene.title} className="maggie-rail-img" width={360} height={270} />
            <span className="maggie-rail-caption">
              <strong>{scene.title}</strong>
              <em>{scene.blurb}</em>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
