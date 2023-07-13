import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    setupFiles: ['./config/vitest.setup.ts'],
    environment: 'jsdom',
  },
  // any custom vitest config you require
})