import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useProgress } from '../lib/useProgress'
import { dueCards } from '../lib/progress'

export function HomePage() {
  const { progress } = useProgress()
  const done = progress.completedLessons.length
  const due = dueCards(progress).length
  const next = lessons.find((l) => !progress.completedLessons.includes(l.id)) ?? lessons[0]

  return (
    <>
      <section className="hero" aria-label="Portada">
        <div className="hero-bg" aria-hidden="true" />
        <div>
          <h1 className="hero-brand">
            Ulpan
            <span className="he">אולפן היבריד</span>
          </h1>
          <p>Hebreo desde cero: alefato, vocabulario, gramática y frases, con práctica de repetición espaciada.</p>
          <div className="cta-row">
            <Link className="btn btn-primary" to={next ? `/lecciones/${next.id}` : '/lecciones'}>
              {done === 0 ? 'Empezar' : 'Continuar'}
            </Link>
            <Link className="btn btn-ghost" to="/practica">
              Repasar tarjetas
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Tu ritmo</h2>
        <p className="lead">El progreso se guarda en este dispositivo. Estudia un poco cada día.</p>
        <div className="stats-inline">
          <div>
            <strong>{done}/{lessons.length}</strong>
            Lecciones
          </div>
          <div>
            <strong>{progress.streak}</strong>
            Días seguidos
          </div>
          <div>
            <strong>{due}</strong>
            Para repasar
          </div>
          <div>
            <strong>{progress.xp}</strong>
            XP
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Camino de aprendizaje</h2>
        <p className="lead">Cuatro unidades: del alefato a frases útiles en la vida diaria.</p>
        <div className="lesson-list">
          <Link className="lesson-row" to="/alefato">
            <div>
              <h4>1 · Alefato</h4>
              <p>22 letras, formas finales y vocales</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/lecciones">
            <div>
              <h4>2 · Palabras y lecciones</h4>
              <p>Saludos, números, familia y más</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/gramatica">
            <div>
              <h4>3 · Gramática</h4>
              <p>Género, artículo ה y presente</p>
            </div>
          </Link>
          <Link className="lesson-row" to="/frases">
            <div>
              <h4>4 · Frases</h4>
              <p>Café, presentaciones y la calle</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
