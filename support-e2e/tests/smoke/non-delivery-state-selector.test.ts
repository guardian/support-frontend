import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { setTestCookies } from '../utils/cookies';

afterEachTasks(test);

const countryGroupsWithStates = ['us', 'au', 'ca'];
const nonDeliveryProducts = [
	{ product: 'SupporterPlus', ratePlan: 'Monthly' },
	{ product: 'Contribution', ratePlan: 'Monthly', contribution: 10 },
];

/** We require state for non-deliverable products as we use different taxes within those regions upstream */
countryGroupsWithStates.forEach((internationalisationId) => {
	nonDeliveryProducts.forEach(({ product, ratePlan, contribution }) => {
		test(`${internationalisationId} has a required state selector for a non-delivery ${product}`, async ({
			context,
			baseURL,
		}) => {
			const page = await context.newPage();
			const domain = new URL(baseURL ?? 'support.theguardian.com').hostname;
			await setTestCookies(context, 'SupportPostDeployTestF', domain);
			await page.goto(
				`/${internationalisationId}/checkout?product=${product}&ratePlan=${ratePlan}${
					contribution ? `&contribution=${contribution}` : ''
				}`,
			);
			await page.getByLabel('State').isVisible();
			await page
				.getByRole('button', {
					name: `Pay`,
				})
				.click();

			await page
				.getByRole('alert', {
					name: 'Please enter a state, province or territory.',
				})
				.isVisible();
		});
	});
});
