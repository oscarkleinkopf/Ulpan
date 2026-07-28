import { zionismTerms } from './zionism'

export type VocabItem = {
  id: string
  hebrew: string
  translit: string
  spanish: string
  tags: string[]
}

const coreVocabulary: VocabItem[] = [
  // Saludos
  { id: 'shalom', hebrew: 'שָׁלוֹם', translit: 'shalom', spanish: 'hola / paz', tags: ['saludos'] },
  { id: 'boker-tov', hebrew: 'בֹּקֶר טוֹב', translit: 'bóker tov', spanish: 'buenos días', tags: ['saludos'] },
  { id: 'erev-tov', hebrew: 'עֶרֶב טוֹב', translit: 'érev tov', spanish: 'buenas tardes/noches', tags: ['saludos'] },
  { id: 'layla-tov', hebrew: 'לַיְלָה טוֹב', translit: 'láila tov', spanish: 'buenas noches', tags: ['saludos'] },
  { id: 'toda', hebrew: 'תּוֹדָה', translit: 'todá', spanish: 'gracias', tags: ['saludos'] },
  { id: 'bevakasha', hebrew: 'בְּבַקָּשָׁה', translit: 'bevakashá', spanish: 'por favor / de nada', tags: ['saludos'] },
  { id: 'slija', hebrew: 'סְלִיחָה', translit: 'slijá', spanish: 'perdón / disculpa', tags: ['saludos'] },
  { id: 'ken', hebrew: 'כֵּן', translit: 'ken', spanish: 'sí', tags: ['basico'] },
  { id: 'lo', hebrew: 'לֹא', translit: 'lo', spanish: 'no', tags: ['basico'] },
  { id: 'ma-nizhmat', hebrew: 'מַה נִּשְׁמָע', translit: 'ma nishmá', spanish: '¿qué tal?', tags: ['saludos'] },

  // Personas / pronombres
  { id: 'ani', hebrew: 'אֲנִי', translit: 'aní', spanish: 'yo', tags: ['pronombres'] },
  { id: 'ata', hebrew: 'אַתָּה', translit: 'atá', spanish: 'tú (m.)', tags: ['pronombres'] },
  { id: 'at', hebrew: 'אַתְּ', translit: 'at', spanish: 'tú (f.)', tags: ['pronombres'] },
  { id: 'hu', hebrew: 'הוּא', translit: 'hu', spanish: 'él', tags: ['pronombres'] },
  { id: 'hi', hebrew: 'הִיא', translit: 'hi', spanish: 'ella', tags: ['pronombres'] },
  { id: 'anajnu', hebrew: 'אֲנַחְנוּ', translit: 'anájnu', spanish: 'nosotros/as', tags: ['pronombres'] },
  { id: 'atem', hebrew: 'אַתֶּם', translit: 'atem', spanish: 'ustedes (m.)', tags: ['pronombres'] },
  { id: 'aten', hebrew: 'אַתֶּן', translit: 'aten', spanish: 'ustedes (f.)', tags: ['pronombres'] },
  { id: 'hem', hebrew: 'הֵם', translit: 'hem', spanish: 'ellos', tags: ['pronombres'] },
  { id: 'hen', hebrew: 'הֵן', translit: 'hen', spanish: 'ellas', tags: ['pronombres'] },

  // Números
  { id: 'ajat', hebrew: 'אַחַת', translit: 'aját', spanish: 'uno (f.) / una', tags: ['numeros'] },
  { id: 'ehad', hebrew: 'אֶחָד', translit: 'ejád', spanish: 'uno (m.)', tags: ['numeros'] },
  { id: 'shtayim', hebrew: 'שְׁתַּיִם', translit: 'shtáyim', spanish: 'dos (f.)', tags: ['numeros'] },
  { id: 'shnayim', hebrew: 'שְׁנַיִם', translit: 'shnáyim', spanish: 'dos (m.)', tags: ['numeros'] },
  { id: 'shalosh', hebrew: 'שָׁלוֹשׁ', translit: 'shalósh', spanish: 'tres (f.)', tags: ['numeros'] },
  { id: 'arba', hebrew: 'אַרְבַּע', translit: 'arbá', spanish: 'cuatro (f.)', tags: ['numeros'] },
  { id: 'jamesh', hebrew: 'חָמֵשׁ', translit: 'jamésh', spanish: 'cinco (f.)', tags: ['numeros'] },
  { id: 'shesh', hebrew: 'שֵׁשׁ', translit: 'shesh', spanish: 'seis (f.)', tags: ['numeros'] },
  { id: 'sheva', hebrew: 'שֶׁבַע', translit: 'shéva', spanish: 'siete (f.)', tags: ['numeros'] },
  { id: 'shmone', hebrew: 'שְׁמוֹנֶה', translit: 'shmoné', spanish: 'ocho (f.)', tags: ['numeros'] },
  { id: 'tesha', hebrew: 'תֵּשַׁע', translit: 'tésha', spanish: 'nueve (f.)', tags: ['numeros'] },
  { id: 'eser', hebrew: 'עֶשֶׂר', translit: 'éser', spanish: 'diez (f.)', tags: ['numeros'] },

  // Familia y personas
  { id: 'ish', hebrew: 'אִישׁ', translit: 'ish', spanish: 'hombre', tags: ['personas'] },
  { id: 'isha', hebrew: 'אִשָּׁה', translit: 'ishá', spanish: 'mujer', tags: ['personas'] },
  { id: 'yeled', hebrew: 'יֶלֶד', translit: 'yéled', spanish: 'niño', tags: ['personas'] },
  { id: 'yalda', hebrew: 'יַלְדָּה', translit: 'yaldá', spanish: 'niña', tags: ['personas'] },
  { id: 'aba', hebrew: 'אַבָּא', translit: 'ába', spanish: 'papá', tags: ['familia'] },
  { id: 'ima', hebrew: 'אִמָּא', translit: 'íma', spanish: 'mamá', tags: ['familia'] },
  { id: 'aj', hebrew: 'אָח', translit: 'aj', spanish: 'hermano', tags: ['familia'] },
  { id: 'ajot', hebrew: 'אָחוֹת', translit: 'ajót', spanish: 'hermana', tags: ['familia'] },
  { id: 'haver', hebrew: 'חָבֵר', translit: 'javér', spanish: 'amigo', tags: ['personas'] },
  { id: 'haverá', hebrew: 'חֲבֵרָה', translit: 'javerá', spanish: 'amiga', tags: ['personas'] },

  // Cotidiano
  { id: 'bayit', hebrew: 'בַּיִת', translit: 'báyit', spanish: 'casa', tags: ['cotidiano'] },
  { id: 'sefer', hebrew: 'סֵפֶר', translit: 'séfer', spanish: 'libro', tags: ['cotidiano'] },
  { id: 'mayim', hebrew: 'מַיִם', translit: 'máyim', spanish: 'agua', tags: ['comida'] },
  { id: 'lejem', hebrew: 'לֶחֶם', translit: 'léjem', spanish: 'pan', tags: ['comida'] },
  { id: 'cafe', hebrew: 'קָפֶה', translit: 'kafé', spanish: 'café', tags: ['comida'] },
  { id: 'yom', hebrew: 'יוֹם', translit: 'yom', spanish: 'día', tags: ['tiempo'] },
  { id: 'layla', hebrew: 'לַיְלָה', translit: 'láila', spanish: 'noche', tags: ['tiempo'] },
  { id: 'shalom2', hebrew: 'שָׁלוֹם', translit: 'shalom', spanish: 'adiós (también)', tags: ['saludos'] },
  { id: 'tov', hebrew: 'טוֹב', translit: 'tov', spanish: 'bueno / bien', tags: ['basico'] },
  { id: 'ra', hebrew: 'רַע', translit: 'ra', spanish: 'malo / mal', tags: ['basico'] },
  { id: 'gadol', hebrew: 'גָּדוֹל', translit: 'gadól', spanish: 'grande', tags: ['adjetivos'] },
  { id: 'katan', hebrew: 'קָטָן', translit: 'katán', spanish: 'pequeño', tags: ['adjetivos'] },
  { id: 'jadash', hebrew: 'חָדָשׁ', translit: 'jadásh', spanish: 'nuevo', tags: ['adjetivos'] },
  { id: 'yashan', hebrew: 'יָשָׁן', translit: 'yashán', spanish: 'viejo', tags: ['adjetivos'] },

  // Días
  { id: 'yom-rishon', hebrew: 'יוֹם רִאשׁוֹן', translit: 'yom rishón', spanish: 'domingo', tags: ['tiempo', 'dias'] },
  { id: 'yom-sheni', hebrew: 'יוֹם שֵׁנִי', translit: 'yom shení', spanish: 'lunes', tags: ['tiempo', 'dias'] },
  { id: 'yom-shlishi', hebrew: 'יוֹם שְׁלִישִׁי', translit: 'yom shlishí', spanish: 'martes', tags: ['tiempo', 'dias'] },
  { id: 'yom-revi', hebrew: 'יוֹם רְבִיעִי', translit: 'yom revií', spanish: 'miércoles', tags: ['tiempo', 'dias'] },
  { id: 'yom-hamishi', hebrew: 'יוֹם חֲמִישִׁי', translit: 'yom jamishí', spanish: 'jueves', tags: ['tiempo', 'dias'] },
  { id: 'yom-shishi', hebrew: 'יוֹם שִׁשִּׁי', translit: 'yom shishí', spanish: 'viernes', tags: ['tiempo', 'dias'] },
  { id: 'shabat', hebrew: 'שַׁבָּת', translit: 'shabát', spanish: 'sábado / Shabat', tags: ['tiempo', 'dias'] },
  { id: 'shavua', hebrew: 'שָׁבוּעַ', translit: 'shavúa', spanish: 'semana', tags: ['tiempo'] },
  { id: 'jodesh', hebrew: 'חֹדֶשׁ', translit: 'jódesh', spanish: 'mes', tags: ['tiempo'] },
  { id: 'shana', hebrew: 'שָׁנָה', translit: 'shaná', spanish: 'año', tags: ['tiempo'] },

  // Colores
  { id: 'adom', hebrew: 'אָדֹם', translit: 'adóm', spanish: 'rojo', tags: ['colores'] },
  { id: 'kajol', hebrew: 'כָּחֹל', translit: 'kajól', spanish: 'azul', tags: ['colores'] },
  { id: 'yarok', hebrew: 'יָרֹק', translit: 'yarók', spanish: 'verde', tags: ['colores'] },
  { id: 'tzahov', hebrew: 'צָהֹב', translit: 'tzahóv', spanish: 'amarillo', tags: ['colores'] },
  { id: 'shajor', hebrew: 'שָׁחֹר', translit: 'shajór', spanish: 'negro', tags: ['colores'] },
  { id: 'lavan', hebrew: 'לָבָן', translit: 'laván', spanish: 'blanco', tags: ['colores'] },

  // Comida extra
  { id: 'jalav', hebrew: 'חָלָב', translit: 'jaláv', spanish: 'leche', tags: ['comida'] },
  { id: 'pri', hebrew: 'פְּרִי', translit: 'prí', spanish: 'fruta', tags: ['comida'] },
  { id: 'tapuaj', hebrew: 'תַּפּוּחַ', translit: 'tapúaj', spanish: 'manzana', tags: ['comida'] },
  { id: 'geviná', hebrew: 'גְּבִינָה', translit: 'gviná', spanish: 'queso', tags: ['comida'] },
  { id: 'salat', hebrew: 'סָלָט', translit: 'salát', spanish: 'ensalada', tags: ['comida'] },
  { id: 'ochel', hebrew: 'אֹכֶל', translit: 'ójel', spanish: 'comida', tags: ['comida'] },

  // Lugares
  { id: 'ir', hebrew: 'עִיר', translit: 'ir', spanish: 'ciudad', tags: ['lugares'] },
  { id: 'rehov', hebrew: 'רְחוֹב', translit: 'rejóv', spanish: 'calle', tags: ['lugares'] },
  { id: 'beit-sefer', hebrew: 'בֵּית סֵפֶר', translit: 'beit séfer', spanish: 'escuela', tags: ['lugares'] },
  { id: 'ulpan', hebrew: 'אוּלְפָּן', translit: 'ulpán', spanish: 'ulpan / escuela de hebreo', tags: ['lugares'] },
  { id: 'misada', hebrew: 'מִסְעָדָה', translit: 'misadá', spanish: 'restaurante', tags: ['lugares'] },
  { id: 'hanut', hebrew: 'חֲנוּת', translit: 'janút', spanish: 'tienda', tags: ['lugares'] },
  { id: 'israel', hebrew: 'יִשְׂרָאֵל', translit: 'Yisrael', spanish: 'Israel', tags: ['lugares'] },
  { id: 'yerushalayim', hebrew: 'יְרוּשָׁלַיִם', translit: 'Yerushaláyim', spanish: 'Jerusalén', tags: ['lugares'] },

  // Verbos / acciones (formas citadas)
  { id: 'lomed', hebrew: 'לוֹמֵד', translit: 'loméd', spanish: 'estudia / aprende (m.)', tags: ['verbos'] },
  { id: 'lomedet', hebrew: 'לוֹמֶדֶת', translit: 'lomédet', spanish: 'estudia / aprende (f.)', tags: ['verbos'] },
  { id: 'oteh', hebrew: 'אוֹכֵל', translit: 'ojél', spanish: 'come (m.)', tags: ['verbos'] },
  { id: 'otehet', hebrew: 'אוֹכֶלֶת', translit: 'ojélet', spanish: 'come (f.)', tags: ['verbos'] },
  { id: 'holej', hebrew: 'הוֹלֵךְ', translit: 'holéj', spanish: 'camina / va (m.)', tags: ['verbos'] },
  { id: 'holejet', hebrew: 'הוֹלֶכֶת', translit: 'holéjet', spanish: 'camina / va (f.)', tags: ['verbos'] },
  { id: 'rotzeh', hebrew: 'רוֹצֶה', translit: 'rotzé', spanish: 'quiere (m.)', tags: ['verbos'] },
  { id: 'rotzah', hebrew: 'רוֹצָה', translit: 'rotzá', spanish: 'quiere (f.)', tags: ['verbos'] },
  { id: 'yesh', hebrew: 'יֵשׁ', translit: 'yesh', spanish: 'hay / tengo', tags: ['basico'] },
  { id: 'ein', hebrew: 'אֵין', translit: 'ein', spanish: 'no hay / no tengo', tags: ['basico'] },
]

