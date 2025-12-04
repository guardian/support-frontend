/**
 * @group integration
 */

import { RetryError, RetryErrorType } from '../errors/retryError';
import { handler } from '../lambdas/createZuoraSubscriptionTSLambda';
import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import type { WrappedState } from '../model/stateSchemas';
import guardianWeeklyJson from './fixtures/createZuoraSubscription/guardianWeeklyInput.json';
import transactionDeclinedJson from './fixtures/createZuoraSubscription/transactionDeclinedInput.json';

const testTimeout = 20000;

describe('createZuoraSubscriptionLambda integration', () => {
	test(
		'we handle a transaction declined error from Stripe appropriately',
		async () => {
			try {
				await handler(
					transactionDeclinedJson as WrappedState<CreateZuoraSubscriptionState>,
				);
				fail('Expected handler to throw');
			} catch (error) {
				if (error instanceof RetryError) {
					expect(error.name).toBe(RetryErrorType.RetryNone);
					expect(error.message).toContain('Transaction declined');
				} else {
					fail('Error is not an instance of RetryError');
				}
			}
		},
		testTimeout,
	);
	test(
		'we encode dates correctly in the output',
		async () => {
			const input =
				guardianWeeklyJson as WrappedState<CreateZuoraSubscriptionState>;
			input.state.requestId = new Date().getTime().toString(); // Ensure unique requestId because it is used as an idempotency key
			const output = await handler(input);
			if (
				output.state.sendThankYouEmailState.productType !== 'GuardianWeekly'
			) {
				fail('Expected productType to be GuardianWeekly');
			}
			expect(output.state.sendThankYouEmailState.firstDeliveryDate).toBe(
				'2025-12-12',
			);
		},
		testTimeout,
	);
});
