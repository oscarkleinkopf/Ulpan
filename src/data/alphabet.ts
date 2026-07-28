export type Letter = {
  id: string
  hebrew: string
  name: string
  translit: string
  sound: string
  final?: string
  note?: string
}

/** Alefato completo con formas sofit y notas para hispanohablantes */
export const alphabet: Letter[] = [
  { id: 'alef', hebrew: 'א', name: 'Álef', translit: "' / a", sound: 'Silenciosa o con vocal', note: 'No tiene sonido propio; actúa como soporte de vocales.' },
  { id: 'bet', hebrew: 'ב', name: 'Bet / Vet', translit: 'b / v', sound: 'b (con dagués) o v', note: 'בּ = b, ב = v.' },
  { id: 'gimel', hebrew: 'ג', name: 'Guímel', translit: 'g', sound: 'g como en gato' },
  { id: 'dalet', hebrew: 'ד', name: 'Dálet', translit: 'd', sound: 'd' },
  { id: 'he', hebrew: 'ה', name: 'He', translit: 'h', sound: 'h suave', note: 'Al final de palabra suele marcar vocal a.' },
  { id: 'vav', hebrew: 'ו', name: 'Vav', translit: 'v / o / u', sound: 'v, o, u', note: 'También forma las vocales o (וֹ) y u (וּ).' },
  { id: 'zayin', hebrew: 'ז', name: 'Záyin', translit: 'z', sound: 'z' },
  { id: 'het', hebrew: 'ח', name: 'Jet', translit: 'j', sound: 'j fuerte (como jota española)' },
  { id: 'tet', hebrew: 'ט', name: 'Tet', translit: 't', sound: 't' },
  { id: 'yod', hebrew: 'י', name: 'Yod', translit: 'y / i', sound: 'y o i', note: 'También marca la vocal i.' },
  { id: 'kaf', hebrew: 'כ', name: 'Kaf / Jaf', translit: 'k / j', sound: 'k o j', final: 'ך', note: 'כּ = k, כ = j. Forma final: ך.' },
  { id: 'lamed', hebrew: 'ל', name: 'Lámed', translit: 'l', sound: 'l' },
  { id: 'mem', hebrew: 'מ', name: 'Mem', translit: 'm', sound: 'm', final: 'ם' },
  { id: 'nun', hebrew: 'נ', name: 'Nun', translit: 'n', sound: 'n', final: 'ן' },
  { id: 'samekh', hebrew: 'ס', name: 'Sámej', translit: 's', sound: 's' },
  { id: 'ayin', hebrew: 'ע', name: 'Áyin', translit: "' / a", sound: 'Garganta suave / silenciosa', note: 'En hebreo moderno suele sonar como álef.' },
  { id: 'pe', hebrew: 'פ', name: 'Pe / Fe', translit: 'p / f', sound: 'p o f', final: 'ף', note: 'פּ = p, פ = f. Forma final: ף.' },
  { id: 'tsadi', hebrew: 'צ', name: 'Tsadi', translit: 'ts', sound: 'ts', final: 'ץ' },
  { id: 'qof', hebrew: 'ק', name: 'Qof', translit: 'k', sound: 'k' },
  { id: 'resh', hebrew: 'ר', name: 'Resh', translit: 'r', sound: 'r (uvular o alveolar)' },
  { id: 'shin', hebrew: 'ש', name: 'Shin / Sin', translit: 'sh / s', sound: 'sh o s', note: 'שׁ = sh, שׂ = s.' },
  { id: 'tav', hebrew: 'ת', name: 'Tav', translit: 't', sound: 't' },
]

export const vowelMarks = [
  { id: 'patah', mark: 'ַ', name: 'Pataj', sound: 'a (corta)', example: 'בַּ' },
  { id: 'kamatz', mark: 'ָ', name: 'Kamats', sound: 'a (o a abierta)', example: 'בָּ' },
  { id: 'hirik', mark: 'ִ', name: 'Jírik', sound: 'i', example: 'בִּ' },
  { id: 'tsere', mark: 'ֵ', name: 'Tseré', sound: 'e', example: 'בֵּ' },
  { id: 'segol', mark: 'ֶ', name: 'Ségol', sound: 'e (corta)', example: 'בֶּ' },
  { id: 'holam', mark: 'ֹ', name: 'Holam', sound: 'o', example: 'בֹּ' },
  { id: 'kubutz', mark: 'ֻ', name: 'Kubuts', sound: 'u', example: 'בֻּ' },
  { id: 'shuruk', mark: 'וּ', name: 'Shuruk', sound: 'u', example: 'בּוּ' },
  { id: 'shva', mark: 'ְ', name: 'Shvá', sound: 'silencio o e muy corta', example: 'בְּ' },
]
