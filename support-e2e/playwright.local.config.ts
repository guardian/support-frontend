import { defineConfig } from "@playwright/test";
import { baseObject } from "./playwright.base.config";

export default defineConfig({
  ...baseObject,
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    baseURL: "https://support.thegulocal.com",
  },
});
