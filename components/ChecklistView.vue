<script setup lang="ts">
import {
  Maximize2, Minimize2, FileText, RotateCcw, Download,
  ChevronLeft, CheckSquare, Square,
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

const timerColor = computed(() => {
  if (props.isDark) {
    return props.elapsed > 20 * 60 * 1000 ? 'text-red-300'
      : props.elapsed > 10 * 60 * 1000 ? 'text-amber-300' : 'text-zinc-200'
  }
  return props.elapsed > 20 * 60 * 1000 ? 'text-red-700'
    : props.elapsed > 10 * 60 * 1000 ? 'text-amber-700' : 'text-slate-900'
})

const pageBg = computed(() => props.isDark ? 'bg-zinc-900' : 'bg-[#F5F3EE]')
const topBarBg = computed(() => props.isDark ? 'border-zinc-600 bg-zinc-800' : 'border-[#D2D4D6] bg-[#f8f7f4]')
const bottomBarBg = computed(() => props.isDark ? 'border-zinc-600 bg-zinc-800' : 'border-[#D2D4D6] bg-[#f8f7f4]')
const btnGhost = computed(() =>
  props.isDark
    ? 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 border-zinc-500'
    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-[#D2D4D6]'
)
const backCls = computed(() =>
  props.isDark
    ? 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 border-zinc-500'
    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-[#D2D4D6]'
)
const emergencyNameCls = computed(() => props.isDark ? 'text-zinc-200' : 'text-slate-900')
const patientInfoCls = computed(() => props.isDark ? 'text-zinc-400' : 'text-slate-500')
const statusTextCls = computed(() => props.isDark ? 'text-zinc-400' : 'text-slate-600')
const sectionCountCls = computed(() => props.isDark ? 'text-[11px] text-zinc-500 font-normal' : 'text-[11px] text-slate-400 font-normal')

function sectionAccentCls(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('immediate') || lower.includes('recognition') || lower.includes('escalation')) {
    return props.isDark ? 'border-l-[#B68686]' : 'border-l-[#B85A5A]'
  }
  if (lower.includes('definitive') || lower.includes('treatment') || lower.includes('mechanical')) {
    return props.isDark ? 'border-l-[#8EAD95]' : 'border-l-[#3C6F5C]'
  }
  if (lower.includes('hemodynamic')) {
    return props.isDark ? 'border-l-[#8FA7B8]' : 'border-l-[#3A4B6C]'
  }
  return props.isDark ? 'border-l-slate-500' : 'border-l-slate-700'
}

function itemRowCls(): string {
  return props.isDark
    ? 'flex items-start gap-3 px-1 py-2 hover:bg-zinc-700 transition-colors'
    : 'flex items-start gap-3 px-1 py-2 hover:bg-slate-50 transition-colors'
}

const bodySurfaceCls = computed(() => props.isDark ? 'bg-zinc-900' : 'bg-[#F5F3EE]')
const cardSurfaceCls = computed(() =>
  props.isDark
    ? 'bg-zinc-800 border-zinc-600 shadow-[0_1px_0_rgba(0,0,0,0.35)]'
    : 'bg-white border-[#D2D4D6]'
)
const sectionTitleCls = computed(() =>
  props.isDark
    ? 'text-xs lg:text-sm tracking-[0.22em] font-semibold text-zinc-200 uppercase'
    : 'text-xs lg:text-sm tracking-[0.22em] font-semibold text-slate-900 uppercase'
)
const sectionRuleCls = computed(() => props.isDark ? 'border-zinc-600' : 'border-slate-300')
const itemTextCls = computed(() =>
  props.isDark
    ? {
      checked: 'text-zinc-500 line-through decoration-zinc-500/70 decoration-[1px]',
      unchecked: 'text-zinc-100',
    }
    : {
      checked: 'text-slate-400 line-through decoration-slate-400/70 decoration-[1px]',
      unchecked: 'text-slate-900',
    }
)
const itemSubtextCls = computed(() => props.isDark ? 'text-xs lg:text-sm text-zinc-500 mt-0.5' : 'text-xs lg:text-sm text-slate-500 mt-0.5')

const todayStr = computed(() =>
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
)
</script>

<template>
  <div :class="[pageBg, 'min-h-screen h-screen flex flex-col overflow-hidden']">

    <!-- Top bar -->
    <div :class="['flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 border-b', topBarBg]">
      <button
        :class="['flex items-center gap-1 text-sm font-semibold px-2.5 py-1.5 border rounded-none transition-colors flex-shrink-0', backCls]"
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
          :class="['font-mono text-lg font-bold tabular-nums leading-none tracking-tight', timerColor]"
          data-testid="timer-display"
        >
          {{ formatDuration(elapsed) }}
        </span>
        <button
          v-if="!timerRunning"
          class="p-1.5 border rounded-md bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-emerald-800 transition-colors"
          title="Start"
          data-testid="btn-timer-start"
          @click="emit('startTimer')"
        >
          <Play :size="14" />
        </button>
        <button
          v-else
          class="p-1.5 border rounded-md bg-amber-50 border-amber-300 hover:bg-amber-100 text-amber-800 transition-colors"
          title="Pause"
          data-testid="btn-timer-pause"
          @click="emit('pauseTimer')"
        >
          <Pause :size="14" />
        </button>
        <button
          :class="['p-1.5 border rounded-none transition-colors', btnGhost]"
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
          :class="['p-2 border rounded-none transition-colors', btnGhost]"
          title="Session info"
          data-testid="btn-open-info"
          @click="emit('openInfo')"
        >
          <FileText :size="16" />
        </button>
        <button
          :class="['p-2 border rounded-none transition-colors', btnGhost]"
          title="Export log"
          data-testid="btn-export"
          @click="emit('export')"
        >
          <Download :size="16" />
        </button>
        <button
          :class="['p-2 border rounded-none transition-colors', btnGhost]"
          title="Reset checklist"
          data-testid="btn-reset"
          @click="emit('reset')"
        >
          <RotateCcw :size="16" />
        </button>
        <button
          :class="['p-2 border rounded-none transition-colors', btnGhost]"
          title="Toggle theme"
          data-testid="btn-dark-toggle-checklist"
          @click="emit('toggleDark')"
        >
          <Sun v-if="isDark" :size="16" />
          <Moon v-else :size="16" />
        </button>
        <button
          :class="['p-2 border rounded-none transition-colors', btnGhost]"
          title="Toggle fullscreen"
          data-testid="btn-fullscreen"
          @click="emit('toggleFullscreen')"
        >
          <Minimize2 v-if="isFullscreen" :size="16" />
          <Maximize2 v-else :size="16" />
        </button>
      </div>
    </div>

    <!-- Checklist body -->
    <div :class="['min-h-screen px-2 sm:px-3 md:px-4 xl:px-6 2xl:px-8 pb-6 md:pb-8 flex-1 overflow-y-auto', bodySurfaceCls]">
      <!-- 2×2 grid -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mt-3 md:mt-4 w-full"
      >
        <div
          v-for="section in emergency.sections"
          :key="section.title"
          :class="[
            'border rounded-none px-5 py-5 md:px-6 md:py-5 space-y-4 border-l-[3px]',
            cardSurfaceCls,
            sectionAccentCls(section.title),
          ]"
        >
          <!-- Section header -->
          <div>
            <div class="flex items-baseline justify-between">
              <div :class="sectionTitleCls">
                {{ section.title }}
              </div>
              <span :class="['tabular-nums', sectionCountCls]">
                {{ section.items.filter(i => session.checkedItems.has(i.id)).length }}/{{ section.items.length }}
              </span>
            </div>
            <div :class="['border-b mt-2 mb-4', sectionRuleCls]" />
          </div>

          <!-- Items -->
          <div class="space-y-4">
            <button
              v-for="item in section.items"
              :key="item.id"
              :class="[
                'w-full text-left',
                itemRowCls(),
              ]"
              :data-testid="`checklist-item-${item.id}`"
              @click="emit('toggleItem', item.id, item.text)"
            >
              <div
                :class="[
                  'h-4 w-4 lg:h-5 lg:w-5 mt-1 flex-shrink-0 flex items-center justify-center rounded-sm border',
                  session.checkedItems.has(item.id)
                    ? (isDark ? 'bg-zinc-700 border-zinc-500' : 'bg-slate-100 border-slate-300')
                    : (isDark ? 'bg-zinc-800 border-zinc-400' : 'bg-white border-slate-500'),
                ]"
              >
                <CheckSquare
                  v-if="session.checkedItems.has(item.id)"
                  :class="[isDark ? 'text-zinc-400' : 'text-slate-400', 'h-4 w-4 lg:h-5 lg:w-5']"
                />
                <Square
                  v-else
                  :class="[isDark ? 'text-zinc-500' : 'text-slate-400', 'h-4 w-4 lg:h-5 lg:w-5']"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-2">
                  <div :class="[
                    'text-sm md:text-[15px] lg:text-base leading-relaxed',
                    session.checkedItems.has(item.id)
                      ? itemTextCls.checked
                      : itemTextCls.unchecked,
                  ]">
                    {{ item.text }}
                  </div>
                </div>
                <div
                  v-if="item.subtext && !session.checkedItems.has(item.id)"
                  :class="itemSubtextCls"
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
    <div :class="['flex-shrink-0 flex items-center justify-between px-4 py-2 border-t', bottomBarBg]">
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
