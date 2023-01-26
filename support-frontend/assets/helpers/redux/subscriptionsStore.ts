import type { TypedStartListening } from '@reduxjs/toolkit';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { renderError } from 'helpers/rendering/render';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { DateYMDString } from 'helpers/types/DateString';
import { setUpUserState } from 'helpers/user/user';
import { addAddressSideEffects } from './checkout/address/subscriptionsSideEffects';
import { addPaymentsSideEffects } from './checkout/payment/subscriptionsSideEffects';
import { addPersonalDetailsSideEffects } from './checkout/personalDetails/subscriptionsSideEffects';
import {
	setBillingPeriod,
	setFulfilmentOption,
	setProductOption,
	setProductType,
	setStartDate,
} from './checkout/product/actions';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import { debugReducer } from './debug/reducer';
import { getInitialState } from './utils/setup';

const subscriptionsPageReducer = createReducer();

export type SubscriptionsReducer = typeof subscriptionsPageReducer;

const baseReducer = {
	common: commonReducer,
	page: subscriptionsPageReducer,
	debug: debugReducer,
};

// Listener middleware allows us to specify side-effects for certain actions
// https://redux-toolkit.js.org/api/createListenerMiddleware
const listenerMiddleware = createListenerMiddleware();

export type SubscriptionsStartListening = TypedStartListening<
	SubscriptionsState,
	SubscriptionsDispatch
>;

export const startSubscriptionsListening =
	listenerMiddleware.startListening as SubscriptionsStartListening;

const subscriptionsStore = configureStore({
	reducer: baseReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type SubscriptionsStore = typeof subscriptionsStore;

export function initReduxForSubscriptions(
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate?: DateYMDString,
	productOption?: ProductOptions,
	getFulfilmentOptionForCountry?: (country: string) => FulfilmentOptions,
	// Injecting the store and listener makes it possible to re-use this function for tests
	store = subscriptionsStore,
	startListening = startSubscriptionsListening,
): SubscriptionsStore {
	try {
		addPersonalDetailsSideEffects(startListening);
		addAddressSideEffects(startListening);
		addPaymentsSideEffects(startListening);
		const initialState = getInitialState();

		store.dispatch(setInitialCommonState(initialState));
		store.dispatch(setProductType(product));
		store.dispatch(setBillingPeriod(initialBillingPeriod));
		setUpUserState(store.dispatch);

		startDate && store.dispatch(setStartDate(startDate));
		productOption && store.dispatch(setProductOption(productOption));
		getFulfilmentOptionForCountry &&
			store.dispatch(
				setFulfilmentOption(
					getFulfilmentOptionForCountry(
						initialState.internationalisation.countryId,
					),
				),
			);

		return store;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;

export type SubscriptionsDispatch = typeof subscriptionsStore.dispatch;
