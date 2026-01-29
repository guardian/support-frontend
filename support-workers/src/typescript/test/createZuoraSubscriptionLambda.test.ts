import { buildSendThankYouEmailState } from '../lambdas/createZuoraSubscriptionTSLambda';
import { createZuoraSubscriptionStateSchema } from '../model/createZuoraSubscriptionState';
import type { SendThankYouEmailState } from '../model/sendAcquisitionEventState';
import { wrapperSchemaForState } from '../model/stateSchemas';
import paperJson from './fixtures/createZuoraSubscription/paperInput.json';

test('buildThankYouEmailState retains similarProductConsent setting', () => {
	const input = wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
		paperJson,
	);

	const createResponse = {
		orderNumber: '12345',
		accountNumber: '67890',
		subscriptionNumbers: ['sub1', 'sub2'],
		invoiceNumbers: ['inv1', 'inv2'],
		paymentNumber: 'pay1',
		paidAmount: 49.99,
	};

	const paymentSchedule = {
		payments: [
			{
				date: new Date(),
				amount: 49.99,
			},
		],
	};

	const result: SendThankYouEmailState = buildSendThankYouEmailState(
		input.state,
		createResponse,
		paymentSchedule,
		'AS-987654321',
	);
	expect(result.similarProductsConsent).toBe(true);
});
