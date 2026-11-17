import { defineConfig } from 'vitest/config';

export const config = defineConfig({
  test: {
    include: ['apps/*/src/**/*.test.ts', 'packages/*/src/**/*.test.ts'],
    testTimeout: 10_000,
    env: { LOG_LEVEL: 'silent' },
  },
});

export default config;
