export type VocabItem = {
  id: string
  hebrew: string
  translit: string
  spanish: string
  tags: string[]
}

export const vocabulary: VocabItem[] = [
  // Saludos
  { id: 'shalom', hebrew: 'שָׁלוֹם', translit: 'shalom', spanish: 'hola / paz', tags: ['saludos'] },
  { id: 'boker-tov', hebrew: 'בֹּקֶר טוֹב', translit: 'bóker tov', spanish: 'buenos días', tags: ['saludos'] },
  { id: 'erev-tov', hebrew: 'עֶרֶב טוֹב', translit: 'érev tov', spanish: 'buenas tardes/noches', tags: ['saludos'] },
  { id: 'layla-tov', hebrew: 'לַיְלָה טוֹב', translit: 'láila tov', spanish: 'buenas noches', tags: ['saludos'] },
  { id: 'toda', hebrew: 'תּוֹדָה', translit: 'todá', spanish: 'gracias', tags: ['saludos'] },
  { id: 'bevakasha', hebrew: 'בְּבַקָּשָׁה', translit: 'bevakashá', spanish: 'por favor / de nada', tags: ['saludos'] },
  { id: 'slicha', hebrew: 'סְלִיחָה', translit: 'slichá', spanish: 'perdón / disculpa', tags: ['saludos'] },
  { id: 'ken', hebrew: 'כֵּן', translit: 'ken', spanish: 'sí', tags: ['basico'] },
  { id: 'lo', hebrew: 'לֹא', translit: 'lo', spanish: 'no', tags: ['basico'] },
  { id: 'ma-nizhmat', hebrew: 'מַה נִּשְׁמָע', translit: 'ma nishmá', spanish: '¿qué tal?', tags: ['saludos'] },

  // Personas / pronombres
  { id: 'ani', hebrew: 'אֲנִי', translit: 'aní', spanish: 'yo', tags: ['pronombres'] },
  { id: 'ata', hebrew: 'אַתָּה', translit: 'atá', spanish: 'tú (m.)', tags: ['pronombres'] },
  { id: 'at', hebrew: 'אַתְּ', translit: 'at', spanish: 'tú (f.)', tags: ['pronombres'] },
  { id: 'hu', hebrew: 'הוּא', translit: 'hu', spanish: 'él', tags: ['pronombres'] },
  { id: 'hi', hebrew: 'הִיא', translit: 'hi', spanish: 'ella', tags: ['pronombres'] },
  { id: 'anachnu', hebrew: 'אֲנַחְנוּ', translit: 'anájnu', spanish: 'nosotros/as', tags: ['pronombres'] },
  { id: 'atem', hebrew: 'אַתֶּם', translit: 'atem', spanish: 'ustedes (m.)', tags: ['pronombres'] },
  { id: 'aten', hebrew: 'אַתֶּן', translit: 'aten', spanish: 'ustedes (f.)', tags: ['pronombres'] },
  { id: 'hem', hebrew: 'הֵם', translit: 'hem', spanish: 'ellos', tags: ['pronombres'] },
  { id: 'hen', hebrew: 'הֵן', translit: 'hen', spanish: 'ellas', tags: ['pronombres'] },

  // Números
  { id: 'achat', hebrew: 'אַחַת', translit: 'aját', spanish: 'uno (f.) / una', tags: ['numeros'] },
  { id: 'ehad', hebrew: 'אֶחָד', translit: 'ejád', spanish: 'uno (m.)', tags: ['numeros'] },
  { id: 'shtayim', hebrew: 'שְׁתַּיִם', translit: 'shtáyim', spanish: 'dos (f.)', tags: ['numeros'] },
  { id: 'shnayim', hebrew: 'שְׁנַיִם', translit: 'shnáyim', spanish: 'dos (m.)', tags: ['numeros'] },
  { id: 'shalosh', hebrew: 'שָׁלוֹשׁ', translit: 'shalósh', spanish: 'tres (f.)', tags: ['numeros'] },
  { id: 'arba', hebrew: 'אַרְבַּע', translit: 'arbá', spanish: 'cuatro (f.)', tags: ['numeros'] },
  { id: 'hamesh', hebrew: 'חָמֵשׁ', translit: 'jamésh', spanish: 'cinco (f.)', tags: ['numeros'] },
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
  { id: 'ach', hebrew: 'אָח', translit: 'aj', spanish: 'hermano', tags: ['familia'] },
  { id: 'achot', hebrew: 'אָחוֹת', translit: 'ajót', spanish: 'hermana', tags: ['familia'] },
  { id: 'haver', hebrew: 'חָבֵר', translit: 'javér', spanish: 'amigo', tags: ['personas'] },
  { id: 'haverá', hebrew: 'חֲבֵרָה', translit: 'javerá', spanish: 'amiga', tags: ['personas'] },

  // Cotidiano
  { id: 'bayit', hebrew: 'בַּיִת', translit: 'báyit', spanish: 'casa', tags: ['cotidiano'] },
  { id: 'sefer', hebrew: 'סֵפֶר', translit: 'séfer', spanish: 'libro', tags: ['cotidiano'] },
  { id: 'mayim', hebrew: 'מַיִם', translit: 'máyim', spanish: 'agua', tags: ['comida'] },
  { id: 'lechem', hebrew: 'לֶחֶם', translit: 'léjem', spanish: 'pan', tags: ['comida'] },
  { id: 'cafe', hebrew: 'קָפֶה', translit: 'kafé', spanish: 'café', tags: ['comida'] },
  { id: 'yom', hebrew: 'יוֹם', translit: 'yom', spanish: 'día', tags: ['tiempo'] },
  { id: 'layla', hebrew: 'לַיְלָה', translit: 'láila', spanish: 'noche', tags: ['tiempo'] },
  { id: 'shalom2', hebrew: 'שָׁלוֹם', translit: 'shalom', spanish: 'adiós (también)', tags: ['saludos'] },
  { id: 'tov', hebrew: 'טוֹב', translit: 'tov', spanish: 'bueno / bien', tags: ['basico'] },
  { id: 'ra', hebrew: 'רַע', translit: 'ra', spanish: 'malo / mal', tags: ['basico'] },
  { id: 'gadol', hebrew: 'גָּדוֹל', translit: 'gadól', spanish: 'grande', tags: ['adjetivos'] },
  { id: 'katan', hebrew: 'קָטָן', translit: 'katán', spanish: 'pequeño', tags: ['adjetivos'] },
  { id: 'chadash', hebrew: 'חָדָשׁ', translit: 'jadásh', spanish: 'nuevo', tags: ['adjetivos'] },
  { id: 'yashan', hebrew: 'יָשָׁן', translit: 'yashán', spanish: 'viejo', tags: ['adjetivos'] },
]

export function vocabByTag(tag: string): VocabItem[] {
  return vocabulary.filter((v) => v.tags.includes(tag))
}

export function getVocab(id: string): VocabItem | undefined {
  return vocabulary.find((v) => v.id === id)
}
