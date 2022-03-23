import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { renderError } from 'helpers/rendering/render';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import type { CommonState } from './commonState/state';
import { initialCommonState } from './commonState/state';
import { getInitialState } from './utils/setup';

const subscriptionsPageReducer = createWithDeliveryCheckoutReducer(
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

const subscriptionsStore = configureStore({
	reducer: baseReducer,
});

export type SubscriptionsStore = typeof subscriptionsStore;

export function addPageReducer(
	newReducer?: SubscriptionsReducer,
): SubscriptionsStore {
	return configureStore({
		reducer: {
			common: commonReducer,
			page: newReducer ?? subscriptionsPageReducer,
		},
	});
}

export function initReduxForSubscriptions(
	pageReducer?: (initialState: CommonState) => SubscriptionsReducer,
): SubscriptionsStore {
	try {
		const initialState = getInitialState();
		const newStore = addPageReducer(pageReducer?.(initialState));
		newStore.dispatch(setInitialCommonState(initialState));

		return newStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;

export type SubscriptionsDispatch = typeof subscriptionsStore.dispatch;
