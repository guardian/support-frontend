import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import {
	fillInCardDetails,
	fillInDeclinedCardDetails,
} from '../utils/cardDetails';
import { setupPage } from '../utils/page';
import { fillInPayPalDetails } from '../utils/paypal';
import { checkRecaptcha } from '../utils/recaptcha';
import { setTestUserCoreDetails } from '../utils/testUserDetails';
import { email } from '../utils/users';

type TestDetails = {
	paymentType: string;
	internationalisationId: string;
	maxAmount: number;
};

const submitForm = (page: Page) =>
	page
		.getByRole('button', {
			name: ` with `,
		})
		.click();

const enterOtherAmount = async (page: Page, amount: number) => {
	// The radio input is covered by its label, so click the label instead
	await page.locator('label[for="amount-other"]').click();
	const otherAmount = page.locator('#otherAmount');
	await otherAmount.fill(amount.toString());
	await otherAmount.blur(); // validation runs on blur
};

export const testOneTimeCheckout = (testDetails: TestDetails) => {
	const { internationalisationId, paymentType, maxAmount } = testDetails;
	test(`OneTime with ${paymentType} in ${internationalisationId}`, async ({
		context,
		baseURL,
	}) => {
		// Temporary, assumes confirm email required
		const url = `/${internationalisationId}/one-time-checkout`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, url);
		await setTestUserCoreDetails(page, email());
		await page.getByRole('radio', { name: paymentType }).check();

		// one-time max for country, see ONE_OFF in support-frontend/assets/helpers/contributions.ts
		const maxAmountMessage = `Please enter an amount between 1 and ${maxAmount}.`;

		// Fill in an amount above the maximum to trigger the range error
		await enterOtherAmount(page, maxAmount + 1);
		await expect(page.getByText(maxAmountMessage)).toBeVisible();

		// Fill in the maximum amount to ensure the error disappears
		await enterOtherAmount(page, maxAmount);
		await expect(page.getByText(maxAmountMessage)).toBeHidden();

		if (paymentType === 'Credit/Debit card') {
			// First check that a failed card payment behaves as expected
			await fillInDeclinedCardDetails(page);
			await checkRecaptcha(page);

			await submitForm(page);

			await expect(page.getByText('Sorry, something went wrong')).toBeVisible({
				timeout: 30000,
			});

			// Now fill in with good card details
			await fillInCardDetails(page);
			await checkRecaptcha(page);
		}

		await submitForm(page);

		if (paymentType === 'PayPal') {
			await expect(page).toHaveURL(/.*paypal.com/, { timeout: 600000 });

			// Force the PayPal checkout page locale so tests aren't affected by geo/browser locale detection
			const forcedLocaleUrl = new URL(page.url());
			forcedLocaleUrl.searchParams.set('locale.x', 'en_GB');
			await page.goto(forcedLocaleUrl.toString());

			await fillInPayPalDetails(page);
		}

		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});
	});
};
