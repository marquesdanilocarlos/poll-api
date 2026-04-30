import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    name: 'unit',
    alias: {
      '@': './src',
      '@src': './src',
      '@test': './test',
    },
    root: './',
  },
  resolve: {
    alias: {
      '@': './src',
      '@src': './src',
      '@test': './test',
    },
  },
  plugins: [swc.vite()],
})
