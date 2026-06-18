import { buildSendThankYouEmailState } from '../lambdas/createZuoraSubscriptionTSLambda';
import { createZuoraSubscriptionStateSchema } from '../model/createZuoraSubscriptionState';
import type { SendThankYouEmailState } from '../model/sendAcquisitionEventState';
import { wrapperSchemaForState } from '../model/stateSchemas';
import guardianAdLiteJson from './fixtures/createZuoraSubscription/guardianAdLiteInput.json';
import paperJson from './fixtures/createZuoraSubscription/paperInput.json';

const createSubscriptionResponse = {
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

test('buildThankYouEmailState retains similarProductConsent setting', () => {
	const input = wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
		paperJson,
	);

	const result: SendThankYouEmailState = buildSendThankYouEmailState(
		input.state,
		createSubscriptionResponse,
		paymentSchedule,
		'AS-987654321',
	);
	expect(result.similarProductsConsent).toBe(true);
});

test('buildThankYouEmailState handles missing similarProductConsent setting', () => {
	const input = wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
		guardianAdLiteJson,
	);
	const result: SendThankYouEmailState = buildSendThankYouEmailState(
		input.state,
		createSubscriptionResponse,
		paymentSchedule,
		'AS-987654321',
	);
	expect(result.similarProductsConsent).toBeUndefined();
});
