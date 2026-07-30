import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  type ProgressState,
} from './progress'

let memory = typeof window !== 'undefined' ? loadProgress() : defaultProgress()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return memory
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, defaultProgress)

  const update = useCallback((next: ProgressState | ((prev: ProgressState) => ProgressState)) => {
    memory = typeof next === 'function' ? next(memory) : next
    saveProgress(memory)
    emit()
  }, [])

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    memory = loadProgress()
    emit()
    setHydrated(true)
  }, [])

  return { progress, update, hydrated }
}
