import Aura from '@primeuix/themes/aura'
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['./app/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/fonts', '@primevue/nuxt-module', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  fonts: {
    families: [
      // Optional: specify families and weights for better control
      { name: 'Rethink Sans', weights: [400, 500, 600, 700], display: 'swap' },
      { name: 'Geist', weights: [400, 500, 600, 700], display: 'swap' },
    ]
    // Other configuration options can be found in the documentation
  },
  site: {
    url: 'https://www.jrdnbrbr.com',
    name: 'Jordan Barber Portfolio'
  },
  sitemap: {
    autoLastmod: true,
    discoverImages: true
  },
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: ['/']
      }
    ],
    sitemap: 'https://www.jrdnbrbr.com/sitemap.xml'
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