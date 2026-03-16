<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDarkModePreference } from '../composables/useDarkModePreference'

const { isDark, toggleDark } = useDarkModePreference()
const router = useRouter()

function handleSelectEmergency(id: string) {
  router.push(`/${id}`)
}
</script>

<template>
  <div :class="isDark ? 'dark' : ''">
    <LandingPage
      :is-dark="isDark"
      @select="handleSelectEmergency"
      @toggle-dark="toggleDark"
    />
  </div>
</template>
