<script setup lang="ts">
import {
  EMERGENCIES,
  formatLogForExport,
  type LogEntry,
  type SessionState,
} from '~/composables/useEmergencies'
import { useDarkModePreference } from '../composables/useDarkModePreference'

definePageMeta({
  validate: (route) => {
    const emergencyId = Array.isArray(route.params.emergencyId)
      ? route.params.emergencyId[0]
      : route.params.emergencyId

    return typeof emergencyId === 'string' && EMERGENCIES.some(em => em.id === emergencyId)
  },
})

const route = useRoute()
const router = useRouter()
const { isDark, toggleDark } = useDarkModePreference()
const isFullscreen = ref(false)
const fullscreenHost = ref<HTMLElement | null>(null)
const showInfo = ref(false)
const showResetModal = ref(false)

const SESSION_STORAGE_PREFIX = 'cathstat:session:'

interface PersistedSessionState {
  emergencyId: string
  startedAt: string | null
  checkedItems: string[]
  notes: string
  patientMRN: string
  patientName: string
  staffNames: string
  log: Array<{ timestamp: string, action: string, detail?: string }>
  elapsed: number
  timerRunning: boolean
  showInfo: boolean
}

function storageKey(id: string): string {
  return `${SESSION_STORAGE_PREFIX}${id}`
}

function syncFullscreenState() {
  if (typeof document === 'undefined') return
  const doc = document as Document & { webkitFullscreenElement?: Element | null }
  isFullscreen.value = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement)
}

async function requestFullscreenForHost() {
  if (typeof document === 'undefined') return

  const host = fullscreenHost.value ?? document.documentElement
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null
  }
  const el = host as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
  }

  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    syncFullscreenState()
    return
  }

  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen()
    }
  } catch {
    // Ignore browser fullscreen permission/user-gesture errors.
  } finally {
    syncFullscreenState()
  }
}

async function toggleFullscreen() {
  if (typeof document === 'undefined') return

  const host = fullscreenHost.value ?? document.documentElement
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void> | void
    webkitFullscreenElement?: Element | null
  }
  const el = host as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
  }

  try {
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen()
      }
    } else {
      await requestFullscreenForHost()
    }
  } catch {
    // Ignore user-gesture and platform-specific fullscreen errors.
  }
}

const emergencyId = computed(() =>
  Array.isArray(route.params.emergencyId) ? route.params.emergencyId[0] : route.params.emergencyId
)

const emergency = computed(() =>
  EMERGENCIES.find(em => em.id === emergencyId.value) ?? EMERGENCIES[0]
)

function freshSession(id: string | null = null): SessionState {
  return {
    emergencyId: id,
    startedAt: null,
    checkedItems: new Set<string>(),
    notes: '',
    patientMRN: '',
    patientName: '',
    staffNames: '',
    log: [],
  }
}

const session = ref<SessionState>(freshSession(emergencyId.value ?? null))

function addLog(action: string, detail?: string) {
  session.value.log = [...session.value.log, { timestamp: new Date(), action, detail } as LogEntry]
}

const elapsed = ref(0)
const timerRunning = ref(false)
let startTime: number | null = null
let lastElapsed = 0
let rafId: number | null = null
let didHydrateFromStorage = false

function saveSessionState(id: string) {
  if (typeof window === 'undefined') return

  const payload: PersistedSessionState = {
    emergencyId: id,
    startedAt: session.value.startedAt ? session.value.startedAt.toISOString() : null,
    checkedItems: Array.from(session.value.checkedItems),
    notes: session.value.notes,
    patientMRN: session.value.patientMRN,
    patientName: session.value.patientName,
    staffNames: session.value.staffNames,
    log: session.value.log.map(entry => ({
      timestamp: entry.timestamp.toISOString(),
      action: entry.action,
      detail: entry.detail,
    })),
    elapsed: elapsed.value,
    timerRunning: timerRunning.value,
    showInfo: showInfo.value,
  }

  try {
    window.sessionStorage.setItem(storageKey(id), JSON.stringify(payload))
  } catch {
    // Ignore storage quota and unavailable storage errors.
  }
}

