import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { alphabet } from '../data/alphabet'
import { getLesson, type LessonStep } from '../data/lessons'
import { grammarTopics } from '../data/grammar'
import { phrases } from '../data/phrases'
import { getVocab } from '../data/vocabulary'
import { GuidedListenCard } from '../components/GuidedListenCard'
import { PageVisual } from '../components/PageVisual'
import { SpeakButton } from '../components/SpeakButton'
import {
  clipIdForLetter,
  clipIdForLessonStep,
  clipIdForPhrase,
  clipIdForVocab,
} from '../lib/guidedAudio'
import { enqueueForSrs, markLessonComplete } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function LessonPlayerPage() {
  const { lessonId = '' } = useParams()
  const lesson = getLesson(lessonId)
  const navigate = useNavigate()
  const { update } = useProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizCount, setQuizCount] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const step = lesson?.steps[stepIndex]
  const progressPct = lesson ? ((stepIndex + (finished ? 1 : 0)) / lesson.steps.length) * 100 : 0

  const quizTotal = useMemo(
    () => lesson?.steps.filter((s) => s.type === 'quiz').length ?? 0,
    [lesson],
  )

  if (!lesson) {
    return (
      <section className="section">
        <h2>Lección no encontrada</h2>
        <Link className="btn btn-solid" to="/lecciones">
          Volver
        </Link>
      </section>
    )
  }

  function collectSrsIds(steps: LessonStep[]) {
    const items: { id: string; kind: 'vocab' | 'letter' | 'phrase' }[] = []
    for (const s of steps) {
      if (s.type === 'letter') items.push({ id: s.letterId, kind: 'letter' })
      if (s.type === 'vocab') s.vocabIds.forEach((id) => items.push({ id, kind: 'vocab' }))
      if (s.type === 'phrase') s.phraseIds.forEach((id) => items.push({ id, kind: 'phrase' }))
    }
    return items
  }

  function completeLesson() {
    const score = quizTotal === 0 ? 100 : Math.round((correctCount / quizTotal) * 100)
    update((prev) => {
      const withLesson = markLessonComplete(prev, lesson!.id, score)
      return enqueueForSrs(withLesson, collectSrsIds(lesson!.steps))
    })
    setFinished(true)
  }

  function goNext() {
    if (!lesson) return
    setSelected(null)
    if (stepIndex >= lesson.steps.length - 1) {
      completeLesson()
      return
    }
    setStepIndex((i) => i + 1)
  }

  function answerQuiz(index: number, answerIndex: number) {
    if (selected !== null) return
    setSelected(index)
    setQuizCount((c) => c + 1)
    if (index === answerIndex) setCorrectCount((c) => c + 1)
  }

  if (finished) {
    const score = quizTotal === 0 ? 100 : Math.round((correctCount / quizTotal) * 100)
    return (
      <section className="section panel">
        <PageVisual sceneId="leccion" />
        <h2>¡Lección completada!</h2>
        <p className="lead">
          {lesson.title} · resultado {score}%
          {quizTotal > 0 ? ` (${correctCount}/${quizTotal})` : ''}
        </p>
          <p className="hebrew-xl" style={{ fontSize: '3rem' }}>
          כָּל הַכָּבוֹד
        </p>
        <p className="meta-row">Kol ha-kavód — bien hecho. El material pasó a tu mazo de práctica.</p>
        <div className="step-actions">
          <Link className="btn btn-outline" to="/lecciones">
            Todas las lecciones
          </Link>
          <button type="button" className="btn btn-solid" onClick={() => navigate('/practica')}>
            Ir a práctica
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      {stepIndex === 0 ? <PageVisual sceneId="leccion" /> : null}
      <p className="lead" style={{ marginBottom: 0 }}>
        {lesson.unit}
      </p>
      <h2>{lesson.title}</h2>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <p className="meta-row" style={{ justifyContent: 'space-between' }}>
        <span>
          Paso {stepIndex + 1} de {lesson.steps.length}
        </span>
        {quizCount > 0 ? (
          <span>
            Quiz: {correctCount}/{quizCount}
          </span>
        ) : null}
      </p>

      <div className="panel">
        {step?.type === 'info' && (
          <>
            <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
              {step.title}
            </h3>
            {step.hebrew ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                <p className="hebrew-xl">{step.hebrew}</p>
                <SpeakButton text={step.hebrew.replace(/[·.]/g, ' ')} />
              </div>
            ) : null}
            <p style={{ color: 'var(--ink-soft)', marginBottom: 0 }}>{step.body}</p>
          </>
        )}

        {step?.type === 'listen' && (
          <>
            <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
              {step.title}
            </h3>
            {step.body ? <p style={{ color: 'var(--ink-soft)' }}>{step.body}</p> : null}
            <GuidedListenCard
              hebrew={step.hebrew}
              translit={step.translit}
              spanish={step.spanish}
              clipId={step.clipId ?? clipIdForLessonStep(lesson.id, stepIndex)}
            />
          </>
        )}

        {step?.type === 'letter' && (() => {
          const letter = alphabet.find((l) => l.id === step.letterId)
          if (!letter) return <p>Letra no encontrada</p>
          return (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                <p className="hebrew-xl">{letter.hebrew}{letter.final ? ` / ${letter.final}` : ''}</p>
                <SpeakButton text={letter.hebrew} clipId={clipIdForLetter(letter.id)} />
              </div>
              <h3 style={{ textAlign: 'center', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
                {letter.name}
              </h3>
              <div className="meta-row">
                <span>Sonido: {letter.sound}</span>
                <span>Translit.: {letter.translit}</span>
              </div>
              {letter.note ? <p style={{ color: 'var(--ink-soft)', textAlign: 'center' }}>{letter.note}</p> : null}
            </>
          )
        })()}

        {step?.type === 'vocab' && (
          <div className="vocab-list">
            {step.vocabIds.map((id) => {
              const v = getVocab(id)
              if (!v) return null
              return (
                <div className="vocab-item" key={id}>
                  <span className="he">{v.hebrew}</span>
                  <div>
                    <div className="es">{v.spanish}</div>
                    <div className="tr">{v.translit}</div>
                  </div>
                  <SpeakButton text={v.hebrew} clipId={clipIdForVocab(v.id)} />
                </div>
              )
            })}
          </div>
        )}

        {step?.type === 'grammar' && (() => {
          const topic = grammarTopics.find((t) => t.id === step.topicId)
          if (!topic) return null
          return (
            <>
              <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
                {topic.title}
              </h3>
              <p style={{ color: 'var(--ink-soft)' }}>{topic.summary}</p>
              <ul style={{ color: 'var(--ink-soft)' }}>
                {topic.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {topic.examples.map((ex) => (
                <div className="example" key={ex.hebrew + ex.spanish}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="he">{ex.hebrew}</span>
                    <SpeakButton text={ex.hebrew} />
                  </div>
                  <span className="tr">{ex.translit}</span>
                  <span>{ex.spanish}</span>
                </div>
              ))}
            </>
          )
        })()}

        {step?.type === 'phrase' && (
          <div className="phrase-list">
            {step.phraseIds.map((id) => {
              const p = phrases.find((x) => x.id === id)
              if (!p) return null
              return (
                <div className="phrase-item" key={id}>
                  <span className="he">{p.hebrew}</span>
                  <div>
                    <div className="es">{p.spanish}</div>
                    <div className="tr">
                      {p.translit} · {p.situation}
                    </div>
                  </div>
                  <SpeakButton text={p.hebrew} clipId={clipIdForPhrase(p.id)} />
                </div>
              )
            })}
          </div>
        )}

        {step?.type === 'quiz' && (
          <>
            <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)', color: 'var(--brand)' }}>
              Comprueba
            </h3>
            <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>{step.prompt}</p>
            {step.promptHebrew ? <p className="hebrew-xl" style={{ fontSize: '2.4rem' }}>{step.promptHebrew}</p> : null}
            <div className="quiz-options">
              {step.options.map((opt, i) => {
                let cls = ''
                if (selected !== null) {
                  if (i === step.answerIndex) cls = 'correct'
                  else if (i === selected) cls = 'wrong'
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    className={cls}
                    disabled={selected !== null}
                    onClick={() => answerQuiz(i, step.answerIndex)}
                  >
                    <span className={/[\u0590-\u05FF]/.test(opt) ? 'he' : undefined}>{opt}</span>
                  </button>
                )
              })}
            </div>
            {selected !== null && step.explain ? (
              <p style={{ color: 'var(--ink-soft)', marginTop: '0.85rem' }}>{step.explain}</p>
            ) : null}
          </>
        )}

        <div className="step-actions">
          <button
            type="button"
            className="btn btn-outline"
            disabled={stepIndex === 0}
            onClick={() => {
              setSelected(null)
              setStepIndex((i) => Math.max(0, i - 1))
            }}
          >
            Atrás
          </button>
          <button
            type="button"
            className="btn btn-solid"
            disabled={step?.type === 'quiz' && selected === null}
            onClick={goNext}
          >
            {stepIndex >= lesson.steps.length - 1 ? 'Terminar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </section>
  )
}
