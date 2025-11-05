import { expect, test } from '@playwright/test';
import { fillInCardDetails } from '../utils/cardDetails';
import { forceSkipNewOnboardingExperience } from '../utils/forceSkipNewOnboardingExperience';
import { setupPage } from '../utils/page';
import { ProductTierLabel } from '../utils/products';
import { checkRecaptcha } from '../utils/recaptcha';
import { setTestUserCoreDetails } from '../utils/testUserDetails';
import { email, firstName, lastName } from '../utils/users';

/**
 * These tests are here to test that the promoCode values and associated copy
 * is propegated from landing => checkout => thank you page consistently.
 */
[
	{
		tier: 2,
		frequency: 'Monthly',
		promoCode: 'E2E_TEST_SPLUS_MONTHLY',
		expectedCardHeading: ProductTierLabel.TierTwo,
		expectedPromoText:
			/£(\d|\.)+\/month for (\d|\.) months, then £(\d|\.)+\/month/,
		expectedCheckoutTotalText: 'Was £12, now £9.60/month',
		expectedThankYouText:
			/You'll pay £(\d|\.)+\/month for the first (\d|\.)+ months, then £(\d|\.)+\/month afterwards unless you cancel\./,
		accessibleCtaText: ProductTierLabel.TierTwo,
	},
	{
		tier: 2,
		frequency: 'Annual',
		promoCode: 'E2E_TEST_SPLUS_ANNUAL',
		expectedCardHeading: ProductTierLabel.TierTwo,
		expectedPromoText:
			/£(\d|\.)+\/year for the first year, then £(\d|\.)+\/year/i,
		expectedCheckoutTotalText: /Was £(\d|\.)+, now £(\d|\.)+\/year/i,
		expectedThankYouText:
			/You'll pay £(\d|\.)+\/year for the first year, then £(\d|\.)+\/year afterwards unless you cancel\./i,
		accessibleCtaText: ProductTierLabel.TierTwo,
	},
].forEach((testDetails) => {
	test(`${testDetails.expectedCardHeading} ${testDetails.frequency} ${testDetails.promoCode}`, async ({
		context,
		baseURL,
	}) => {
		// Landing
		const page = await context.newPage();
		const testFirstName = firstName();
		const testLastName = lastName();
		const testEmail = email();

		await setupPage(
			page,
			context,
			baseURL,
			`/uk/contribute?promoCode=${testDetails.promoCode}`,
		);
		await forceSkipNewOnboardingExperience(page);
		await page.getByRole('tab').getByText(testDetails.frequency).click();

		const cardHeading = page.getByRole('heading', {
			name: testDetails.expectedCardHeading,
		});
		const card = page.locator('section').filter({ has: cardHeading });
		await expect(
			card.getByText(testDetails.expectedPromoText).first(),
		).toBeVisible();
		await page
			.getByRole('link', { name: testDetails.accessibleCtaText })
			.click();

		// Checkout
		await expect(
			page.getByText(testDetails.expectedCheckoutTotalText).first(),
		).toBeVisible();
		await setTestUserCoreDetails(
			page,
			testEmail,
			testFirstName,
			testLastName,
			true,
		);
		await page.getByRole('radio', { name: 'Credit/Debit card' }).check();
		await fillInCardDetails(page);
		await checkRecaptcha(page);
		await page
			.getByRole('button', {
				name: `Pay`,
			})
			.click();

		// Thank you
		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});

		await expect(
			page.getByText(testDetails.expectedThankYouText).first(),
		).toBeVisible({ timeout: 600000 });
	});
});
