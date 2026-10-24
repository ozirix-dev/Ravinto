const { defineConfig, devices } = require('@playwright/test');
const fs = require('node:fs');

const bravePath = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe';
const launchOptions = process.platform === 'win32' && fs.existsSync(bravePath)
  ? { executablePath: bravePath }
  : {};

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/Ravinto/',
    trace: 'retain-on-failure',
    launchOptions,
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'node scripts/serve-site.js',
    url: 'http://127.0.0.1:4173/Ravinto/',
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
