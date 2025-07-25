/**
 * Integration test for the ZuoraClient class.
 *
 * @group integration
 */

import { Logger } from '@guardian/support-service-lambdas/modules/zuora/src/logger';
import { ZuoraClient } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraClient';
import type { ZuoraSubscription } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraSchemas';
import { zuoraSubscriptionResponseSchema } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraSchemas';

test('We can use the Zuora client from support-service-lambdas', async () => {
	const stage = 'CODE';
	const subscriptionNumber = 'A-S00737600';
	const zuoraClient = await ZuoraClient.create(stage, new Logger());
	const path = `v1/subscriptions/${subscriptionNumber}`;
	const subscription: ZuoraSubscription = await zuoraClient.get(
		path,
		zuoraSubscriptionResponseSchema,
	);
	expect(subscription.subscriptionNumber).toBe(subscriptionNumber);
});
