import { test, expect } from '@playwright/test';

const userName = 'asdfasdfdsaf';
const userLastName = 'dfgslksdfgkjbsdf';
const userEmail = 'asdfa@example.com';

let page;

test.beforeEach(async ({ browser }) => {
	const pageUrl = 'https://support.thegulocal.com/uk/contribute';

	const browserContext = await browser.newContext();
	await browserContext.addCookies([
		{ name: 'pre-signin-test-user', value: userName, url: pageUrl },
		{ name: '_test_username', value: userName, url: pageUrl },
		{ name: '_post_deploy_user', value: 'true', url: pageUrl },
		{ name: 'GU_TK', value: '1.1', url: pageUrl },
	]);
  
page = await browser.newPage();
await page.goto(pageUrl);

  
});

test.describe(
	'Sign up for a Recurring Contribution (New Contributions Flow)',
	() => {
		test('Monthly contribution sign-up with Stripe - GBP - step 1', async () => {
			const contributeButton =
				'#qa-contributions-landing-submit-contribution-button';

			await expect(page.url()).toContain('/contribute');

			await expect(page.locator(contributeButton)).toBeVisible();
		});
    // test('Monthly contribution sign-up with Stripe - GBP - step 2', async ({page}) => {
    //   const monthlyTab = '#MONTHLY';
    //   await page.locator(monthlyTab).click();
      
    //   const userNameInput = '#name';
    //   await page.locator(userNameInput).type(userName);

    // })
	},
);
//

// import { test, expect } from '@playwright/test';

// test('Sign up for a Recurring Contribution (New Contributions Flow) - Monthly contribution sign-up with Stripe - GBP', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });
