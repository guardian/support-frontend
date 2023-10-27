import { defineConfig } from "@playwright/test";
import { baseObject } from "./playwright.base.config";

export default defineConfig({
  ...baseObject,
  fullyParallel: true,//To prevent tests from running parallel while testing locally change this to false
  retries: process.env.CI ? 2 : 2,
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    baseURL: "https://support.thegulocal.com",//To use CODE replace this with- https://support.code.dev-theguardian.com/
  },
});
