// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  ssr: false,
  app: {
    buildAssetsDir: '/assets/',
    head: {
      title: 'Cath Lab Emergency — Cognitive Aid',
      meta: [
        { name: 'description', content: 'Interactive emergency cognitive aid for cath lab procedures. Checklists for coronary perforation, cardiogenic shock, and more.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap' },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/coronary-perforation', '/shock'],
    },
  },
})
