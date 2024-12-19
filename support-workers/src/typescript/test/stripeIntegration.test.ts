/**
 * @group integration
 */

import { getStripeConfig } from '../services/stripe';

test('Stripe config', async () => {
	const result = await getStripeConfig('CODE');
	expect(result.apiVersion).toBe('2019-08-14');
});
