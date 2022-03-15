import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { renderError } from 'helpers/rendering/render';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import type { CommonState } from './commonState/state';
import { initialCommonState } from './commonState/state';
import { getInitialState } from './utils/setup';

const subscriptionsPageReducer = createCheckoutReducer(
	initialCommonState.internationalisation.countryId,
	'DigitalPack',
	'Monthly',
	null,
	null,
	null,
);

export type SubscriptionsReducer = typeof subscriptionsPageReducer;

const baseReducer = {
	common: commonReducer,
	page: subscriptionsPageReducer,
};

export const subscriptionsStore = configureStore({
	reducer: baseReducer,
});

export function addPageReducer(newReducer?: SubscriptionsReducer): void {
	if (!newReducer) return;
	subscriptionsStore.replaceReducer(
		combineReducers({
			...baseReducer,
			page: newReducer,
		}),
	);
}

export function initReduxForSubscriptions(
	pageReducer?: (initialState: CommonState) => SubscriptionsReducer,
): typeof subscriptionsStore {
	try {
		const initialState = getInitialState();

		addPageReducer(pageReducer?.(initialState));

		subscriptionsStore.dispatch(setInitialCommonState(initialState));

		return subscriptionsStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;

export type SubscriptionsDispatch = typeof subscriptionsStore.dispatch;
