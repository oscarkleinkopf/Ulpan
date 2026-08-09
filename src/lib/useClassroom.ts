import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import {
  defaultClassroomState,
  loadClassroomState,
  saveClassroomState,
  type ClassroomState,
} from './classroom'

let memory = typeof window !== 'undefined' ? loadClassroomState() : defaultClassroomState()
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

export function useClassroom() {
  const state = useSyncExternalStore(subscribe, getSnapshot, defaultClassroomState)

  const update = useCallback((next: ClassroomState | ((prev: ClassroomState) => ClassroomState)) => {
    memory = typeof next === 'function' ? next(memory) : next
    saveClassroomState(memory)
    emit()
  }, [])

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    memory = loadClassroomState()
    emit()
    setHydrated(true)
  }, [])

  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) ?? null

  return { state, update, activeProfile, hydrated }
}
