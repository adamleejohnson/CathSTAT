<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { EMERGENCIES } from '~/composables/useEmergencies'

const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  toggleDark: []
}>()

const bg = computed(() => props.isDark ? 'bg-[hsl(222,47%,8%)]' : 'bg-[#f3f4f6]')
const headerText = computed(() => props.isDark ? 'text-zinc-100' : 'text-zinc-900')
const subText = computed(() => props.isDark ? 'text-white/45' : 'text-zinc-500')
const heartStroke = computed(() => props.isDark ? 'rgba(255,255,255,0.82)' : 'rgb(24 24 27)')
const waveStroke = computed(() => props.isDark ? 'rgba(255,255,255,0.42)' : 'rgb(113 113 122)')
const toggleCls = computed(() =>
  props.isDark
    ? 'text-white/40 hover:text-white/70 hover:bg-white/8 border-white/10'
    : 'text-gray-400 hover:text-gray-600 hover:bg-black/5 border-gray-200'
)
const comingSoonBorder = computed(() => props.isDark ? 'border-white/10' : 'border-gray-200')
const comingSoonText = computed(() => props.isDark ? 'text-white/25' : 'text-gray-400')
const comingSoonSub = computed(() => props.isDark ? 'text-white/15' : 'text-gray-300')

function cardBg() {
  return props.isDark
    ? 'bg-zinc-900 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.85)] hover:bg-zinc-800'
    : 'bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)] hover:bg-zinc-50'
}
function cardBorder() {
  return props.isDark ? 'border-white/10 hover:border-white/20' : 'border-zinc-200 hover:border-zinc-300'
}
function accentText() {
  return props.isDark ? 'text-white' : 'text-zinc-900'
}
const chevronCls = computed(() =>
  props.isDark ? 'text-white/35 group-hover:text-white/70' : 'text-zinc-400 group-hover:text-zinc-700'
)
</script>

<template>
  <div :class="[bg, 'min-h-screen relative flex flex-col']">
    <!-- Dark mode toggle — absolute top-right -->
    <div class="absolute top-5 right-5">
      <button
        :class="['p-2.5 rounded-xl border transition-colors', toggleCls]"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        data-testid="btn-dark-toggle"
        @click="emit('toggleDark')"
      >
        <Sun v-if="isDark" :size="18" />
        <Moon v-else :size="18" />
      </button>
    </div>

    <!-- Centered content -->
    <div class="flex-1 flex flex-col items-center justify-center w-full px-6 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <svg aria-label="Cath Lab Emergency" viewBox="0 0 64 64" class="w-12 h-12" fill="none">
            <path
              d="M32 52 C32 52 8 36 8 22 C8 15 13 10 20 10 C24.5 10 28.5 12.5 32 16 C35.5 12.5 39.5 10 44 10 C51 10 56 15 56 22 C56 36 32 52 32 52Z"
              :stroke="heartStroke"
              stroke-width="2.5"
              stroke-linejoin="round"
            />
            <polyline
              points="16,32 22,32 25,25 28,39 31,28 34,32 40,32 43,27 46,32 48,32"
              :stroke="waveStroke"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div :class="['landing-brand text-5xl sm:text-6xl md:text-7xl mb-2', headerText]">
          CathSTAT
        </div>
        <p :class="['text-sm uppercase tracking-[0.24em]', subText]">Select an emergency type</p>
      </div>

      <!-- Cards -->
      <div class="w-full max-w-xl flex flex-col gap-4">
        <button
          v-for="em in EMERGENCIES"
          :key="em.id"
          :class="[
            'w-full rounded-2xl px-7 py-6 text-left flex items-center gap-3',
            'border-2 transition-all duration-150',
            'hover:scale-[1.02] hover:brightness-[1.03] active:scale-[0.99]',
            'group cursor-pointer',
            cardBg(), cardBorder(),
          ]"
          :data-testid="`select-emergency-${em.id}`"
          @click="emit('select', em.id)"
        >
          <div class="flex-1 min-w-0">
            <div :class="['text-xl font-medium tracking-[0.01em] leading-tight', accentText()]">
              {{ em.name }}
            </div>
          </div>
          <div :class="['flex-shrink-0 transition-colors', chevronCls]">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>

        <!-- Coming soon -->
        <div :class="['border-2 border-dashed rounded-2xl px-7 py-5 text-center', comingSoonBorder]">
          <div :class="['text-sm font-medium mb-0.5', comingSoonText]">More coming soon</div>
          <div :class="['text-xs', comingSoonSub]">Cardiac Arrest · Vascular Complications · No Re-flow</div>
        </div>
      </div>
    </div>
  </div>
</template>
