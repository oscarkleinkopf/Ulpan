import { maggieSceneById } from '../data/maggieScenes'
import { MaggieImg } from './MaggieImg'

type Props =
  | {
      sceneId: string
      src?: never
      alt?: never
      title?: string
      caption?: string
    }
  | {
      sceneId?: never
      src: string
      alt: string
      title?: string
      caption?: string
    }

/** Franja visual al inicio de una sección (no es card de contenido) */
export function PageVisual(props: Props) {
  const scene = props.sceneId ? maggieSceneById(props.sceneId) : undefined
  const src = scene?.src ?? props.src
  const alt = scene?.title ?? props.alt ?? ''
  const title = props.title ?? scene?.title
  const caption = props.caption ?? scene?.blurb

  if (!src) return null

  return (
    <figure className="page-visual">
      <MaggieImg src={src} alt={alt} className="page-visual-img" width={1200} height={514} loading="eager" />
      {title || caption ? (
        <figcaption className="page-visual-caption">
          {title ? <strong>{title}</strong> : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
