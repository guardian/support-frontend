import { ZuoraClient } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraClient';
import type { ZuoraSubscription } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraSchemas';
import { zuoraSubscriptionResponseSchema } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraSchemas';
import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import { asRetryError } from '../util/errorHandler';

const stage = stageFromEnvironment();

const zuoraServiceProvider = new ServiceProvider(stage, async (stage) => {
	return ZuoraClient.create(stage);
});

export const handler = async (
	state: WrappedState<CreateZuoraSubscriptionState>,
) => {
	try {
		console.info(`Input is ${JSON.stringify(state)}`);
		const zuoraClient = await zuoraServiceProvider.getServiceForUser(false);
		const path = `v1/subscriptions/A-S00737600`;
		const subscription: ZuoraSubscription = await zuoraClient.get(
			path,
			zuoraSubscriptionResponseSchema,
		);
		console.info(`Subscription retrieved: ${JSON.stringify(subscription)}`);
		return Promise.resolve({
			...state,
			state: {},
		});
	} catch (error) {
		throw asRetryError(error);
	}
};
