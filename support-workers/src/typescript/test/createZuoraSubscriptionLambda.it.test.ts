/**
 * @group integration
 */

import { RetryError, RetryErrorType } from '../errors/retryError';
import { handler } from '../lambdas/createZuoraSubscriptionTSLambda';
import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import type { WrappedState } from '../model/stateSchemas';
import json from './fixtures/createZuoraSubscription/transactionDeclinedInput.json';

describe('createZuoraSubscriptionLambda integration', () => {
	test('we handle a transaction declined error from Stripe appropriately', async () => {
		try {
			await handler(json as WrappedState<CreateZuoraSubscriptionState>);
			fail('Expected handler to throw');
		} catch (error) {
			if (error instanceof RetryError) {
				expect(error.name).toBe(RetryErrorType.RetryNone);
				expect(error.message).toContain('Transaction declined');
			} else {
				fail('Error is not an instance of RetryError');
			}
		}
	}, 20000);
});
