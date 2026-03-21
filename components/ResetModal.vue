<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const bg = computed(() =>
  props.isDark ? 'bg-[hsl(216,24%,10%)] border-red-700/70' : 'bg-slate-50 border-red-300'
)
const textCls = computed(() => props.isDark ? 'text-slate-100' : 'text-slate-900')
const subCls = computed(() => props.isDark ? 'text-slate-300' : 'text-slate-600')
const cancelCls = computed(() =>
  props.isDark
    ? 'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/70'
    : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
)
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('cancel')"
  >
    <div
      :class="[bg, 'border rounded-none p-7 w-full max-w-sm mx-4 text-center']"
      @click.stop
    >
      <AlertTriangle :size="34" class="text-red-600 mx-auto mb-4" />
      <h2 :class="['text-lg font-bold mb-2', textCls]">Reset the checklist?</h2>
      <p :class="['text-sm mb-6', subCls]">This action cannot be undone. Export the log first if needed.</p>
      <div class="flex gap-3">
        <button
          :class="['flex-1 py-3 rounded-none border transition-colors font-semibold', cancelCls]"
          data-testid="reset-cancel"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="flex-1 py-3 rounded-none border border-red-700 bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors"
          data-testid="reset-confirm"
          @click="emit('confirm')"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
