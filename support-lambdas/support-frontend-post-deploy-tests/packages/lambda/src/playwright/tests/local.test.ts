import { test, expect } from '@playwright/test';

const userName = 'asdfasdfdsaf';
// const userLastName = 'dfgslksdfgkjbsdf';
// const userEmail = 'asdfa@example.com';

test.beforeEach(async ({ page, context }) => {
  const pageUrl = 'https://support.thegulocal.com/uk/contribute';
  context.addCookies([
    { name: 'pre-signin-test-user', value: userName, url: pageUrl },
    { name: '_test_username', value: userName, url: pageUrl },
    { name: '_post_deploy_user', value: 'true', url: pageUrl },
    { name: 'GU_TK', value: '1.1', url: pageUrl },
  ]);
  await page.goto(pageUrl);
});

test.describe(
  'Sign up for a Recurring Contribution (New Contributions Flow)',
  () => {
    test('Monthly contribution sign-up with Stripe - GBP - step 1', async ({
                                                                             page,
                                                                           }) => {
      const contributeButton =
        '#qa-contributions-landing-submit-contribution-button';

      await expect(page.url()).toContain('/contribute');

      await expect(page.locator(contributeButton)).toBeVisible();
    });

  },
);
