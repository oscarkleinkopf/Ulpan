import { grammarTopics } from '../data/grammar'
import { SpeakButton } from '../components/SpeakButton'

export function GrammarPage() {
  return (
    <section className="section">
      <h2>Gramática</h2>
      <p className="lead">
        Ideas clave para hispanohablantes: dirección de lectura, género, artículo y el presente sin “ser”.
      </p>
      <div className="topic-list">
        {grammarTopics.map((topic) => (
          <article className="topic" key={topic.id}>
            <h3>{topic.title}</h3>
            <p className="summary">{topic.summary}</p>
            <ul>
              {topic.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {topic.examples.map((ex) => (
              <div className="example" key={`${topic.id}-${ex.hebrew}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="he">{ex.hebrew}</span>
                  <SpeakButton text={ex.hebrew} />
                </div>
                <span style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{ex.translit}</span>
                <span>{ex.spanish}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  )
}
