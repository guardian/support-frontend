import { expect, test } from '@playwright/test';
import { fillInCardDetails } from '../utils/cardDetails';
import { fillInDirectDebitDetails } from '../utils/directDebitDetails';
import { forceSkipNewOnboardingExperience } from '../utils/forceSkipNewOnboardingExperience';
import { setupPage } from '../utils/page';
import { ProductTierLabel } from '../utils/products';
import { checkRecaptcha } from '../utils/recaptcha';
import { setTestUserCoreDetails } from '../utils/testUserDetails';
import { email, firstName, lastName } from '../utils/users';

[
	{
		country: 'uk',
		state: undefined,
		paymentMethod: 'DirectDebit',
		product: 'SupporterPlus',
		ratePlan: 'OneYearStudent',
		priceDescriptionFormat: /[£](\d|\.)+\/year/,
		expectedCardHeading: ProductTierLabel.TierTwo,
		expectedCheckoutText:
			'If you cancel within the first 14 days, you will receive a full refund.',
		accessibleCtaText: 'Subscribe',
	},
	{
		country: 'us',
		state: 'California',
		stateLabel: 'State',
		zipCode: '90210',
		zipCodeLabel: 'ZIP code',
		paymentMethod: 'Card',
		product: 'SupporterPlus',
		ratePlan: 'OneYearStudent',
		priceDescriptionFormat: /[$](\d|\.)+\/year/,
		expectedCardHeading: ProductTierLabel.TierTwo,
		expectedCheckoutText:
			'If you cancel within the first 14 days, you will receive a full refund.',
		accessibleCtaText: 'Subscribe',
	},
	{
		country: 'ca',
		state: 'Ontario',
		stateLabel: 'Province',
		paymentMethod: 'Card',
		product: 'SupporterPlus',
		ratePlan: 'OneYearStudent',
		priceDescriptionFormat: /[$](\d|\.)+\/year/,
		expectedCardHeading: ProductTierLabel.TierTwo,
		expectedCheckoutText:
			'If you cancel within the first 14 days, you will receive a full refund.',
		accessibleCtaText: 'Subscribe',
	},
].forEach((testDetails) => {
	test(`${testDetails.expectedCardHeading} Landing Page for ${testDetails.country}`, async ({
		context,
		baseURL,
	}) => {
		// Landing
		const page = await context.newPage();

		await setupPage(page, context, baseURL, `/${testDetails.country}/student`);

		const cardHeading = page.getByRole('heading', {
			name: testDetails.expectedCardHeading,
		});
		const card = page.locator('section').filter({ has: cardHeading });
		await expect(
			card.getByText(testDetails.priceDescriptionFormat).first(),
		).toBeVisible();

		// Click through to the checkout
		const purchaseButton = page.getByText(testDetails.accessibleCtaText);
		await purchaseButton.click();

		await page.waitForURL('https://www.studentbeans.com/**');
		const studentBeansCardHeader = new RegExp(
			`${testDetails.expectedCardHeading} subscription - ` +
				testDetails.priceDescriptionFormat.source,
		);
		await expect(page.getByText(studentBeansCardHeader)).toBeVisible();
	});

	test(`${testDetails.expectedCardHeading} checkout for ${testDetails.country}`, async ({
		context,
		baseURL,
	}) => {
		// Landing
		const page = await context.newPage();

		await setupPage(
			page,
			context,
			baseURL,
			`/${testDetails.country}/checkout?product=${testDetails.product}&ratePlan=${testDetails.ratePlan}`,
		);

		await forceSkipNewOnboardingExperience(page);

		// Checkout
		const testFirstName = firstName();
		const testLastName = lastName();
		const testEmail = email();
		await expect(
			page.getByText(testDetails.expectedCheckoutText).first(),
		).toBeVisible();
		await setTestUserCoreDetails(
			page,
			testEmail,
			testFirstName,
			testLastName,
			true,
		);
		if (testDetails.state !== undefined) {
			await page
				.getByLabel(testDetails.stateLabel)
				.selectOption({ label: testDetails.state });
		}
		if (testDetails.zipCode !== undefined) {
			await page.getByLabel(testDetails.zipCodeLabel).fill(testDetails.zipCode);
		}
		if (testDetails.paymentMethod === 'DirectDebit') {
			await page.getByRole('radio', { name: 'Direct Debit' }).check();
			await fillInDirectDebitDetails(page);
		} else {
			await page.getByRole('radio', { name: 'Credit/Debit card' }).check();
			await fillInCardDetails(page);
		}

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
			page.getByText(`Thank you for supporting us`).first(),
		).toBeVisible({
			timeout: 600000,
		});
	});
});
