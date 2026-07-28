export type GrammarTopic = {
  id: string
  title: string
  summary: string
  points: string[]
  examples: { hebrew: string; translit: string; spanish: string }[]
}

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'direction',
    title: 'Dirección de lectura',
    summary: 'El hebreo se lee y escribe de derecha a izquierda.',
    points: [
      'Las páginas de un libro se abren al revés respecto al español.',
      'Los números suelen escribirse de izquierda a derecha.',
      'En la app, el texto hebreo siempre aparece alineado a la derecha.',
    ],
    examples: [
      { hebrew: 'שָׁלוֹם', translit: 'shalom', spanish: 'Se lee empezando por la ש (derecha).' },
    ],
  },
  {
    id: 'gender',
    title: 'Género: masculino y femenino',
    summary: 'Sustantivos, adjetivos y verbos distinguen género.',
    points: [
      'Muchos femeninos terminan en ה- o ת-.',
      'Los adjetivos concuerdan en género y número con el sustantivo.',
      'Los números también tienen formas masculinas y femeninas.',
    ],
    examples: [
      { hebrew: 'יֶלֶד טוֹב', translit: 'yéled tov', spanish: 'niño bueno' },
      { hebrew: 'יַלְדָּה טוֹבָה', translit: 'yaldá tová', spanish: 'niña buena' },
      { hebrew: 'סֵפֶר גָּדוֹל', translit: 'séfer gadól', spanish: 'libro grande' },
      { hebrew: 'עִיר גְּדוֹלָה', translit: 'ir gdolá', spanish: 'ciudad grande' },
    ],
  },
  {
    id: 'article',
    title: 'El artículo definido ה',
    summary: 'Se antepone ה־ al sustantivo: “el / la / los / las”.',
    points: [
      'No existe artículo indefinido (un/una); se omite.',
      'La ה se escribe pegada a la palabra: הַבַּיִת.',
      'A veces cambia la vocal según la primera letra (reglas avanzadas).',
    ],
    examples: [
      { hebrew: 'בַּיִת', translit: 'báyit', spanish: 'una casa / casa' },
      { hebrew: 'הַבַּיִת', translit: 'ha-báyit', spanish: 'la casa' },
      { hebrew: 'הַיֶּלֶד', translit: 'ha-yéled', spanish: 'el niño' },
    ],
  },
  {
    id: 'no-ser',
    title: 'No hay verbo “ser/estar” en presente',
    summary: 'En presente, “yo soy” se expresa sin verbo: אֲנִי…',
    points: [
      'אֲנִי תַּלְמִיד = yo (soy) estudiante.',
      'En pasado y futuro sí aparecen formas del verbo “ser”.',
      'Para “estar en” se usa בְּ־ (en).',
    ],
    examples: [
      { hebrew: 'אֲנִי מֹרֶה', translit: 'aní moré', spanish: 'yo soy profesor' },
      { hebrew: 'הִיא תַּלְמִידָה', translit: 'hi talmidá', spanish: 'ella es estudiante' },
      { hebrew: 'אֲנִי בַּבַּיִת', translit: 'aní ba-báyit', spanish: 'estoy en la casa' },
    ],
  },
  {
    id: 'pronouns',
    title: 'Pronombres personales',
    summary: 'Los pronombres cambian según género y número.',
    points: [
      'Tú masculino: אַתָּה · Tú femenino: אַתְּ',
      'Ellos: הֵם · Ellas: הֵן',
      'Se usan mucho al presentarse y en conjugaciones.',
    ],
    examples: [
      { hebrew: 'אֲנִי', translit: 'aní', spanish: 'yo' },
      { hebrew: 'אַתָּה / אַתְּ', translit: 'atá / at', spanish: 'tú m. / tú f.' },
      { hebrew: 'הוּא / הִיא', translit: 'hu / hi', spanish: 'él / ella' },
    ],
  },
  {
    id: 'present-paal',
    title: 'Presente básico (binyán Paal)',
    summary: 'Muchos verbos cotidianos siguen un patrón en presente.',
    points: [
      'Masculino singular suele terminar en -ֵ (p. ej. כּוֹתֵב).',
      'Femenino singular suele añadir ה- (כּוֹתֶבֶת).',
      'Plural masculino: -ִים · femenino: -וֹת.',
      'El sujeto (pronombre) suele ir delante.',
    ],
    examples: [
      { hebrew: 'אֲנִי כּוֹתֵב', translit: 'aní kotév', spanish: 'yo escribo (m.)' },
      { hebrew: 'אֲנִי כּוֹתֶבֶת', translit: 'aní kotévet', spanish: 'yo escribo (f.)' },
      { hebrew: 'הוּא קוֹרֵא', translit: 'hu koré', spanish: 'él lee' },
      { hebrew: 'הִיא קוֹרֵאת', translit: 'hi korét', spanish: 'ella lee' },
    ],
  },
]
