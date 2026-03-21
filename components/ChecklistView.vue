<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import {
  Maximize2, Minimize2, FileText, RotateCcw, Download,
  ChevronLeft,
  Info,
  Play, Pause, StopCircle, Moon, Sun,
} from 'lucide-vue-next'
import type { EmergencySection, EmergencyType, SessionState } from '../composables/useEmergencies'
import { formatDuration } from '../composables/useEmergencies'

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

const pageBg = computed(() => props.isDark ? 'bg-zinc-900' : 'bg-[#E8E9E4]')
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
const sectionCountCls = computed(() => props.isDark ? 'text-xs text-zinc-500 font-medium' : 'text-xs text-slate-500 font-medium')
const activeInfoItemId = ref<string | null>(null)
const hoveredInfoItemId = ref<string | null>(null)
let closeInfoTimer: ReturnType<typeof setTimeout> | null = null

interface ItemLike {
  text: string
  subtext?: string
}

const ITEM_TEXT_SPLIT_RE = /^(.*?)\s[—-]\s(.+)$/

function splitItemText(raw: string): { main: string, detail: string | null } {
  const match = raw.match(ITEM_TEXT_SPLIT_RE)
  if (!match) {
    return { main: raw.trim(), detail: null }
  }
  return {
    main: match[1].trim(),
    detail: match[2].trim(),
  }
}

function itemMainText(item: ItemLike): string {
  return splitItemText(item.text).main
}

function itemDetailText(item: ItemLike): string {
  if (item.subtext?.trim()) return item.subtext.trim()
  return splitItemText(item.text).detail ?? ''
}

function hasItemDetail(item: ItemLike): boolean {
  return itemDetailText(item).length > 0
}

function isInfoOpen(id: string): boolean {
  return activeInfoItemId.value === id
}

function cancelInfoCloseTimer() {
  if (!closeInfoTimer) return
  clearTimeout(closeInfoTimer)
  closeInfoTimer = null
}

function handleItemMouseEnter(id: string) {
  hoveredInfoItemId.value = id
  cancelInfoCloseTimer()
}

function handleItemMouseLeave(id: string) {
  if (hoveredInfoItemId.value === id) {
    hoveredInfoItemId.value = null
  }
  scheduleInfoClose()
}

function scheduleInfoClose() {
  cancelInfoCloseTimer()
  closeInfoTimer = setTimeout(() => {
    if (hoveredInfoItemId.value === null) {
      activeInfoItemId.value = null
    }
    closeInfoTimer = null
  }, 500)
}

function toggleItemInfo(id: string) {
  cancelInfoCloseTimer()
  activeInfoItemId.value = activeInfoItemId.value === id ? null : id
}

function sectionCheckedCount(section: EmergencySection): number {
  return section.items.filter(item => props.session.checkedItems.has(item.id)).length
}

onUnmounted(() => {
  cancelInfoCloseTimer()
})

function itemRowCls(): string {
  return props.isDark
    ? 'w-full group relative flex items-stretch overflow-hidden transition-colors duration-100 hover:bg-zinc-700/90'
    : 'w-full group relative flex items-stretch overflow-hidden transition-colors duration-100 hover:bg-slate-300/60'
}

