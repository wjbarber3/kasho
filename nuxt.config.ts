import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', '@primevue/nuxt-module'],
  fonts: {
    families: [
      // Optional: specify families and weights for better control
      { name: 'Rethink Sans', weights: [400, 700] },
      { name: 'Geist', weights: [400, 700] },
    ]
    // Other configuration options can be found in the documentation
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
})