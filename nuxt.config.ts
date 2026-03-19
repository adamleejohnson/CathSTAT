// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Cath Lab Emergency — Cognitive Aid',
      meta: [
        { name: 'description', content: 'Interactive emergency cognitive aid for cath lab procedures. Checklists for coronary perforation, cardiogenic shock, and more.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/coronary-perforation', '/shock'],
    },
  },
})
