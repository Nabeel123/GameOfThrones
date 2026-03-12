import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Ensure React dev build is used in tests (required for act() support)
process.env['NODE_ENV'] = 'test'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'e2e', 'dist'],
    setupFiles: ['./src/utils/testSetup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      include: ['src/**'],
      exclude: [
        'node_modules/',
        '**/.claude/**',
        'src/utils/testSetup.ts',
        'src/utils/testUtils.tsx',
        'src/utils/hookTestWrapper.tsx',
        'src/main.tsx',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        'e2e/',
        'dist/',
        'src/types/',
        'src/__tests__/**',
      ],
    },
  },
})
