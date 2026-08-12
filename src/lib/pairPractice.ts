import { phrases } from '../data/phrases'
import { vocabulary } from '../data/vocabulary'

export type PairPrompt = {
  id: string
  situation: string
  a: { hebrew: string; translit: string; spanish: string; tip: string }
  b: { hebrew: string; translit: string; spanish: string; tip: string }
}

const curated: PairPrompt[] = [
  {
    id: 'pair-shalom',
    situation: 'Encontrarse',
    a: {
      hebrew: 'שָׁלוֹם! מַה שְׁלוֹמְךָ?',
      translit: 'shalom! ma shlomjá?',
      spanish: '¡Hola! ¿Cómo estás? (a un hombre)',
      tip: 'Persona A saluda y pregunta',
    },
    b: {
      hebrew: 'שָׁלוֹם! אֲנִי בְּסֵדֶר, תּוֹדָה. וְאַתָּה?',
      translit: 'shalom! aní beséder, todá. ve-atá?',
      spanish: '¡Hola! Estoy bien, gracias. ¿Y tú?',
      tip: 'Persona B responde y devuelve la pregunta',
    },
  },
  {
    id: 'pair-name',
    situation: 'Presentaciones',
    a: {
      hebrew: 'שָׁלוֹם, קוֹרְאִים לִי…',
      translit: 'shalom, korím li…',
      spanish: 'Hola, me llamo…',
      tip: 'Decí tu nombre al final',
    },
    b: {
      hebrew: 'נָעִים מְאֹד! אֲנִי…',
      translit: 'naím meód! aní…',
      spanish: '¡Mucho gusto! Yo soy…',
      tip: 'Respondé con tu nombre',
    },
  },
  {
    id: 'pair-cafe',
    situation: 'Café',
    a: {
      hebrew: 'קָפֶה, בְּבַקָּשָׁה',
      translit: 'kafé, bevakashá',
      spanish: 'Un café, por favor',
      tip: 'Persona A pide',
    },
    b: {
      hebrew: 'בְּבַקָּשָׁה. עוֹד מַשֶּׁהוּ?',
      translit: 'bevakashá. od máshehu?',
      spanish: 'De nada / aquí tiene. ¿Algo más?',
      tip: 'Persona B atiende',
    },
  },
  {
    id: 'pair-where',
    situation: 'Direcciones',
    a: {
      hebrew: 'אֵיפֹה הָאוּלְפָּן?',
      translit: 'éifo ha-ulpán?',
      spanish: '¿Dónde está el ulpan?',
      tip: 'Preguntá el lugar',
    },
    b: {
      hebrew: 'שָׁם, יָמִינָה',
      translit: 'sham, yamína',
      spanish: 'Allí, a la derecha',
      tip: 'Indicá con un gesto',
    },
  },
  {
    id: 'pair-slow',
    situation: 'En clase',
    a: {
      hebrew: 'יוֹתֵר לְאַט, בְּבַקָּשָׁה',
      translit: 'yotér leát, bevakashá',
      spanish: 'Más despacio, por favor',
      tip: 'Pedí que hablen más lento',
    },
    b: {
      hebrew: 'בְּסֵדֶר. עוֹד פַּעַם…',
      translit: 'beséder. od páam…',
      spanish: 'De acuerdo. Otra vez…',
      tip: 'Repetí más despacio',
    },
  },
]

function fromData(): PairPrompt[] {
  const greet = phrases.filter((p) => p.situation === 'Saludos' || p.situation === 'Presentaciones')
  const extra: PairPrompt[] = []
  for (let i = 0; i + 1 < Math.min(greet.length, 8); i += 2) {
    const a = greet[i]!
    const b = greet[i + 1]!
    extra.push({
      id: `pair-auto-${a.id}`,
      situation: a.situation,
      a: {
        hebrew: a.hebrew,
        translit: a.translit,
        spanish: a.spanish,
        tip: 'Turno A — leé en voz alta',
      },
      b: {
        hebrew: b.hebrew,
        translit: b.translit,
        spanish: b.spanish,
        tip: 'Turno B — respondé',
      },
    })
  }
  // Vocab quick cue pairs
  const v0 = vocabulary[0]
  const v1 = vocabulary[1]
  if (v0 && v1) {
    extra.push({
      id: 'pair-vocab-ask',
      situation: 'Vocabulario',
      a: {
        hebrew: `מַה זֶה?`,
        translit: 'ma ze?',
        spanish: `¿Qué es esto? (señalá: ${v0.spanish})`,
        tip: `La respuesta esperada: ${v0.hebrew}`,
      },
      b: {
        hebrew: `זֶה ${v0.hebrew}`,
        translit: `ze ${v0.translit}`,
        spanish: `Esto es ${v0.spanish}`,
        tip: 'Respondé con la palabra',
      },
    })
  }
  return extra
}

export function pairPrompts(): PairPrompt[] {
  return [...curated, ...fromData()]
}
