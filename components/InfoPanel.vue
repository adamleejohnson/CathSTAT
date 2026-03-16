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
  props.isDark ? 'bg-[hsl(222,40%,10%)] border-[hsl(220,20%,22%)]' : 'bg-white border-gray-200'
)
const textCls = computed(() => props.isDark ? 'text-white' : 'text-gray-900')
const labelCls = computed(() => props.isDark ? 'text-white/50' : 'text-gray-500')
const inputCls = computed(() =>
  props.isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-blue-500/60'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
)
const btnCls = computed(() =>
  props.isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
)
const closeCls = computed(() =>
  props.isDark
    ? 'text-white/60 hover:text-white hover:bg-white/10'
    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
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
      :class="[bg, 'border rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl']"
      @click.stop
    >
      <div class="flex items-center justify-between mb-5">
        <h2 :class="['text-lg font-semibold', textCls]">Session Info</h2>
        <button
          :class="['p-2 rounded-lg transition-colors', closeCls]"
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
            :class="['w-full border rounded-xl px-4 py-3 text-base focus:outline-none transition-all', inputCls]"
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
            :class="['w-full border rounded-xl px-4 py-3 text-base focus:outline-none transition-all resize-none', inputCls]"
            data-testid="input-notes"
            @input="emit('update', { notes: ($event.target as HTMLTextAreaElement).value })"
          />
        </div>
      </div>

      <button
        :class="['mt-5 w-full text-white font-semibold text-base py-3 rounded-xl transition-colors', btnCls]"
        data-testid="save-info"
        @click="emit('close')"
      >
        Save & Close
      </button>
    </div>
  </div>
</template>
