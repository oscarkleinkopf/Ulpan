export type LessonStep =
  | { type: 'info'; title: string; body: string; hebrew?: string }
  | {
      type: 'listen'
      title: string
      body?: string
      hebrew: string
      translit?: string
      spanish?: string
      /** Si se omite, se usa lesson:{lessonId}:{stepIndex} */
      clipId?: string
    }
  | { type: 'letter'; letterId: string }
  | { type: 'vocab'; vocabIds: string[] }
  | { type: 'grammar'; topicId: string }
  | { type: 'phrase'; phraseIds: string[] }
  | {
      type: 'quiz'
      prompt: string
      promptHebrew?: string
      options: string[]
      answerIndex: number
      explain?: string
    }

export type Lesson = {
  id: string
  unit: string
  title: string
  subtitle: string
  estimatedMinutes: number
  steps: LessonStep[]
}

export const lessons: Lesson[] = [
  {
    id: 'u1-l1',
    unit: 'Unidad 1 · El alefato',
    title: 'Bienvenida al hebreo',
    subtitle: 'Cómo suena, se lee y se escribe',
    estimatedMinutes: 6,
    steps: [
      {
        type: 'info',
        title: '¡Shalom!',
        body: 'Ulpan con la Mora Maggie te acompaña desde cero. Empezamos por el alefato (א״ב), la base de todo lo demás. El hebreo se lee de derecha a izquierda.',
        hebrew: 'שָׁלוֹם',
      },
      {
        type: 'listen',
        title: 'Audio guiado · Shalom',
        body: 'Escuchá la pronunciación y repetí en voz alta. Si la Mora grabó su voz, la vas a oír a ella.',
        hebrew: 'שָׁלוֹם',
        translit: 'shalom',
        spanish: 'hola / paz',
        clipId: 'vocab:shalom',
      },
      {
        type: 'listen',
        title: 'Audio guiado · Todá',
        body: 'Otra palabra esencial: gracias.',
        hebrew: 'תּוֹדָה',
        translit: 'todá',
        spanish: 'gracias',
        clipId: 'vocab:toda',
      },
      {
        type: 'info',
        title: 'Dos sistemas de escritura',
        body: 'Verás letras con nikud (puntos vocálicos) al principio. En la calle, el hebreo moderno suele escribirse sin ellos: las aprendes primero con nikud y luego sin él.',
      },
      {
        type: 'quiz',
        prompt: '¿En qué dirección se lee el hebreo?',
        options: ['Izquierda a derecha', 'Derecha a izquierda', 'De arriba a abajo'],
        answerIndex: 1,
        explain: 'Se lee y escribe de derecha a izquierda.',
      },
    ],
  },
  {
    id: 'u1-l2',
    unit: 'Unidad 1 · El alefato',
    title: 'Letras 1–5',
    subtitle: 'Álef, Bet, Guímel, Dálet, He',
    estimatedMinutes: 8,
    steps: [
      { type: 'letter', letterId: 'alef' },
      { type: 'letter', letterId: 'bet' },
      { type: 'letter', letterId: 'gimel' },
      { type: 'letter', letterId: 'dalet' },
      { type: 'letter', letterId: 'he' },
      {
        type: 'quiz',
        prompt: '¿Qué letra es ב?',
        options: ['Álef', 'Bet / Vet', 'He'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: '¿Cuál suele ser silenciosa o soporte de vocal?',
        options: ['Guímel', 'Álef', 'Dálet'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u1-l3',
    unit: 'Unidad 1 · El alefato',
    title: 'Letras 6–11',
    subtitle: 'Vav hasta Kaf',
    estimatedMinutes: 8,
    steps: [
      { type: 'letter', letterId: 'vav' },
      { type: 'letter', letterId: 'zayin' },
      { type: 'letter', letterId: 'het' },
      { type: 'letter', letterId: 'tet' },
      { type: 'letter', letterId: 'yod' },
      { type: 'letter', letterId: 'kaf' },
      {
        type: 'quiz',
        prompt: 'ח (Jet) suena aproximadamente como…',
        options: ['La j española', 'La s', 'La m'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'La forma final de כ es…',
        options: ['ם', 'ך', 'ן'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u1-l4',
    unit: 'Unidad 1 · El alefato',
    title: 'Letras 12–17',
    subtitle: 'Lámed hasta Pe',
    estimatedMinutes: 8,
    steps: [
      { type: 'letter', letterId: 'lamed' },
      { type: 'letter', letterId: 'mem' },
      { type: 'letter', letterId: 'nun' },
      { type: 'letter', letterId: 'samekh' },
      { type: 'letter', letterId: 'ayin' },
      { type: 'letter', letterId: 'pe' },
      {
        type: 'quiz',
        prompt: 'מ al final de palabra se escribe…',
        options: ['ם', 'ן', 'ף'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u1-l5',
    unit: 'Unidad 1 · El alefato',
    title: 'Letras 18–22 y vocales',
    subtitle: 'Tsadi hasta Tav + nikud',
    estimatedMinutes: 10,
    steps: [
      { type: 'letter', letterId: 'tsadi' },
      { type: 'letter', letterId: 'qof' },
      { type: 'letter', letterId: 'resh' },
      { type: 'letter', letterId: 'shin' },
      { type: 'letter', letterId: 'tav' },
      {
        type: 'info',
        title: 'Las vocales (nikud)',
        body: 'Los puntos y rayitas debajo o encima de las letras indican a, e, i, o, u. Ejemplo: בַּ = ba, בִּ = bi, בּוּ = bu.',
        hebrew: 'בַּ · בִּ · בּוּ',
      },
      {
        type: 'quiz',
        prompt: 'שׁ suele sonar como…',
        options: ['sh', 'ts', 'r'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u2-l1',
    unit: 'Unidad 2 · Primeras palabras',
    title: 'Saludos esenciales',
    subtitle: 'Shalom, todá y más',
    estimatedMinutes: 7,
    steps: [
      {
        type: 'info',
        title: 'Empezar a hablar',
        body: 'Con pocas palabras ya puedes saludar y ser cortés. Practica en voz alta.',
      },
      { type: 'vocab', vocabIds: ['shalom', 'boker-tov', 'erev-tov', 'toda', 'bevakasha', 'slija', 'ken', 'lo', 'ma-nizhmat'] },
      {
        type: 'quiz',
        prompt: '¿Cómo se dice “gracias”?',
        promptHebrew: '?',
        options: ['שָׁלוֹם', 'תּוֹדָה', 'כֵּן'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'בְּבַקָּשָׁה significa…',
        options: ['Por favor / de nada', 'Adiós', 'Sí'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u2-l2',
    unit: 'Unidad 2 · Primeras palabras',
    title: 'Pronombres',
    subtitle: 'Yo, tú, él, ella…',
    estimatedMinutes: 7,
    steps: [
      { type: 'grammar', topicId: 'pronouns' },
      { type: 'vocab', vocabIds: ['ani', 'ata', 'at', 'hu', 'hi', 'anajnu'] },
      {
        type: 'quiz',
        prompt: 'אַתָּה es…',
        options: ['Yo', 'Tú (m.)', 'Ella'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: '¿Cómo se dice “ella”?',
        options: ['הוּא', 'הִיא', 'אַתְּ'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u2-l3',
    unit: 'Unidad 2 · Primeras palabras',
    title: 'Números 1–10',
    subtitle: 'Contar en hebreo',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'info',
        title: 'Género en los números',
        body: 'Al contar objetos, el número concuerda en género. Aquí aprendes sobre todo las formas femeninas (muy usadas al contar) y “uno/dos” en ambos géneros.',
      },
      {
        type: 'vocab',
        vocabIds: ['ehad', 'ajat', 'shnayim', 'shtayim', 'shalosh', 'arba', 'jamesh', 'shesh', 'sheva', 'shmone', 'tesha', 'eser'],
      },
      {
        type: 'quiz',
        prompt: 'שָׁלוֹשׁ es…',
        options: ['Dos', 'Tres', 'Cinco'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'עֶשֶׂר es…',
        options: ['Siete', 'Nueve', 'Diez'],
        answerIndex: 2,
      },
    ],
  },
  {
    id: 'u2-l4',
    unit: 'Unidad 2 · Primeras palabras',
    title: 'Familia y personas',
    subtitle: 'Casa, familia, amigos',
    estimatedMinutes: 7,
    steps: [
      { type: 'vocab', vocabIds: ['ish', 'isha', 'yeled', 'yalda', 'aba', 'ima', 'aj', 'ajot', 'haver', 'haverá', 'bayit'] },
      {
        type: 'quiz',
        prompt: 'אִמָּא significa…',
        options: ['Papá', 'Mamá', 'Hermana'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'בַּיִת es…',
        options: ['Libro', 'Casa', 'Agua'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u3-l1',
    unit: 'Unidad 3 · Gramática',
    title: 'Género y artículo ה',
    subtitle: 'Masculino, femenino y “el/la”',
    estimatedMinutes: 8,
    steps: [
      { type: 'grammar', topicId: 'gender' },
      { type: 'grammar', topicId: 'article' },
      {
        type: 'quiz',
        prompt: 'הַבַּיִת significa…',
        options: ['Una casa', 'La casa', 'Casas'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'En “יַלְדָּה טוֹבָה”, el adjetivo es…',
        options: ['Masculino', 'Femenino', 'Plural'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u3-l2',
    unit: 'Unidad 3 · Gramática',
    title: 'Sin verbo “ser” en presente',
    subtitle: 'Cómo decir quién eres',
    estimatedMinutes: 6,
    steps: [
      { type: 'grammar', topicId: 'no-ser' },
      { type: 'grammar', topicId: 'direction' },
      {
        type: 'quiz',
        prompt: '¿Cómo se dice “yo soy profesor” (m.)?',
        options: ['אֲנִי מֹרֶה', 'הוּא מֹרֶה', 'אַתָּה תַּלְמִיד'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u3-l3',
    unit: 'Unidad 3 · Gramática',
    title: 'Presente: escribir y leer',
    subtitle: 'Primer patrón verbal (Paal)',
    estimatedMinutes: 8,
    steps: [
      { type: 'grammar', topicId: 'present-paal' },
      {
        type: 'quiz',
        prompt: 'אֲנִי כּוֹתֶבֶת es…',
        options: ['Yo escribo (f.)', 'Él escribe', 'Ella lee'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'הִיא קוֹרֵאת significa…',
        options: ['Él lee', 'Ella lee', 'Nosotros leemos'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u4-l1',
    unit: 'Unidad 4 · Frases útiles',
    title: 'Presentarte',
    subtitle: 'Nombre, gusto en conocerte, aprendizaje',
    estimatedMinutes: 7,
    steps: [
      {
        type: 'phrase',
        phraseIds: ['intro-name-m', 'nice-meet', 'speak-hebrew', 'speak-hebrew-f', 'how-are-you-m', 'how-are-you-f', 'im-fine'],
      },
      {
        type: 'quiz',
        prompt: 'נָעִים מְאֹד significa…',
        options: ['Buenos días', 'Mucho gusto', 'Hasta luego'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u4-l2',
    unit: 'Unidad 4 · Frases útiles',
    title: 'En la calle y en el café',
    subtitle: 'Pedir, preguntar, entender',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'phrase',
        phraseIds: [
          'slow-please',
          'dont-understand',
          'dont-understand-f',
          'where-is',
          'how-much',
          'coffee-please',
          'water-please',
          'bill',
          'toilet',
          'goodbye',
        ],
      },
      {
        type: 'quiz',
        prompt: '¿Cómo pides la cuenta?',
        options: ['קָפֶה, בְּבַקָּשָׁה', 'אֶת הַחֶשְׁבּוֹן, בְּבַקָּשָׁה', 'לְהִתְרָאוֹת'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'לְהִתְרָאוֹת es…',
        options: ['Hasta luego', 'Perdón', '¿Dónde?'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u2-l5',
    unit: 'Unidad 2 · Primeras palabras',
    title: 'Días de la semana',
    subtitle: 'Del domingo al Shabat',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'info',
        title: 'La semana hebrea',
        body: 'La semana empieza el domingo (יוֹם רִאשׁוֹן, “día primero”) y culmina en שַׁבָּת. Es un ancla cultural y práctica.',
      },
      {
        type: 'vocab',
        vocabIds: [
          'yom-rishon',
          'yom-sheni',
          'yom-shlishi',
          'yom-revi',
          'yom-hamishi',
          'yom-shishi',
          'shabat',
          'shavua',
        ],
      },
      {
        type: 'quiz',
        prompt: 'שַׁבָּת es…',
        options: ['Viernes', 'Sábado / Shabat', 'Domingo'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'יוֹם שֵׁנִי corresponde a…',
        options: ['Lunes', 'Martes', 'Jueves'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u2-l6',
    unit: 'Unidad 2 · Primeras palabras',
    title: 'Colores y comida',
    subtitle: 'Describir y pedir lo básico',
    estimatedMinutes: 8,
    steps: [
      { type: 'vocab', vocabIds: ['adom', 'kajol', 'yarok', 'tzahov', 'shajor', 'lavan'] },
      { type: 'vocab', vocabIds: ['jalav', 'pri', 'tapuaj', 'geviná', 'salat', 'ochel', 'mayim', 'lejem'] },
      {
        type: 'quiz',
        prompt: 'כָּחֹל significa…',
        options: ['Rojo', 'Azul', 'Verde'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'תַּפּוּחַ es…',
        options: ['Queso', 'Manzana', 'Ensalada'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u3-l4',
    unit: 'Unidad 3 · Gramática',
    title: 'יֵשׁ y אֵין',
    subtitle: 'Hay / no hay, tengo / no tengo',
    estimatedMinutes: 7,
    steps: [
      { type: 'grammar', topicId: 'yesh-ein' },
      { type: 'vocab', vocabIds: ['yesh', 'ein', 'sefer', 'mayim', 'bayit'] },
      {
        type: 'quiz',
        prompt: 'יֵשׁ לִי סֵפֶר significa…',
        options: ['No tengo libro', 'Tengo un libro', 'El libro es grande'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'אֵין לִי מַיִם es…',
        options: ['Tengo agua', 'No tengo agua', 'Quiero agua'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u3-l5',
    unit: 'Unidad 3 · Gramática',
    title: 'Querer, ir y comer',
    subtitle: 'Verbos cotidianos en presente',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'info',
        title: 'Acción en presente',
        body: 'Recuerda: el verbo concuerda en género. Si te identificas en femenino, usa las formas con ת- / ה- típicas del femenino singular.',
      },
      { type: 'vocab', vocabIds: ['rotzeh', 'rotzah', 'holej', 'holejet', 'oteh', 'otehet', 'lomed', 'lomedet'] },
      {
        type: 'quiz',
        prompt: 'אֲנִי רוֹצָה קָפֶה es…',
        options: ['Quiero café (f.)', 'Camino a casa (m.)', 'Como pan (m.)'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'הוּא הוֹלֵךְ means…',
        options: ['Ella va', 'Él va / camina', 'Ellos comen'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u4-l3',
    unit: 'Unidad 4 · Frases útiles',
    title: 'En la ciudad',
    subtitle: 'Lugares, direcciones y planes',
    estimatedMinutes: 8,
    steps: [
      { type: 'vocab', vocabIds: ['ir', 'rehov', 'beit-sefer', 'ulpan', 'misada', 'hanut', 'israel', 'yerushalayim'] },
      {
        type: 'phrase',
        phraseIds: ['where-ulpan', 'i-live', 'want-coffee', 'see-you-tomorrow', 'good-luck'],
      },
      {
        type: 'quiz',
        prompt: 'אוּלְפָּן es…',
        options: ['Restaurante', 'Escuela de hebreo', 'Calle'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u5-l1',
    unit: 'Unidad 5 · Sionismo',
    title: 'Ideas centrales',
    subtitle: 'Sión, sionismo, aliá y pueblo',
    estimatedMinutes: 9,
    steps: [
      {
        type: 'info',
        title: 'Léxico con historia',
        body: 'Esta unidad presenta términos hebreos del sionismo y de la historia israelí moderna. Sirve para leer carteles, himnos, noticias y conversaciones culturales.',
        hebrew: 'צִיּוֹן',
      },
      {
        type: 'vocab',
        vocabIds: ['tzion', 'tzionut', 'tzioni', 'eretz-yisrael', 'am-yisrael', 'galut', 'gueula', 'bait-leumi'],
      },
      {
        type: 'quiz',
        prompt: 'צִיּוֹנוּת significa…',
        options: ['Independencia', 'Sionismo', 'Kibutz'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'אֶרֶץ יִשְׂרָאֵל es…',
        options: ['Tierra de Israel', 'Pueblo de Israel', 'Estado de Israel'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u5-l2',
    unit: 'Unidad 5 · Sionismo',
    title: 'Aliá y pioneros',
    subtitle: 'Ascender, inmigrar, construir',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'info',
        title: 'עֲלִיָּה',
        body: 'Aliá significa literalmente “ascenso”: inmigrar a Israel. Quien lo hace es עוֹלֶה / עוֹלָה. Los pioneros se llaman חֲלוּצִים.',
        hebrew: 'עֲלִיָּה',
      },
      { type: 'vocab', vocabIds: ['alia', 'ole', 'ola', 'jalutz', 'jalutza', 'shivat-tzion', 'yishuv'] },
      {
        type: 'quiz',
        prompt: 'עֲלִיָּה es…',
        options: ['Exilio', 'Inmigración a Israel', 'Parlamento'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'חָלוּץ significa…',
        options: ['Pionero', 'Himno', 'Bandera'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u5-l3',
    unit: 'Unidad 5 · Sionismo',
    title: 'Estado, símbolos e instituciones',
    subtitle: 'Independencia, Knéset, HaTikvá',
    estimatedMinutes: 9,
    steps: [
      {
        type: 'vocab',
        vocabIds: [
          'atzmaut',
          'medinat-yisrael',
          'kneset',
          'hatikva',
          'degel',
          'magen-david',
          'sojnut',
          'keren-kayemet',
          'heskem-balfour',
          'tzahal',
        ],
      },
      {
        type: 'quiz',
        prompt: 'הַתִּקְוָה es…',
        options: ['El himno nacional', 'El parlamento', 'Un kibutz'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'כְּנֶסֶת es…',
        options: ['El ejército', 'El parlamento', 'La bandera'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'עַצְמָאוּת significa…',
        options: ['Seguridad', 'Independencia', 'Diáspora'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u5-l4',
    unit: 'Unidad 5 · Sionismo',
    title: 'Lugares, lengua y figuras',
    subtitle: 'Herzl, Ben-Yehuda, Tel Aviv',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'vocab',
        vocabIds: [
          'tel-aviv',
          'yerushalayim-zion',
          'kibutz',
          'moshav',
          'herzl',
          'ben-yehuda',
          'tejiat-halashon',
          'ivrit-zion',
          'bitajon',
        ],
      },
      {
        type: 'info',
        title: 'Lengua y nación',
        body: 'El renacimiento del hebreo (תְּחִיַּת הַלָּשׁוֹן) es parte del mismo proceso histórico: una lengua para la vida cotidiana de la nación.',
        hebrew: 'עִבְרִית',
      },
      {
        type: 'quiz',
        prompt: '¿Quién impulsó el hebreo hablado moderno?',
        options: ['Herzl', 'Ben-Yehuda', 'Balfour'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'קִבּוּץ es…',
        options: ['Comunidad cooperativa', 'Himno', 'Exilio'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'u6-l1',
    unit: 'Unidad 6 · Calendario sionista',
    title: 'El arco de la primavera',
    subtitle: 'Shoá, Zikarón, Atzmaút y Yerushaláyim',
    estimatedMinutes: 10,
    steps: [
      {
        type: 'info',
        title: 'Un calendario con emoción colectiva',
        body: 'En pocas semanas de primavera (Nisán–Iyar) Israel pasa de la memoria de la Shoá al duelo de los caídos y, al día siguiente, a la Independencia. Luego llega el Día de Jerusalén. Ese arco es el corazón del calendario sionista-israelí.',
        hebrew: 'זִכָּרוֹן ← עַצְמָאוּת',
      },
      {
        type: 'vocab',
        vocabIds: [
          'cal-luaj',
          'cal-nisan',
          'cal-iyar',
          'cal-yom-hashoah',
          'cal-yom-hazikaron',
          'cal-yom-haatzmaut',
          'cal-yom-yerushalayim',
        ],
      },
      {
        type: 'quiz',
        prompt: '¿Qué día suele ir justo antes de יוֹם הָעַצְמָאוּת?',
        options: ['יוֹם הַזִּכָּרוֹן', 'ט״וּ בִּשְׁבָט', 'יוֹם הָעֲלִיָּה'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'יוֹם יְרוּשָׁלַיִם conmemora…',
        options: ['La plantación de árboles', 'La reunificación de Jerusalén (1967)', 'La Declaración Balfour'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u6-l2',
    unit: 'Unidad 6 · Calendario sionista',
    title: 'Días de memoria',
    subtitle: 'Shoá, zikarón, sirena y bandera',
    estimatedMinutes: 9,
    steps: [
      {
        type: 'info',
        title: 'Silencio nacional',
        body: 'En יוֹם הַשּׁוֹאָה y יוֹם הַזִּכָּרוֹן suena la צְפִירָה (sirena). La gente se detiene. La bandera suele ondear בַּחֲצִי הַתֹּרֶן (a media asta).',
        hebrew: 'צְפִירָה',
      },
      {
        type: 'vocab',
        vocabIds: [
          'cal-yom-hashoah',
          'cal-shoa',
          'cal-gvura',
          'cal-yom-hazikaron',
          'cal-zikaron',
          'cal-tzfira',
          'cal-degel-hatzi',
        ],
      },
      {
        type: 'quiz',
        prompt: 'צְפִירָה en este contexto es…',
        options: ['Una fiesta', 'La sirena de silencio', 'Un mes del año'],
        answerIndex: 1,
      },
      {
        type: 'quiz',
        prompt: 'שׁוֹאָה significa…',
        options: ['Independencia', 'Shoá / Holocausto', 'Aliá'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u6-l3',
    unit: 'Unidad 6 · Calendario sionista',
    title: 'Independencia y celebración',
    subtitle: 'Atzmaút, jagigá y símbolos',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'info',
        title: 'De la memoria a la fiesta',
        body: 'Al caer la noche tras Yom HaZikarón comienza יוֹם הָעַצְמָאוּת: banderas, picnic y חֲגִיגוֹת. El contraste es parte del relato nacional.',
        hebrew: 'יוֹם הָעַצְמָאוּת',
      },
      {
        type: 'vocab',
        vocabIds: ['cal-yom-haatzmaut', 'atzmaut', 'cal-hagiga', 'hatikva', 'degel', 'medinat-yisrael'],
      },
      {
        type: 'quiz',
        prompt: 'יוֹם הָעַצְמָאוּת es…',
        options: ['Día de la Independencia', 'Día de la Shoá', 'Día de la Aliá'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'חֲגִיגָה significa…',
        options: ['Sirena', 'Celebración', 'Exilio'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'u6-l4',
    unit: 'Unidad 6 · Calendario sionista',
    title: 'Tierra, aliá y figuras',
    subtitle: 'Tu BiShvat, Yom HaAliá y Yom Herzl',
    estimatedMinutes: 8,
    steps: [
      {
        type: 'info',
        title: 'Más allá de la primavera',
        body: 'El calendario sionista también marca el vínculo con la tierra (ט״וּ בִּשְׁבָט), la inmigración (יוֹם הָעֲלִיָּה) y a Herzl (יוֹם הֶרְצְל).',
        hebrew: 'ט״וּ בִּשְׁבָט',
      },
      {
        type: 'vocab',
        vocabIds: [
          'cal-tu-bishvat',
          'cal-shvat',
          'cal-netia',
          'cal-yom-haalia',
          'cal-jesvan',
          'cal-yom-herzl',
          'alia',
          'herzl',
        ],
      },
      {
        type: 'quiz',
        prompt: 'ט״וּ בִּשְׁבָט se asocia sobre todo a…',
        options: ['Los árboles y la tierra', 'La sirena de silencio', 'El parlamento'],
        answerIndex: 0,
      },
      {
        type: 'quiz',
        prompt: 'יוֹם הָעֲלִיָּה celebra…',
        options: ['La inmigración a Israel', 'La Guerra de los Seis Días', 'El himno nacional'],
        answerIndex: 0,
      },
    ],
  },
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

export function lessonsByUnit(): { unit: string; lessons: Lesson[] }[] {
  const map = new Map<string, Lesson[]>()
  for (const lesson of lessons) {
    const list = map.get(lesson.unit) ?? []
    list.push(lesson)
    map.set(lesson.unit, list)
  }
  return [...map.entries()].map(([unit, unitLessons]) => ({ unit, lessons: unitLessons }))
}
