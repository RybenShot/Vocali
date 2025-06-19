export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/test-utils',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    speechmaticsApiKey: process.env.SPEECHMATICS_API_KEY,
    public: {}
  },

  // Para desarrollo local con HTTPS (necesario para micrófono)
  //devServer: {
  //  https: process.env.NODE_ENV === 'development' ? {
  //    key: './server.key',
  //    cert: './server.crt'
  //  } : undefined
  //},
})