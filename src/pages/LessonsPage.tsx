import { Link } from 'react-router-dom'
import { lessonsByUnit } from '../data/lessons'
import { useProgress } from '../lib/useProgress'

export function LessonsPage() {
  const { progress } = useProgress()
  const units = lessonsByUnit()

  return (
    <section className="section">
      <h2>Lecciones</h2>
      <p className="lead">Sigue el orden sugerido. Cada lección mezcla explicación, ejemplos y un breve quiz.</p>
      {units.map(({ unit, lessons }) => (
        <div className="unit-block" key={unit}>
          <h3>{unit}</h3>
          <div className="lesson-list">
            {lessons.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.id)
              const score = progress.lessonScores[lesson.id]
              return (
                <Link
                  key={lesson.id}
                  to={`/lecciones/${lesson.id}`}
                  className={`lesson-row${done ? ' done' : ''}`}
                >
                  <div>
                    <h4>{lesson.title}</h4>
                    <p>
                      {lesson.subtitle} · ~{lesson.estimatedMinutes} min
                    </p>
                  </div>
                  {done ? <span className="badge">Hecha{score != null ? ` · ${score}%` : ''}</span> : null}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
