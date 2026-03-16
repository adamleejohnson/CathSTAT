<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { EMERGENCIES } from '~/composables/useEmergencies'

const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  toggleDark: []
}>()

const bg = computed(() => props.isDark ? 'bg-[hsl(222,47%,8%)]' : 'bg-[#eef0f3]')
const headerText = computed(() => props.isDark ? 'text-blue-400/80' : 'text-blue-600/80')
const subText = computed(() => props.isDark ? 'text-white/35' : 'text-gray-400')
const toggleCls = computed(() =>
  props.isDark
    ? 'text-white/40 hover:text-white/70 hover:bg-white/8 border-white/10'
    : 'text-gray-400 hover:text-gray-600 hover:bg-black/5 border-gray-200'
)
const footerCls = computed(() => props.isDark ? 'text-white/15 hover:text-white/30' : 'text-gray-300 hover:text-gray-400')
const comingSoonBorder = computed(() => props.isDark ? 'border-white/10' : 'border-gray-200')
const comingSoonText = computed(() => props.isDark ? 'text-white/25' : 'text-gray-400')
const comingSoonSub = computed(() => props.isDark ? 'text-white/15' : 'text-gray-300')

function cardBg(em: typeof EMERGENCIES[0]) {
  return props.isDark ? em.darkColor : em.lightColor
}
function cardBorder(em: typeof EMERGENCIES[0]) {
  return props.isDark ? em.darkBorder : em.lightBorder
}
function accentText(em: typeof EMERGENCIES[0]) {
  return props.isDark ? em.darkAccent : em.lightAccent
}
const chevronCls = computed(() =>
  props.isDark ? 'text-white/30 group-hover:text-white/60' : 'text-gray-400 group-hover:text-gray-600'
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
              stroke="hsl(210,100%,55%)"
              stroke-width="2.5"
              stroke-linejoin="round"
            />
            <polyline
              points="16,32 22,32 25,25 28,39 31,28 34,32 40,32 43,27 46,32 48,32"
              stroke="hsl(0,80%,58%)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div :class="['text-xs font-semibold uppercase tracking-[0.25em] mb-1', headerText]">
          Cath Lab Emergency
        </div>
        <p :class="['text-sm', subText]">Select an emergency type</p>
      </div>

      <!-- Cards -->
      <div class="w-full max-w-xl flex flex-col gap-4">
        <button
          v-for="em in EMERGENCIES"
          :key="em.id"
          :class="[
            'w-full rounded-2xl px-7 py-6 text-left flex items-center gap-4',
            'border-2 transition-all duration-150',
            'hover:scale-[1.02] hover:brightness-[1.03] active:scale-[0.99]',
            'group cursor-pointer',
            cardBg(em), cardBorder(em),
          ]"
          :data-testid="`select-emergency-${em.id}`"
          @click="emit('select', em.id)"
        >
          <span class="text-3xl leading-none flex-shrink-0" aria-hidden="true">{{ em.icon }}</span>
          <div class="flex-1 min-w-0">
            <div :class="['text-xl font-bold leading-tight', accentText(em)]">
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
          <div :class="['text-sm font-medium mb-0.5', comingSoonText]">More emergencies coming soon</div>
          <div :class="['text-xs', comingSoonSub]">Cardiac Arrest · STEMI · Tamponade · Vascular Complications</div>
        </div>
      </div>
    </div>

    <footer class="text-center py-4 text-xs flex-shrink-0">
      <a
        href="https://www.perplexity.ai/computer"
        target="_blank"
        rel="noopener noreferrer"
        :class="['transition-colors', footerCls]"
      >
        Created with Perplexity Computer
      </a>
    </footer>
  </div>
</template>
