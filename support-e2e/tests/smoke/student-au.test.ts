import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { checkRecaptcha } from '../utils/recaptcha';
import { fillInCardDetails } from '../utils/cardDetails';
import { setupPage } from '../utils/page';
import { setTestUserCoreDetails } from '../utils/testUserDetails';
import { forceSkipNewOnboardingExperience } from '../utils/forceSkipNewOnboardingExperience';
import { tierTwoProductLabel } from '../utils/products';

[
	{
		frequency: 'Monthly',
		promoCode: 'UTS_STUDENT',
		expectedCardHeading: tierTwoProductLabel,
		expectedPromoText: '$0/month for two years, then $20/month',
		expectedCheckoutTotalText: 'Was $20, now $0/month',
		accessibleCtaText: 'Sign up for free',
		expectedThankYouText:
			"You'll pay $0/month for the first 24 months, then $20/month afterwards unless you cancel",
	},
].forEach((testDetails) => {
	test(`${testDetails.expectedCardHeading} ${testDetails.frequency} ${testDetails.promoCode} Promo`, async ({
		context,
		baseURL,
	}) => {
		// Landing
		const page = await context.newPage();

		await setupPage(
			page,
			context,
			baseURL,
			`/au/student/UTS?promoCode=${testDetails.promoCode}`,
		);

		await forceSkipNewOnboardingExperience(page);

		const cardHeading = page.getByRole('heading', {
			name: testDetails.expectedCardHeading,
		});
		const card = page.locator('section').filter({ has: cardHeading });
		await expect(
			card.getByText(testDetails.expectedPromoText).first(),
		).toBeVisible();

		// Click through to the checkout
		const purchaseButton = await page.getByText(testDetails.accessibleCtaText);
		await purchaseButton.click();

		// Checkout
		const testFirstName = firstName();
		const testLastName = lastName();
		const testEmail = email();
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
		await page.getByLabel('State').selectOption({ label: 'New South Wales' });
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
