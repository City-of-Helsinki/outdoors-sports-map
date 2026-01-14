import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/vitest.setup.ts'],
        env: {
          ...config({ path: '.env.test' }).parsed,
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