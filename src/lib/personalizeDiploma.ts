/** Personaliza un diploma generado dibujando el nombre del talmid sobre el placeholder. */

export type DiplomaKind = 'unit' | 'streak' | 'lessons'

/** Banda del nombre en imágenes 1536×864 (centro horizontal). */
const NAME_BAND: Record<DiplomaKind, { y: number; height: number; width: number }> = {
  unit: { y: 400, height: 56, width: 560 },
  streak: { y: 395, height: 52, width: 520 },
  lessons: { y: 415, height: 54, width: 540 },
}

const PARCHMENT = '#f3ead4'
const INK = '#2a4430'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, start = 44) {
  let size = start
  while (size >= 18) {
    ctx.font = `700 ${size}px "Fraunces", "Times New Roman", serif`
    if (ctx.measureText(text).width <= maxWidth) return size
    size -= 2
  }
  return 18
}

export async function personalizeDiplomaBlob(
  imageUrl: string,
  kind: DiplomaKind,
  studentName: string,
): Promise<Blob> {
  const img = await loadImage(imageUrl)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth || 1536
  canvas.height = img.naturalHeight || 864
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas no disponible')

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const name = studentName.trim() || 'Talmid/a del Ulpan'
  const band = NAME_BAND[kind]
  const scaleX = canvas.width / 1536
  const scaleY = canvas.height / 864
  const bw = band.width * scaleX
  const bh = band.height * scaleY
  const bx = (canvas.width - bw) / 2
  const by = band.y * scaleY

  // Cubrir placeholder con pergamino
  ctx.fillStyle = PARCHMENT
  ctx.fillRect(bx, by, bw, bh)

  // Nombre
  const fontSize = fitFont(ctx, name, bw * 0.92, Math.round(42 * scaleY))
  ctx.font = `700 ${fontSize}px "Fraunces", "Times New Roman", serif`
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, canvas.width / 2, by + bh / 2)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo exportar el diploma'))),
      'image/jpeg',
      0.92,
    )
  })
}

export async function downloadPersonalizedDiploma(
  imageUrl: string,
  kind: DiplomaKind,
  studentName: string,
  filename: string,
) {
  const blob = await personalizeDiplomaBlob(imageUrl, kind, studentName)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
