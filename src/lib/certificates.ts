import { lessonsByUnit, type Lesson } from '../data/lessons'
import type { ProgressState } from './progress'

export type CertificateKind = 'unit' | 'streak' | 'lessons'

export type Certificate = {
  id: string
  kind: CertificateKind
  title: string
  subtitle: string
  hebrew: string
  earnedAt: string
  detail: string
}

function unitSlug(unit: string) {
  return unit
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü]+/gi, '-')
    .replace(/^-|-$/g, '')
}

export function earnedCertificates(progress: ProgressState, now = new Date()): Certificate[] {
  const out: Certificate[] = []
  const when = now.toISOString().slice(0, 10)
  const done = new Set(progress.completedLessons)

  for (const { unit, lessons } of lessonsByUnit()) {
    if (lessons.length === 0) continue
    if (lessons.every((l) => done.has(l.id))) {
      out.push({
        id: `unit:${unitSlug(unit)}`,
        kind: 'unit',
        title: 'Unidad completada',
        subtitle: unit,
        hebrew: 'כָּל הַכָּבוֹד',
        earnedAt: when,
        detail: `${lessons.length} lecciones · Kol ha-kavód`,
      })
    }
  }

  const streakMilestones = [3, 7, 14, 30]
  for (const n of streakMilestones) {
    if (progress.streak >= n) {
      out.push({
        id: `streak:${n}`,
        kind: 'streak',
        title: `Racha de ${n} días`,
        subtitle: 'Estudio constante',
        hebrew: 'יָפֶה מְאֹד',
        earnedAt: when,
        detail: `${progress.streak} días seguidos · Yafe meód`,
      })
    }
  }

  const lessonMilestones = [5, 10, 20]
  for (const n of lessonMilestones) {
    if (progress.completedLessons.length >= n) {
      out.push({
        id: `lessons:${n}`,
        kind: 'lessons',
        title: `${n} lecciones`,
        subtitle: 'Camino del Ulpan',
        hebrew: 'כַּל הַבְּרָכוֹת',
        earnedAt: when,
        detail: `${progress.completedLessons.length} lecciones hechas · XP ${progress.xp}`,
      })
    }
  }

  return out
}

export function nextCertificateHint(progress: ProgressState): string | null {
  const units = lessonsByUnit()
  for (const { unit, lessons } of units) {
    const left = lessons.filter((l) => !progress.completedLessons.includes(l.id))
    if (left.length > 0 && left.length <= 2) {
      return `Te faltan ${left.length} lección${left.length === 1 ? '' : 'es'} para certificar: ${unit}`
    }
  }
  if (progress.streak > 0 && progress.streak < 3) return `Llevás ${progress.streak} día(s). ¡Llegá a 3 para tu primer certificado de racha!`
  if (progress.streak >= 3 && progress.streak < 7) return `Racha ${progress.streak}. El próximo certificado es a los 7 días.`
  return null
}

export function certificateLearnerName(progress: ProgressState, fallback = 'Talmid/a del Ulpan') {
  return progress.displayName.trim() || fallback
}

export function unitLessonsRemaining(unitLessons: Lesson[], completed: string[]): Lesson[] {
  return unitLessons.filter((l) => !completed.includes(l.id))
}
