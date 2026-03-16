<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const bg = computed(() =>
  props.isDark ? 'bg-[hsl(222,40%,10%)] border-red-800/40' : 'bg-white border-red-200'
)
const textCls = computed(() => props.isDark ? 'text-white' : 'text-gray-900')
const subCls = computed(() => props.isDark ? 'text-white/40' : 'text-gray-500')
const cancelCls = computed(() =>
  props.isDark
    ? 'border-white/15 text-white/60 hover:text-white hover:bg-white/8'
    : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
)
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('cancel')"
  >
    <div
      :class="[bg, 'border rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl text-center']"
      @click.stop
    >
      <AlertTriangle :size="36" class="text-red-500 mx-auto mb-4" />
      <h2 :class="['text-lg font-bold mb-2', textCls]">Reset the checklist?</h2>
      <p :class="['text-sm mb-6', subCls]">This action cannot be undone. Export the log first if needed.</p>
      <div class="flex gap-3">
        <button
          :class="['flex-1 py-3 rounded-xl border transition-colors font-medium', cancelCls]"
          data-testid="reset-cancel"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
          data-testid="reset-confirm"
          @click="emit('confirm')"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
