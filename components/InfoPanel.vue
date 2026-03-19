<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { SessionState } from '~/composables/useEmergencies'

const props = defineProps<{
  session: SessionState
  isDark: boolean
}>()

const emit = defineEmits<{
  update: [updates: Partial<SessionState>]
  close: []
}>()

const bg = computed(() =>
  props.isDark ? 'bg-[hsl(216,24%,10%)] border-slate-700/80' : 'bg-slate-50 border-slate-300'
)
const textCls = computed(() => props.isDark ? 'text-slate-100' : 'text-slate-900')
const labelCls = computed(() => props.isDark ? 'text-slate-400' : 'text-slate-600')
const inputCls = computed(() =>
  props.isDark
    ? 'bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-slate-400'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-500'
)
const btnCls = computed(() =>
  props.isDark ? 'bg-slate-100 text-slate-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-slate-700'
)
const closeCls = computed(() =>
  props.isDark
    ? 'text-slate-300 hover:text-white hover:bg-slate-700/70 border-slate-600'
    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-300'
)

const fields = [
  { label: 'Patient Name', key: 'patientName' as const, placeholder: 'Enter patient name...' },
  { label: 'MRN / Patient ID', key: 'patientMRN' as const, placeholder: 'Enter MRN...' },
  { label: 'Staff / Team', key: 'staffNames' as const, placeholder: 'Attending, Fellow, Scrub Tech, RN...' },
]
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      :class="[bg, 'border rounded-none p-6 w-full max-w-lg mx-4']"
      @click.stop
    >
      <div class="flex items-center justify-between mb-5 pb-3 border-b" :class="props.isDark ? 'border-slate-700' : 'border-slate-300'">
        <h2 :class="['text-lg font-bold tracking-[0.02em]', textCls]">Session Info</h2>
        <button
          :class="['p-2 border rounded-none transition-colors', closeCls]"
          data-testid="close-info-panel"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="field in fields" :key="field.key">
          <label :class="['block text-xs font-medium uppercase tracking-widest mb-2', labelCls]">
            {{ field.label }}
          </label>
          <input
            type="text"
            :value="session[field.key]"
            :placeholder="field.placeholder"
            :class="['w-full border rounded-none px-4 py-3 text-base focus:outline-none transition-colors', inputCls]"
            :data-testid="`input-${field.key}`"
            @input="emit('update', { [field.key]: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div>
          <label :class="['block text-xs font-medium uppercase tracking-widest mb-2', labelCls]">Notes</label>
          <textarea
            :value="session.notes"
            placeholder="Clinical notes, interventions, timing..."
            rows="4"
            :class="['w-full border rounded-none px-4 py-3 text-base focus:outline-none transition-colors resize-none', inputCls]"
            data-testid="input-notes"
            @input="emit('update', { notes: ($event.target as HTMLTextAreaElement).value })"
          />
        </div>
      </div>

      <button
        :class="['mt-5 w-full border font-semibold text-base py-3 rounded-none transition-colors border-transparent', btnCls]"
        data-testid="save-info"
        @click="emit('close')"
      >
        Save & Close
      </button>
    </div>
  </div>
</template>
