/** Plantillas visuales de diplomas (arte Maggie) + datos para Canva Bulk Create */

export type DiplomaArtKind = 'unit' | 'streak' | 'lessons' | 'master'

export const diplomaArt: Record<DiplomaArtKind, { webp: string; jpg: string; alt: string }> = {
  master: {
    webp: 'images/diplomas/diploma-template-master.webp',
    jpg: 'images/diplomas/diploma-template-master.jpg',
    alt: 'Plantilla de diploma Ulpan con la Mora Maggie',
  },
  unit: {
    webp: 'images/diplomas/diploma-unit.webp',
    jpg: 'images/diplomas/diploma-unit.jpg',
    alt: 'Diploma por unidad completada con la Mora Maggie',
  },
  streak: {
    webp: 'images/diplomas/diploma-streak.webp',
    jpg: 'images/diplomas/diploma-streak.jpg',
    alt: 'Diploma de racha de estudio con la Mora Maggie',
  },
  lessons: {
    webp: 'images/diplomas/diploma-lessons.webp',
    jpg: 'images/diplomas/diploma-lessons.jpg',
    alt: 'Diploma por lecciones completadas con la Mora Maggie',
  },
}

export function diplomaArtForKind(kind: 'unit' | 'streak' | 'lessons') {
  return diplomaArt[kind] ?? diplomaArt.master
}

/** Filas del CSV de Canva Bulk Create (sin encabezado) */
export type CanvaDiplomaRow = {
  diplomaId: string
  kind: 'unit' | 'streak' | 'lessons'
  hebrewTitle: string
  title: string
  subtitle: string
  detail: string
  brand: string
  placeholderName: string
  imageHint: string
}

export const canvaDiplomaCatalog: CanvaDiplomaRow[] = [
  {
    diplomaId: 'unit-alefato',
    kind: 'unit',
    hebrewTitle: 'כָּל הַכָּבוֹד',
    title: 'Unidad completada',
    subtitle: 'Unidad 1 · El alefato',
    detail: 'Completó todas las lecciones del alefato',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-unit',
  },
  {
    diplomaId: 'unit-palabras',
    kind: 'unit',
    hebrewTitle: 'כָּל הַכָּבוֹד',
    title: 'Unidad completada',
    subtitle: 'Unidad 2 · Primeras palabras',
    detail: 'Completó el léxico inicial',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-unit',
  },
  {
    diplomaId: 'unit-gramatica',
    kind: 'unit',
    hebrewTitle: 'כָּל הַכָּבוֹד',
    title: 'Unidad completada',
    subtitle: 'Unidad 3 · Gramática',
    detail: 'Completó la gramática básica',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-unit',
  },
  {
    diplomaId: 'unit-frases',
    kind: 'unit',
    hebrewTitle: 'כָּל הַכָּבוֹד',
    title: 'Unidad completada',
    subtitle: 'Unidad 4 · Frases útiles',
    detail: 'Completó frases de la calle y el café',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-unit',
  },
  {
    diplomaId: 'unit-sionismo',
    kind: 'unit',
    hebrewTitle: 'כָּל הַכָּבוֹד',
    title: 'Unidad completada',
    subtitle: 'Unidad 5 · Sionismo',
    detail: 'Completó el léxico sionista',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-unit',
  },
  {
    diplomaId: 'unit-calendario',
    kind: 'unit',
    hebrewTitle: 'כָּל הַכָּבוֹד',
    title: 'Unidad completada',
    subtitle: 'Unidad 6 · Calendario sionista',
    detail: 'Completó el calendario nacional',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-unit',
  },
  {
    diplomaId: 'streak-3',
    kind: 'streak',
    hebrewTitle: 'יָפֶה מְאֹד',
    title: 'Racha de 3 días',
    subtitle: 'Estudio constante',
    detail: '3 días seguidos de práctica',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-streak',
  },
  {
    diplomaId: 'streak-7',
    kind: 'streak',
    hebrewTitle: 'יָפֶה מְאֹד',
    title: 'Racha de 7 días',
    subtitle: 'Estudio constante',
    detail: 'Una semana de racha',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-streak',
  },
  {
    diplomaId: 'streak-14',
    kind: 'streak',
    hebrewTitle: 'יָפֶה מְאֹד',
    title: 'Racha de 14 días',
    subtitle: 'Estudio constante',
    detail: 'Dos semanas de racha',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-streak',
  },
  {
    diplomaId: 'streak-30',
    kind: 'streak',
    hebrewTitle: 'יָפֶה מְאֹד',
    title: 'Racha de 30 días',
    subtitle: 'Estudio constante',
    detail: 'Un mes de racha',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-streak',
  },
  {
    diplomaId: 'lessons-5',
    kind: 'lessons',
    hebrewTitle: 'כָּל הַבְּרָכוֹת',
    title: '5 lecciones',
    subtitle: 'Camino del Ulpan',
    detail: 'Primeras 5 lecciones completadas',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-lessons',
  },
  {
    diplomaId: 'lessons-10',
    kind: 'lessons',
    hebrewTitle: 'כָּל הַבְּרָכוֹת',
    title: '10 lecciones',
    subtitle: 'Camino del Ulpan',
    detail: '10 lecciones completadas',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-lessons',
  },
  {
    diplomaId: 'lessons-20',
    kind: 'lessons',
    hebrewTitle: 'כָּל הַבְּרָכוֹת',
    title: '20 lecciones',
    subtitle: 'Camino del Ulpan',
    detail: '20 lecciones completadas',
    brand: 'Ulpan con la Mora Maggie',
    placeholderName: '[Nombre del talmid]',
    imageHint: 'diploma-lessons',
  },
]
