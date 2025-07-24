import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import type { WrappedState } from '../model/stateSchemas';
import { asRetryError } from '../util/errorHandler';

export const handler = async (
	state: WrappedState<CreateZuoraSubscriptionState>,
) => {
	try {
		console.info(`Input is ${JSON.stringify(state)}`);
		return Promise.resolve({
			...state,
			state: {},
		});
	} catch (error) {
		throw asRetryError(error);
	}
};
