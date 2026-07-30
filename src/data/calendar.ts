/** Días del calendario nacional / sionista-israelí (léxico cultural) */

export type CalendarDay = {
  id: string
  hebrew: string
  translit: string
  spanish: string
  hebrewMonth: string
  orderInYear: number
  note: string
  tone: 'memorial' | 'celebration' | 'culture'
}

/**
 * Ciclo primaveral clásico del calendario sionista-israelí:
 * Shoá → Zikaron → Atzmaut, y luego Yerushaláyim.
 * Fechas según el calendario hebreo (pueden moverse en el gregoriano).
 */
export const zionistCalendarDays: CalendarDay[] = [
  {
    id: 'cal-tu-bishvat',
    hebrew: 'ט״וּ בִּשְׁבָט',
    translit: 'Tu bi-Shvat',
    spanish: 'Tu BiShvat (Año Nuevo de los árboles)',
    hebrewMonth: '15 de Shvat',
    orderInYear: 1,
    tone: 'culture',
    note: 'Fiesta de los árboles. En la cultura sionista se asocia a plantaciones (KKL) y vínculo con la tierra.',
  },
  {
    id: 'cal-yom-hashoah',
    hebrew: 'יוֹם הַשּׁוֹאָה',
    translit: 'Yom ha-Shoá',
    spanish: 'Día de la Shoá (Holocausto)',
    hebrewMonth: '27 de Nisán',
    orderInYear: 2,
    tone: 'memorial',
    note: 'Día oficial de memoria de la Shoá y del heroísmo. Nombre completo: יוֹם הַזִּכָּרוֹן לַשּׁוֹאָה וְלַגְּבוּרָה.',
  },
  {
    id: 'cal-yom-hazikaron',
    hebrew: 'יוֹם הַזִּכָּרוֹן',
    translit: 'Yom ha-Zikarón',
    spanish: 'Día del Recuerdo',
    hebrewMonth: '4 de Iyar',
    orderInYear: 3,
    tone: 'memorial',
    note: 'Memoria de caídos de las FDI y víctimas del terrorismo. Suele celebrarse el día anterior a la Independencia.',
  },
  {
    id: 'cal-yom-haatzmaut',
    hebrew: 'יוֹם הָעַצְמָאוּת',
    translit: 'Yom ha-Atzmaút',
    spanish: 'Día de la Independencia',
    hebrewMonth: '5 de Iyar',
    orderInYear: 4,
    tone: 'celebration',
    note: 'Aniversario de la declaración del Estado de Israel (1948). Pasa de duelo a celebración en pocas horas.',
  },
  {
    id: 'cal-yom-herzl',
    hebrew: 'יוֹם הֶרְצְל',
    translit: 'Yom Hertzl',
    spanish: 'Día de Herzl',
    hebrewMonth: '10 de Iyar',
    orderInYear: 5,
    tone: 'culture',
    note: 'Conmemora a Theodor Herzl, figura central del sionismo político moderno.',
  },
  {
    id: 'cal-yom-yerushalayim',
    hebrew: 'יוֹם יְרוּשָׁלַיִם',
    translit: 'Yom Yerushaláyim',
    spanish: 'Día de Jerusalén',
    hebrewMonth: '28 de Iyar',
    orderInYear: 6,
    tone: 'celebration',
    note: 'Conmemora la reunificación de Jerusalén en 1967 (Guerra de los Seis Días).',
  },
  {
    id: 'cal-yom-haalia',
    hebrew: 'יוֹם הָעֲלִיָּה',
    translit: 'Yom ha-Aliá',
    spanish: 'Día de la Aliá',
    hebrewMonth: '7 de Jeshván',
    orderInYear: 7,
    tone: 'culture',
    note: 'Fiesta nacional que celebra la inmigración a Israel y el aporte de los olím.',
  },
]

/** Léxico de apoyo para hablar del calendario sionista */
export const calendarSupportTerms = [
  {
    id: 'cal-luaj',
    hebrew: 'לוּחַ שָׁנָה עִבְרִי',
    translit: 'lúaj shaná ivrí',
    spanish: 'calendario hebreo',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Las fechas nacionales israelíes se fijan sobre todo según el calendario hebreo.',
  },
  {
    id: 'cal-zikaron',
    hebrew: 'זִכָּרוֹן',
    translit: 'zikarón',
    spanish: 'recuerdo / memoria',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Raíz de יוֹם הַזִּכָּרוֹן. La memoria colectiva estructura el calendario nacional.',
  },
  {
    id: 'cal-shoa',
    hebrew: 'שׁוֹאָה',
    translit: 'Shoá',
    spanish: 'Shoá (Holocausto)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Término hebreo para el genocidio de los judíos europeos en la Segunda Guerra Mundial.',
  },
  {
    id: 'cal-gvura',
    hebrew: 'גְּבוּרָה',
    translit: 'guevurá',
    spanish: 'heroísmo / valentía',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Aparece en el nombre completo del Día de la Shoá: memoria de la Shoá y del heroísmo.',
  },
  {
    id: 'cal-tzfira',
    hebrew: 'צְפִירָה',
    translit: 'tzfirá',
    spanish: 'sirena (de silencio)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'En Yom HaShoá y Yom HaZikarón suena una sirena; el país se detiene en silencio.',
  },
  {
    id: 'cal-degel-hatzi',
    hebrew: 'דֶּגֶל בַּחֲצִי הַתֹּרֶן',
    translit: 'déguel ba-jatzí ha-tóren',
    spanish: 'bandera a media asta',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Se usa en días de duelo nacional. “Jatzí” = mitad; “tóren” = mástil.',
  },
  {
    id: 'cal-netia',
    hebrew: 'נְטִיעָה',
    translit: 'netiá',
    spanish: 'plantación (de árboles)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Costumbre típica de Tu BiShvat y de la cultura de la Kéren Kayémet.',
  },
  {
    id: 'cal-hagiga',
    hebrew: 'חֲגִיגָה',
    translit: 'jagigá',
    spanish: 'celebración / fiesta',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'En Yom HaAtzmaút hay jagigot: picnic, banderas, fuegos artificiales.',
  },
  {
    id: 'cal-nisan',
    hebrew: 'נִיסָן',
    translit: 'Nisán',
    spanish: 'Nisán (mes hebreo)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Mes de Pésaj y de Yom HaShoá (27 de Nisán).',
  },
  {
    id: 'cal-iyar',
    hebrew: 'אִיָּר',
    translit: 'Iyar',
    spanish: 'Iyar (mes hebreo)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Mes denso del calendario sionista: Zikarón, Atzmaút, Herzl y Yerushaláyim.',
  },
  {
    id: 'cal-jesvan',
    hebrew: 'חֶשְׁוָן',
    translit: 'Jeshván',
    spanish: 'Jeshván (mes hebreo)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'En Jeshván cae Yom HaAliá (7 de Jeshván).',
  },
  {
    id: 'cal-shvat',
    hebrew: 'שְׁבָט',
    translit: 'Shvat',
    spanish: 'Shvat (mes hebreo)',
    tags: ['sionismo', 'calendario'],
    group: 'calendario' as const,
    note: 'Mes de Tu BiShvat, el “año nuevo de los árboles”.',
  },
]

export const springArc = [
  { id: 'cal-yom-hashoah', label: 'Shoá', he: 'שואה' },
  { id: 'cal-yom-hazikaron', label: 'Zikarón', he: 'זיכרון' },
  { id: 'cal-yom-haatzmaut', label: 'Atzmaút', he: 'עצמאות' },
  { id: 'cal-yom-yerushalayim', label: 'Yerushaláyim', he: 'ירושלים' },
] as const
