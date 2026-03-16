<script setup lang="ts">
import {
  EMERGENCIES, formatLogForExport,
  type SessionState, type LogEntry,
} from '~/composables/useEmergencies'

// ─── Theme ────────────────────────────────────────────────────────────────────

const isDark = ref(false)
const isFullscreen = ref(false)

function toggleDark() { isDark.value = !isDark.value }
function toggleFullscreen() { isFullscreen.value = !isFullscreen.value }

// ─── View ─────────────────────────────────────────────────────────────────────

const view = ref<'landing' | 'checklist'>('landing')

// ─── Session ──────────────────────────────────────────────────────────────────

function freshSession(): SessionState {
  return {
    emergencyId: null,
    startedAt: null,
    checkedItems: new Set<string>(),
    notes: '',
    patientMRN: '',
    patientName: '',
    staffNames: '',
    log: [],
  }
}

const session = ref<SessionState>(freshSession())
const emergency = computed(() =>
  EMERGENCIES.find(e => e.id === session.value.emergencyId)
)

function addLog(action: string, detail?: string) {
  session.value.log = [...session.value.log, { timestamp: new Date(), action, detail } as LogEntry]
}

// ─── Timer ────────────────────────────────────────────────────────────────────

const elapsed = ref(0)
const timerRunning = ref(false)
let startTime: number | null = null
let lastElapsed = 0
let rafId: number | null = null

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
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
}

function resetTimer() {
  pauseTimer()
  elapsed.value = 0
  lastElapsed = 0
}

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})

// ─── Handlers ─────────────────────────────────────────────────────────────────

const showInfo = ref(false)
const showResetModal = ref(false)

function handleSelectEmergency(id: string) {
  const em = EMERGENCIES.find(e => e.id === id)
  const now = new Date()
  session.value = {
    emergencyId: id,
    startedAt: now,
    checkedItems: new Set<string>(),
    notes: '',
    patientMRN: '',
    patientName: '',
    staffNames: '',
    log: [{ timestamp: now, action: 'Emergency started', detail: em?.name }],
  }
  resetTimer()
  startTimer()
  view.value = 'checklist'
}

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
  view.value = 'landing'
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
  if (!emergency.value) return
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
    :class="isDark ? 'dark' : ''"
    :style="isFullscreen ? { position: 'fixed', inset: '0', zIndex: '9999' } : {}"
  >
    <LandingPage
      v-if="view === 'landing'"
      :is-dark="isDark"
      @select="handleSelectEmergency"
      @toggle-dark="toggleDark"
    />

    <ChecklistView
      v-else-if="view === 'checklist' && emergency"
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
