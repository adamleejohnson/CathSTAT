import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './composables/**/*.{vue,ts}',
    './pages/**/*.{vue,ts}',
    './app.vue',
    './layouts/**/*.{vue,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue', 'Roboto', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
} satisfies Config
