import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { alphabet } from '../data/alphabet'
import { vocabulary } from '../data/vocabulary'
import { SpeakButton } from '../components/SpeakButton'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Mode = 'letters' | 'vocab-he' | 'vocab-es'

type Q = {
  prompt: string
  promptHe?: string
  options: string[]
  answer: string
  speak?: string
}

function buildLetterQuestions(count: number): Q[] {
  const pool = shuffle(alphabet)
  return pool.slice(0, count).map((letter) => {
    const wrong = shuffle(alphabet.filter((l) => l.id !== letter.id))
      .slice(0, 3)
      .map((l) => l.name)
    const options = shuffle([letter.name, ...wrong])
    return {
      prompt: '¿Cómo se llama esta letra?',
      promptHe: letter.hebrew,
      options,
      answer: letter.name,
      speak: letter.hebrew,
    }
  })
}

function buildVocabHeQuestions(count: number): Q[] {
  const pool = shuffle(vocabulary)
  return pool.slice(0, count).map((item) => {
    const wrong = shuffle(vocabulary.filter((v) => v.id !== item.id))
      .slice(0, 3)
      .map((v) => v.spanish)
    return {
      prompt: '¿Qué significa?',
      promptHe: item.hebrew,
      options: shuffle([item.spanish, ...wrong]),
      answer: item.spanish,
      speak: item.hebrew,
    }
  })
}

function buildVocabEsQuestions(count: number): Q[] {
  const pool = shuffle(vocabulary)
  return pool.slice(0, count).map((item) => {
    const wrong = shuffle(vocabulary.filter((v) => v.id !== item.id))
      .slice(0, 3)
      .map((v) => v.hebrew)
    return {
      prompt: `¿Cómo se dice “${item.spanish}”?`,
      options: shuffle([item.hebrew, ...wrong]),
      answer: item.hebrew,
      speak: item.hebrew,
    }
  })
}

export function QuizPage() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const questions = useMemo(() => {
    if (mode === 'letters') return buildLetterQuestions(12)
    if (mode === 'vocab-he') return buildVocabHeQuestions(12)
    if (mode === 'vocab-es') return buildVocabEsQuestions(12)
    return []
  }, [mode])

  const current = questions[index]

  function start(m: Mode) {
    setMode(m)
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  function choose(opt: string) {
    if (!current || selected) return
    setSelected(opt)
    if (opt === current.answer) setScore((s) => s + 1)
  }

  function next() {
    if (index >= questions.length - 1) {
      setDone(true)
      return
    }
    setSelected(null)
    setIndex((i) => i + 1)
  }

  if (!mode) {
    return (
      <section className="section">
        <h2>Quiz rápido</h2>
        <p className="lead">Sesiones cortas de opción múltiple para entrenar reconocimiento sin el mazo SRS.</p>
        <div className="lesson-list">
          <button type="button" className="lesson-row" onClick={() => start('letters')}>
            <div>
              <h4>Reconocer letras</h4>
              <p>12 preguntas del alefato</p>
            </div>
          </button>
          <button type="button" className="lesson-row" onClick={() => start('vocab-he')}>
            <div>
              <h4>Hebreo → español</h4>
              <p>¿Qué significa esta palabra?</p>
            </div>
          </button>
          <button type="button" className="lesson-row" onClick={() => start('vocab-es')}>
            <div>
              <h4>Español → hebreo</h4>
              <p>Elige la forma hebrea correcta</p>
            </div>
          </button>
        </div>
        <p style={{ marginTop: '1.25rem' }}>
          <Link className="btn btn-outline" to="/practica">
            Volver a práctica
          </Link>
        </p>
      </section>
    )
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <section className="section panel">
        <h2>Resultado</h2>
        <p className="lead">
          {score}/{questions.length} · {pct}%
        </p>
        <p className="hebrew-xl" style={{ fontSize: '2.8rem' }}>
          {pct >= 80 ? 'מצוין' : pct >= 50 ? 'יופי' : 'עוד פעם'}
        </p>
        <div className="step-actions">
          <button type="button" className="btn btn-outline" onClick={() => setMode(null)}>
            Otros quizzes
          </button>
          <button type="button" className="btn btn-solid" onClick={() => start(mode)}>
            Repetir
          </button>
        </div>
      </section>
    )
  }

  if (!current) return null

  return (
    <section className="section">
      <h2>Quiz rápido</h2>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="meta-row" style={{ justifyContent: 'space-between' }}>
        <span>
          {index + 1}/{questions.length}
        </span>
        <span>Aciertos: {score}</span>
      </p>
      <div className="panel">
        <p style={{ marginTop: 0 }}>{current.prompt}</p>
        {current.promptHe ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
            <p className="hebrew-xl">{current.promptHe}</p>
            {current.speak ? <SpeakButton text={current.speak} /> : null}
          </div>
        ) : null}
        <div className="quiz-options">
          {current.options.map((opt) => {
            let cls = ''
            if (selected) {
              if (opt === current.answer) cls = 'correct'
              else if (opt === selected) cls = 'wrong'
            }
            const isHe = /[\u0590-\u05FF]/.test(opt)
            return (
              <button key={opt} type="button" className={cls} disabled={!!selected} onClick={() => choose(opt)}>
                <span className={isHe ? 'he' : undefined}>{opt}</span>
              </button>
            )
          })}
        </div>
        {selected ? (
          <div className="step-actions">
            <span />
            <button type="button" className="btn btn-solid" onClick={next}>
              {index >= questions.length - 1 ? 'Ver resultado' : 'Siguiente'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
