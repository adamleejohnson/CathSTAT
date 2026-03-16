<script setup lang="ts">
import {
  Maximize2, Minimize2, FileText, RotateCcw, Download,
  ChevronLeft, CheckCircle2, Circle, AlertTriangle,
  Play, Pause, StopCircle, Moon, Sun,
} from 'lucide-vue-next'
import type { EmergencyType, SessionState } from '~/composables/useEmergencies'
import { formatDuration } from '~/composables/useEmergencies'

const props = defineProps<{
  emergency: EmergencyType
  session: SessionState
  isDark: boolean
  elapsed: number
  timerRunning: boolean
  isFullscreen: boolean
}>()

const emit = defineEmits<{
  toggleItem: [id: string, text: string]
  startTimer: []
  pauseTimer: []
  resetTimer: []
  openInfo: []
  export: []
  reset: []
  back: []
  toggleDark: []
  toggleFullscreen: []
}>()

const allItems = computed(() => props.emergency.sections.flatMap(s => s.items))
const totalItems = computed(() => allItems.value.length)
const checkedCount = computed(() => allItems.value.filter(i => props.session.checkedItems.has(i.id)).length)
const progress = computed(() => totalItems.value > 0 ? (checkedCount.value / totalItems.value) * 100 : 0)
const isComplete = computed(() => checkedCount.value === totalItems.value && totalItems.value > 0)

const timerColor = computed(() => {
  if (props.isDark) {
    return props.elapsed > 20 * 60 * 1000 ? 'text-red-400'
      : props.elapsed > 10 * 60 * 1000 ? 'text-amber-400' : 'text-white'
  }
  return props.elapsed > 20 * 60 * 1000 ? 'text-red-600'
    : props.elapsed > 10 * 60 * 1000 ? 'text-amber-600' : 'text-gray-800'
})

const pageBg = computed(() => props.isDark ? 'bg-[hsl(222,47%,8%)]' : 'bg-[#eef0f3]')
const topBarBg = computed(() =>
  props.isDark ? 'bg-[hsl(222,40%,9%)] border-white/8' : 'bg-[#e4e6ea] border-gray-200'
)
const bottomBarBg = computed(() =>
  props.isDark ? 'bg-[hsl(222,40%,9%)] border-white/8' : 'bg-[#e4e6ea] border-gray-200'
)
const progressTrack = computed(() => props.isDark ? 'bg-white/5' : 'bg-gray-200')
const btnGhost = computed(() =>
  props.isDark
    ? 'text-white/50 hover:text-white hover:bg-white/10'
    : 'text-gray-400 hover:text-gray-700 hover:bg-black/8'
)
const backCls = computed(() =>
  props.isDark
    ? 'text-white/50 hover:text-white hover:bg-white/8'
    : 'text-gray-500 hover:text-gray-800 hover:bg-black/8'
)
const emergencyNameCls = computed(() =>
  props.isDark ? props.emergency.darkAccent : props.emergency.lightAccent
)
const patientInfoCls = computed(() => props.isDark ? 'text-white/30' : 'text-gray-400')
const statusTextCls = computed(() => props.isDark ? 'text-white/25' : 'text-gray-400')
const sectionHeaderCls = computed(() =>
  props.isDark ? 'text-white/45 border-white/10' : 'text-gray-400 border-gray-200'
)
const sectionCountCls = computed(() => props.isDark ? 'text-white/30' : 'text-gray-400')

const completionBg = computed(() =>
  props.isDark ? 'bg-green-950/40 border-green-700/40' : 'bg-green-50 border-green-200'
)
const completionText = computed(() => props.isDark ? 'text-white' : 'text-gray-800')
const completionSub = computed(() => props.isDark ? 'text-white/40' : 'text-gray-500')

function itemCls(checked: boolean, critical: boolean | undefined): string {
  if (checked) {
    return props.isDark
      ? 'bg-green-950/30 border-green-700/25'
      : 'bg-green-50 border-green-200'
  }
  if (critical) {
    return props.isDark
      ? 'bg-red-950/25 border-red-700/25 hover:bg-red-950/45 hover:border-red-600/45'
      : 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300'
  }
  return props.isDark
    ? 'bg-white/[0.025] border-white/8 hover:bg-white/[0.055] hover:border-white/14'
    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
}

function itemTextCls(checked: boolean, critical: boolean | undefined): string {
  if (checked) return props.isDark ? 'line-through text-white/30' : 'line-through text-gray-400'
  return props.isDark
    ? (critical ? 'text-white' : 'text-white/85')
    : (critical ? 'text-gray-900' : 'text-gray-700')
}

const todayStr = computed(() =>
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
)
</script>

