import Aura from '@primeuix/themes/aura'
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/fonts', '@primevue/nuxt-module'],
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
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark',
        }
      }
    }
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
})