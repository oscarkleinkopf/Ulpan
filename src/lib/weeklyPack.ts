import { calendarSupportTerms, zionistCalendarDays, type CalendarDay } from '../data/calendar'
import { phrases } from '../data/phrases'
import { vocabulary } from '../data/vocabulary'
import { weekKeyFromDate } from './classroom'

export type PackItem = {
  id: string
  hebrew: string
  translit: string
  spanish: string
  kind: 'vocab' | 'phrase' | 'calendar'
}

export type WeeklyPack = {
  weekKey: string
  words: PackItem[]
  phrases: PackItem[]
  focusDay: CalendarDay
  focusTerm: PackItem
}

function hashWeek(weekKey: string): number {
  let h = 0
  for (let i = 0; i < weekKey.length; i++) h = (h * 31 + weekKey.charCodeAt(i)) >>> 0
  return h
}

function pick<T>(arr: T[], seed: number, count: number): T[] {
  if (arr.length === 0) return []
  const out: T[] = []
  const used = new Set<number>()
  let s = seed
  while (out.length < Math.min(count, arr.length)) {
    s = (s * 1103515245 + 12345) >>> 0
    const i = s % arr.length
    if (used.has(i)) continue
    used.add(i)
    out.push(arr[i]!)
  }
  return out
}

export function buildWeeklyPack(weekKey = weekKeyFromDate()): WeeklyPack {
  const seed = hashWeek(weekKey)
  const words = pick(vocabulary, seed, 5).map(
    (v): PackItem => ({
      id: v.id,
      hebrew: v.hebrew,
      translit: v.translit,
      spanish: v.spanish,
      kind: 'vocab',
    }),
  )
  const phraseItems = pick(phrases, seed + 7, 3).map(
    (p): PackItem => ({
      id: p.id,
      hebrew: p.hebrew,
      translit: p.translit,
      spanish: p.spanish,
      kind: 'phrase',
    }),
  )
  const focusDay = zionistCalendarDays[seed % zionistCalendarDays.length]!
  const term =
    calendarSupportTerms[seed % calendarSupportTerms.length] ?? calendarSupportTerms[0]!
  return {
    weekKey,
    words,
    phrases: phraseItems,
    focusDay,
    focusTerm: {
      id: term.id,
      hebrew: term.hebrew,
      translit: term.translit,
      spanish: term.spanish,
      kind: 'calendar',
    },
  }
}

/** Día “en casa”: rota por el ciclo cultural + término del día (estable por fecha gregoriana). */
export function homeCalendarForDate(d = new Date()): {
  day: CalendarDay
  term: (typeof calendarSupportTerms)[number]
  wordOfDay: PackItem
} {
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) >>> 0
  const day = zionistCalendarDays[h % zionistCalendarDays.length]!
  const term = calendarSupportTerms[h % calendarSupportTerms.length]!
  const word = vocabulary[h % vocabulary.length]!
  return {
    day,
    term,
    wordOfDay: {
      id: word.id,
      hebrew: word.hebrew,
      translit: word.translit,
      spanish: word.spanish,
      kind: 'vocab',
    },
  }
}

export function weeklyPackWhatsApp(pack: WeeklyPack, className?: string): string {
  const title = className ? `Ulpan Maggie · ${className}` : 'Ulpan con la Mora Maggie'
  return [
    `📘 ${title}`,
    `Semana ${pack.weekKey}`,
    '',
    '5 palabras:',
    ...pack.words.map((w) => `• ${w.hebrew} (${w.translit}) — ${w.spanish}`),
    '',
    '3 frases:',
    ...pack.phrases.map((p) => `• ${p.hebrew} — ${p.spanish}`),
    '',
    `Foco cultural: ${pack.focusDay.hebrew} · ${pack.focusDay.spanish}`,
    `${pack.focusTerm.hebrew} (${pack.focusTerm.translit}) — ${pack.focusTerm.spanish}`,
    '',
    'Practicá en https://oscarkleinkopf.github.io/Ulpan/',
    'שבוע טוב 💛',
  ].join('\n')
}
