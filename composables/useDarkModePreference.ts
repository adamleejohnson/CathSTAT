import { ref } from 'vue'

const STORAGE_KEY = 'cathlab-dark-mode'
const isDark = ref(false)
let initialized = false

function initFromStorage() {
  if (initialized || typeof window === 'undefined') return
  isDark.value = window.localStorage.getItem(STORAGE_KEY) === '1'
  initialized = true
}

function persist(value: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
}

export function useDarkModePreference() {
  initFromStorage()

  function toggleDark() {
    isDark.value = !isDark.value
    persist(isDark.value)
  }

  return { isDark, toggleDark }
}