<template>
  <div :class="[pageBg, 'h-screen flex flex-col overflow-hidden']">

    <!-- Top bar -->
    <div :class="['flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 border-b', topBarBg]">
      <button
        :class="['flex items-center gap-1 text-sm font-medium px-2 py-1.5 rounded-lg transition-colors flex-shrink-0', backCls]"
        data-testid="btn-back"
        @click="emit('back')"
      >
        <ChevronLeft :size="15" />
        <span class="hidden sm:inline">Back</span>
      </button>

      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span :class="['text-sm font-bold truncate', emergencyNameCls]">{{ emergency.name }}</span>
        <span
          v-if="session.patientName || session.patientMRN"
          :class="['text-xs truncate hidden sm:inline', patientInfoCls]"
        >
          — {{ session.patientName || session.patientMRN }}
        </span>
      </div>

      <!-- Timer -->
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <span
          :class="['font-mono text-lg font-bold tabular-nums leading-none', timerColor]"
          data-testid="timer-display"
        >
          {{ formatDuration(elapsed) }}
        </span>
        <button
          v-if="!timerRunning"
          class="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/35 text-green-500 transition-colors"
          title="Start"
          data-testid="btn-timer-start"
          @click="emit('startTimer')"
        >
          <Play :size="14" />
        </button>
        <button
          v-else
          class="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 text-amber-500 transition-colors"
          title="Pause"
          data-testid="btn-timer-pause"
          @click="emit('pauseTimer')"
        >
          <Pause :size="14" />
        </button>
        <button
          :class="['p-1.5 rounded-lg transition-colors', btnGhost]"
          title="Reset timer"
          data-testid="btn-timer-reset"
          @click="emit('resetTimer')"
        >
          <StopCircle :size="14" />
        </button>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-0.5 flex-shrink-0">
        <button
          :class="['p-2 rounded-lg transition-colors', btnGhost]"
          title="Session info"
          data-testid="btn-open-info"
          @click="emit('openInfo')"
        >
          <FileText :size="16" />
        </button>
        <button
          :class="['p-2 rounded-lg transition-colors', btnGhost]"
          title="Export log"
          data-testid="btn-export"
          @click="emit('export')"
        >
          <Download :size="16" />
        </button>
        <button
          :class="['p-2 rounded-lg transition-colors', btnGhost]"
          title="Reset checklist"
          data-testid="btn-reset"
          @click="emit('reset')"
        >
          <RotateCcw :size="16" />
        </button>
        <button
          :class="['p-2 rounded-lg transition-colors', btnGhost]"
          title="Toggle theme"
          data-testid="btn-dark-toggle-checklist"
          @click="emit('toggleDark')"
        >
          <Sun v-if="isDark" :size="16" />
          <Moon v-else :size="16" />
        </button>
        <button
          :class="['p-2 rounded-lg transition-colors', btnGhost]"
          title="Toggle fullscreen"
          data-testid="btn-fullscreen"
          @click="emit('toggleFullscreen')"
        >
          <Minimize2 v-if="isFullscreen" :size="16" />
          <Maximize2 v-else :size="16" />
        </button>
      </div>
    </div>

    <!-- Progress bar -->
    <div :class="['flex-shrink-0 h-1', progressTrack]">
      <div
        class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Checklist body -->
    <div class="flex-1 overflow-hidden px-3 sm:px-4 lg:px-5 py-3">

      <!-- Completion state -->
      <div v-if="isComplete" class="h-full flex items-center justify-center">
        <div :class="['rounded-2xl border p-8 text-center max-w-sm', completionBg]">
          <CheckCircle2
            :size="40"
            :class="[isDark ? 'text-green-400' : 'text-green-500', 'mx-auto mb-3']"
          />
          <div :class="['text-xl font-bold mb-1', completionText]">Checklist Complete</div>
          <div :class="['text-sm', completionSub]">All {{ totalItems }} items have been addressed</div>
        </div>
      </div>

      <!-- 2×2 grid -->
      <div
        v-else
        class="h-full grid grid-cols-2 gap-3"
        style="grid-template-rows: 1fr 1fr"
      >
        <div
          v-for="section in emergency.sections"
          :key="section.title"
          class="flex flex-col overflow-hidden min-h-0"
        >
          <!-- Section header -->
          <div :class="['flex items-center gap-2 mb-1.5 pb-1 border-b', sectionHeaderCls]">
            <h2 :class="['text-[10px] font-bold uppercase tracking-[0.18em] flex-1', sectionHeaderCls]">
              {{ section.title }}
            </h2>
            <span :class="['text-[10px] font-mono tabular-nums', sectionCountCls]">
              {{ section.items.filter(i => session.checkedItems.has(i.id)).length }}/{{ section.items.length }}
            </span>
          </div>

          <!-- Items -->
          <div class="flex flex-col gap-1 flex-1 min-h-0 overflow-hidden">
            <button
              v-for="item in section.items"
              :key="item.id"
              :class="[
                'flex-1 min-h-0',
                'w-full text-left flex items-center gap-2.5 px-3 rounded-lg border',
                'transition-all duration-100 active:scale-[0.99] cursor-pointer',
                itemCls(session.checkedItems.has(item.id), item.critical),
              ]"
              :data-testid="`checklist-item-${item.id}`"
              @click="emit('toggleItem', item.id, item.text)"
            >
              <div class="flex-shrink-0">
                <CheckCircle2
                  v-if="session.checkedItems.has(item.id)"
                  :size="18"
                  :class="isDark ? 'text-green-400' : 'text-green-500'"
                />
                <AlertTriangle
                  v-else-if="item.critical"
                  :size="18"
                  :class="isDark ? 'text-red-400/80' : 'text-red-400'"
                />
                <Circle
                  v-else
                  :size="18"
                  :class="isDark ? 'text-white/20' : 'text-gray-300'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div :class="['text-sm leading-snug font-medium truncate', itemTextCls(session.checkedItems.has(item.id), item.critical)]">
                  {{ item.text }}
                </div>
                <div
                  v-if="item.subtext && !session.checkedItems.has(item.id)"
                  :class="['text-xs truncate mt-0.5', isDark ? 'text-white/30' : 'text-gray-400']"
                >
                  {{ item.subtext }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status bar -->
    <div :class="['flex-shrink-0 flex items-center justify-between px-4 py-1.5 border-t', bottomBarBg]">
      <div :class="['text-xs tabular-nums', statusTextCls]">
        {{ checkedCount }} / {{ totalItems }} completed
      </div>
      <div
        v-if="session.notes"
        :class="['text-xs truncate max-w-xs hidden sm:block', statusTextCls]"
      >
        Note: {{ session.notes.slice(0, 60) }}{{ session.notes.length > 60 ? '…' : '' }}
      </div>
      <div :class="['text-xs', statusTextCls]">{{ todayStr }}</div>
    </div>
  </div>
</template>