const bodySurfaceCls = computed(() => props.isDark ? 'bg-zinc-900' : 'bg-[#E8E9E4]')
const cardSurfaceCls = computed(() =>
  props.isDark
    ? 'bg-zinc-800 border-zinc-600 rounded-md'
    : 'bg-[#F7F7F3] border-[#D1D4D0] rounded-md'
)
const sectionTitleCls = computed(() =>
  props.isDark
    ? 'checklist-condensed text-xl tracking-[0.03em] font-bold text-zinc-100 uppercase leading-none'
    : 'checklist-condensed text-xl tracking-[0.03em] font-bold text-black uppercase leading-none'
)
const sectionRuleCls = computed(() => props.isDark ? 'border-zinc-500' : 'border-black')
const infoSurfaceBgCls = computed(() => props.isDark ? 'bg-zinc-500/70' : 'bg-slate-300/70')
const infoIconTextCls = computed(() => props.isDark ? 'text-zinc-100' : 'text-slate-700')
const slideMainTextCls = computed(() => props.isDark ? 'text-zinc-200' : 'text-slate-800')
const slideDetailTextCls = computed(() => props.isDark ? 'text-zinc-300' : 'text-slate-600')
const itemTextCls = computed(() =>
  props.isDark
    ? {
      checked: 'checklist-condensed text-zinc-500 font-semibold line-through decoration-zinc-500 decoration-[1px]',
      unchecked: 'checklist-condensed text-zinc-100 font-semibold',
    }
    : {
      checked: 'checklist-condensed text-slate-400 font-semibold line-through decoration-slate-400 decoration-[1px]',
      unchecked: 'checklist-condensed text-[#111111] font-semibold',
    }
)

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
    <div :class="['min-h-screen flex-1 overflow-y-auto lg:overflow-hidden', bodySurfaceCls]">
      <div class="w-full px-4 sm:px-5 lg:px-7 xl:px-10 2xl:px-12 py-4 xl:py-5 h-full">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5 h-full"
      >
        <div
          v-for="section in emergency.sections"
          :key="section.title"
          :class="[
            'border px-4 py-4 xl:px-5 xl:py-5 space-y-3.5 min-h-0',
            cardSurfaceCls,
          ]"
        >
          <!-- Section header -->
          <div>
            <div class="flex items-end justify-between gap-3">
              <div :class="sectionTitleCls">
                {{ section.title }}
              </div>
              <span :class="['tabular-nums shrink-0', sectionCountCls]">
                {{ sectionCheckedCount(section) }}/{{ section.items.length }}
              </span>
            </div>
            <div :class="['border-b-[3px] mt-1.5 mb-3', sectionRuleCls]" />
          </div>

          <!-- Items -->
          <div class="space-y-1 xl:space-y-1.5">
            <div
              v-for="item in section.items"
              :key="item.id"
              :class="[
                'w-full text-left',
                itemRowCls(),
              ]"
              :data-testid="`checklist-item-${item.id}`"
              @mouseenter="handleItemMouseEnter(item.id)"
              @mouseleave="handleItemMouseLeave(item.id)"
            >
              <button
                :class="[
                  'flex-1 min-w-0 text-left px-1 py-2 xl:py-2.5 transition-all duration-100 ease-out',
                  isInfoOpen(item.id) ? 'opacity-0 scale-[0.94] origin-top-left' : 'opacity-100 scale-100',
                ]"
                @click="emit('toggleItem', item.id, item.text)"
              >
                <div class="flex items-start gap-2 pr-12">
                  <div :class="[
                    'text-[1.85rem] leading-[1.03]',
                    session.checkedItems.has(item.id)
                      ? itemTextCls.checked
                      : itemTextCls.unchecked,
                  ]">
                    {{ itemMainText(item) }}
                  </div>
                </div>
              </button>

              <button
                v-if="hasItemDetail(item)"
                :class="[
                  'absolute right-0 inset-y-0 z-20 h-full aspect-square flex items-center justify-center rounded-none transition-all duration-100 ease-out',
                  infoIconTextCls,
                  isInfoOpen(item.id)
                    ? 'bg-transparent'
                    : infoSurfaceBgCls,
                  isInfoOpen(item.id)
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100',
                ]"
                title="Show details"
                @click.stop="toggleItemInfo(item.id)"
              >
                <Info :size="15" />
              </button>

              <div
                v-if="hasItemDetail(item)"
                :class="[
                  'absolute inset-0 z-10 pointer-events-none transition-all duration-100 ease-out',
                  isInfoOpen(item.id)
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0',
                ]"
              >
                <div
                  :class="[
                    'absolute inset-0',
                    infoSurfaceBgCls,
                  ]"
                />
                <div class="relative h-full w-full px-3 pr-14 py-1.5 flex flex-col justify-start overflow-hidden">
                  <div :class="[
                    'checklist-condensed text-base leading-tight font-semibold truncate',
                    slideMainTextCls,
                  ]">
                    {{ itemMainText(item) }}
                  </div>
                  <div :class="[
                    'text-sm font-normal leading-snug mt-1 line-clamp-2',
                    slideDetailTextCls,
                  ]">
                    {{ itemDetailText(item) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
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

<style scoped>
.checklist-condensed {
  font-family: "Arial Narrow", "Roboto Condensed", "Helvetica Neue", Arial, sans-serif;
}
</style>
