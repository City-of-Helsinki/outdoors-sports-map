// eslint-disable-next-line import/no-unresolved
import { defineConfig, mergeConfig } from 'vitest/config';
import { config } from 'dotenv';
import { resolve } from 'path';

import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/vitest.setup.ts',
        reporters: ['verbose'],
        env: {
          ...config({ path: '.env.test' }).parsed,
        },
        coverage: {
          provider: 'v8',
          reporter: ['lcov', 'text'],
          include: ['src/**/*'],
          exclude: [
            '**/*.d.ts',
            '**/.DS_Store',
            '**/*.css',
            '**/*.scss',
            '**/*.json',
            '**/types.ts',
            '**/*[Cc]onstant*.ts',
            'node_modules/',
            'build/',
            'dist/',
            'coverage/',
            'src/index.tsx',
            'src/vitest.setup.ts',
            'src/reportWebVitals.ts',
            'src/domain/app/App.tsx',
            'src/domain/app/AppRoot.tsx',
            '**/testingLibraryUtils.tsx',
            'src/domain/assets/**',
            'src/domain/i18n/**',
            'src/domain/store/**',
            '**/__tests__/**',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
          ],
        },
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
        },
      },
    })
  )
);