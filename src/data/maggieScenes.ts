/** Escenas ilustradas de la Mora Maggie para la plataforma */

export type MaggieScene = {
  id: string
  title: string
  blurb: string
  /** Ruta bajo public/, sin slash inicial ni extensión */
  src: string
  to: string
}

export const maggieHero = {
  webp: 'images/maggie/maggie-hero-aula.webp',
  jpg: 'images/maggie/maggie-hero-aula.jpg',
  alt: 'La Mora Maggie enseñando hebreo en el aula',
}

export const maggieScenes: MaggieScene[] = [
  {
    id: 'pizarron',
    title: 'Alefato en el pizarrón',
    blurb: 'א ב ג — las letras cobran vida',
    src: 'images/maggie/maggie-pizarron-hebreo',
    to: '/alefato',
  },
  {
    id: 'cartas',
    title: 'Cartas del alefato',
    blurb: 'Practicá reconocimiento y sonido',
    src: 'images/maggie/maggie-alefato-cartas',
    to: '/alefato',
  },
  {
    id: 'gramatica',
    title: 'Gramática con sonrisa',
    blurb: 'Género, artículo y presente',
    src: 'images/maggie/maggie-gramatica',
    to: '/gramatica',
  },
  {
    id: 'cafe',
    title: 'Frases en el café',
    blurb: 'Hebreo útil para la calle',
    src: 'images/maggie/maggie-cafe-frases',
    to: '/frases',
  },
  {
    id: 'shuk',
    title: 'Vocabulario en el shuk',
    blurb: 'Mercado, comida y compras',
    src: 'images/maggie/maggie-shuk-vocabulario',
    to: '/vocabulario',
  },
  {
    id: 'srs',
    title: 'Práctica SRS',
    blurb: 'Repetición espaciada divertida',
    src: 'images/maggie/maggie-practica-srs',
    to: '/practica',
  },
  {
    id: 'quiz',
    title: 'Quiz con alegría',
    blurb: 'Opción múltiple del alefato',
    src: 'images/maggie/maggie-quiz-alegria',
    to: '/quiz',
  },
  {
    id: 'tareas',
    title: 'Visto bueno',
    blurb: 'La mora revisa tus tareas',
    src: 'images/maggie/maggie-tareas-visto-bueno',
    to: '/tareas',
  },
  {
    id: 'progreso',
    title: 'Racha y progreso',
    blurb: 'XP, días seguidos y metas',
    src: 'images/maggie/maggie-progreso-racha',
    to: '/progreso',
  },
  {
    id: 'perfiles',
    title: 'Bienvenida a clase',
    blurb: 'Morim y talmidim juntos',
    src: 'images/maggie/maggie-perfiles-bienvenida',
    to: '/perfiles',
  },
  {
    id: 'leccion',
    title: 'Lección guiada',
    blurb: 'Estudiar paso a paso al aire libre',
    src: 'images/maggie/maggie-leccion-guiada',
    to: '/lecciones',
  },
  {
    id: 'calendario',
    title: 'Calendario sionista',
    blurb: 'Shoá, Zikarón y Atzmaút',
    src: 'images/maggie/maggie-calendario-sionista',
    to: '/sionismo',
  },
  {
    id: 'paseo',
    title: 'Paseo por Israel',
    blurb: 'Jerusalén y olivos',
    src: 'images/maggie/maggie-paseo-israel',
    to: '/sionismo',
  },
  {
    id: 'aventura',
    title: 'Aventura en el desierto',
    blurb: 'Shalom desde el sur',
    src: 'images/maggie/maggie-israel-aventura',
    to: '/lecciones',
  },
  {
    id: 'aire',
    title: 'Clase al aire libre',
    blurb: 'Practicar hablando juntos',
    src: 'images/maggie/maggie-clase-aire-libre',
    to: '/lecciones',
  },
]

export function maggieSceneById(id: string): MaggieScene | undefined {
  return maggieScenes.find((s) => s.id === id)
}

export function maggieSceneByPath(path: string): MaggieScene | undefined {
  return maggieScenes.find((s) => s.to === path)
}
