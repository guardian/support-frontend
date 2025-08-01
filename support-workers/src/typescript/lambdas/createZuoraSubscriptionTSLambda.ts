import { ZuoraClient } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraClient';
import type { ZuoraSubscription } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraSchemas';
import { zuoraSubscriptionResponseSchema } from '@guardian/support-service-lambdas/modules/zuora/src/zuoraSchemas';
import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import { asRetryError } from '../util/errorHandler';
import { getProductCatalogFromApi } from '@guardian/support-service-lambdas/modules/product-catalog/src/api';

const stage = stageFromEnvironment();

const zuoraServiceProvider = new ServiceProvider(stage, async (stage) => {
	return ZuoraClient.create(stage);
});

const productCatalogProvider = new ServiceProvider(stage, async (stage) => {
	return getProductCatalogFromApi(stage);
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

const createSubscription = async (
	state: CreateZuoraSubscriptionState,
): Promise<WrappedState<CreateZuoraSubscriptionState>> => {
	const zuoraClient = await zuoraServiceProvider.getServiceForUser(
		state.user.isTestUser,
	);
	const path = `v1/subscriptions`;
	const subscription: ZuoraSubscription = await zuoraClient.post(
		path,
		state,
		zuoraSubscriptionResponseSchema,
	);
	console.info(`Subscription created: ${JSON.stringify(subscription)}`);
	return {
		type: 'success',
		state: {
			...state,
			subscriptionId: subscription.id,
		},
	};
};
