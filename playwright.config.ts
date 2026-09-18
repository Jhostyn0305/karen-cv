import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: { baseURL: 'http://localhost:4321', browserName: 'chromium', channel: 'msedge', headless: true },
  reporter: 'list',
});
