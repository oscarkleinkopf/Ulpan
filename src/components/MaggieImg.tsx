type Props = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
}

/** Imagen Maggie con webp + jpg de respaldo (archivos en public/) */
export function MaggieImg({ src, alt, className, width, height, loading = 'lazy' }: Props) {
  const base = import.meta.env.BASE_URL
  const webp = `${base}${src}.webp`
  const jpg = `${base}${src}.jpg`
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={jpg}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}