/** Léxico general + sección Sionismo */
export const vocabulary: VocabItem[] = [
  ...coreVocabulary,
  ...zionismTerms.map(({ id, hebrew, translit, spanish, tags }) => ({
    id,
    hebrew,
    translit,
    spanish,
    tags,
  })),
]

export const vocabTags = [
  'saludos',
  'basico',
  'pronombres',
  'numeros',
  'personas',
  'familia',
  'cotidiano',
  'comida',
  'tiempo',
  'dias',
  'adjetivos',
  'colores',
  'lugares',
  'verbos',
  'sionismo',
  'calendario',
] as const

export const tagLabels: Record<string, string> = {
  saludos: 'Saludos',
  basico: 'Básico',
  pronombres: 'Pronombres',
  numeros: 'Números',
  personas: 'Personas',
  familia: 'Familia',
  cotidiano: 'Cotidiano',
  comida: 'Comida',
  tiempo: 'Tiempo',
  dias: 'Días',
  adjetivos: 'Adjetivos',
  colores: 'Colores',
  lugares: 'Lugares',
  verbos: 'Verbos',
  sionismo: 'Sionismo',
  calendario: 'Calendario',
}

export function vocabByTag(tag: string): VocabItem[] {
  return vocabulary.filter((v) => v.tags.includes(tag))
}

export function getVocab(id: string): VocabItem | undefined {
  return vocabulary.find((v) => v.id === id)
}