function loadSessionState(id: string): PersistedSessionState | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(storageKey(id))
    if (!raw) return null

    const parsed = JSON.parse(raw) as PersistedSessionState
    if (!parsed || parsed.emergencyId !== id || !Array.isArray(parsed.checkedItems) || !Array.isArray(parsed.log)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function tick() {
  if (startTime !== null) {
    elapsed.value = lastElapsed + (Date.now() - startTime)
  }
  rafId = requestAnimationFrame(tick)
}

function startTimer() {
  if (timerRunning.value) return
  startTime = Date.now()
  timerRunning.value = true
  rafId = requestAnimationFrame(tick)
}

function pauseTimer() {
  if (!timerRunning.value) return
  lastElapsed = elapsed.value
  startTime = null
  timerRunning.value = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function resetTimer() {
  pauseTimer()
  elapsed.value = 0
  lastElapsed = 0
}

function applyPersistedState(id: string, persisted: PersistedSessionState): boolean {
  const startedAt = persisted.startedAt ? new Date(persisted.startedAt) : null
  const parsedLog: LogEntry[] = persisted.log
    .map(entry => ({
      timestamp: new Date(entry.timestamp),
      action: entry.action,
      detail: entry.detail,
    }))
    .filter(entry => !Number.isNaN(entry.timestamp.getTime()))

  session.value = {
    emergencyId: id,
    startedAt: startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt : null,
    checkedItems: new Set<string>(persisted.checkedItems),
    notes: persisted.notes ?? '',
    patientMRN: persisted.patientMRN ?? '',
    patientName: persisted.patientName ?? '',
    staffNames: persisted.staffNames ?? '',
    log: parsedLog,
  }

  pauseTimer()
  elapsed.value = Math.max(0, persisted.elapsed ?? 0)
  lastElapsed = elapsed.value
  showInfo.value = Boolean(persisted.showInfo)
  showResetModal.value = false

  if (persisted.timerRunning) {
    startTimer()
  }

  return true
}

function initializeSession(id: string) {
  const persisted = loadSessionState(id)
  if (persisted && applyPersistedState(id, persisted)) {
    return
  }

  const selectedEmergency = EMERGENCIES.find(em => em.id === id)
  const now = new Date()

  session.value = {
    emergencyId: id,
    startedAt: now,
    checkedItems: new Set<string>(),
    notes: '',
    patientMRN: '',
    patientName: '',
    staffNames: '',
    log: [{ timestamp: now, action: 'Emergency started', detail: selectedEmergency?.name }],
  }

  resetTimer()
  startTimer()
  showInfo.value = false
  showResetModal.value = false
}

watch(emergencyId, (id) => {
  if (!id) return
  didHydrateFromStorage = true
  initializeSession(id)
}, { immediate: true })

watch(
  [session, elapsed, timerRunning, showInfo, emergencyId],
  ([, , , , id]) => {
    if (!didHydrateFromStorage || !id) return
    saveSessionState(id)
  },
  { deep: true },
)

onMounted(() => {
  if (typeof document === 'undefined') return
  document.addEventListener('fullscreenchange', syncFullscreenState)
  document.addEventListener('webkitfullscreenchange', syncFullscreenState as EventListener)

  // Attempt to start in fullscreen when entering an emergency checklist.
  void requestFullscreenForHost()
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', syncFullscreenState)
    document.removeEventListener('webkitfullscreenchange', syncFullscreenState as EventListener)
  }
})

function handleToggleItem(id: string, text: string) {
  const next = new Set(session.value.checkedItems)
  const wasChecked = next.has(id)
  wasChecked ? next.delete(id) : next.add(id)
  session.value.checkedItems = next
  session.value.log = [
    ...session.value.log,
    { timestamp: new Date(), action: wasChecked ? 'Item unchecked' : 'Item checked', detail: text },
  ]
}

function handleBack() {
  pauseTimer()
  router.push('/')
}

function handleReset() {
  showResetModal.value = true
}

function handleResetConfirm() {
  showResetModal.value = false
  resetTimer()
  session.value.checkedItems = new Set<string>()
  session.value.log = [
    ...session.value.log,
    { timestamp: new Date(), action: 'Checklist reset' },
  ]
}

function handleExport() {
  const text = formatLogForExport(session.value, emergency.value)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cathlab-emergency-log-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.txt`
  a.click()
  URL.revokeObjectURL(url)
  addLog('Log exported')
}

function handleUpdateSession(updates: Partial<SessionState>) {
  session.value = { ...session.value, ...updates }
}
</script>

<template>
  <div
    ref="fullscreenHost"
    :class="isDark ? 'dark' : ''"
  >
    <ChecklistView
      :emergency="emergency"
      :session="session"
      :is-dark="isDark"
      :elapsed="elapsed"
      :timer-running="timerRunning"
      :is-fullscreen="isFullscreen"
      @toggle-item="handleToggleItem"
      @start-timer="startTimer"
      @pause-timer="pauseTimer"
      @reset-timer="resetTimer"
      @open-info="showInfo = true"
      @export="handleExport"
      @reset="handleReset"
      @back="handleBack"
      @toggle-dark="toggleDark"
      @toggle-fullscreen="toggleFullscreen"
    />

    <InfoPanel
      v-if="showInfo"
      :session="session"
      :is-dark="isDark"
      @update="handleUpdateSession"
      @close="showInfo = false"
    />

    <ResetModal
      v-if="showResetModal"
      :is-dark="isDark"
      @confirm="handleResetConfirm"
      @cancel="showResetModal = false"
    />
  </div>
</template>