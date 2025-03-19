// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Add SSR configuration to help with hydration
  ssr: true,
  
  // Add experimental features to help with hydration
  experimental: {
    renderJsonPayloads: false,
    payloadExtraction: false
  },

  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  
  build: {
    transpile: ['vuetify'],
  },
  
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  typescript: {
    strict: false,
    typeCheck: false
  }
})