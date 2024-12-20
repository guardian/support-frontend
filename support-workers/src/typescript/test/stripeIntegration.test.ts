/**
 * @group integration
 */

import { getStripeConfig } from '../services/stripe';

test('Stripe config', async () => {
	const result = await getStripeConfig('CODE');
	expect(result.accounts.defaultAccount.paymentGateway).toBe(
		'Stripe PaymentIntents GNM Membership',
	);
});
