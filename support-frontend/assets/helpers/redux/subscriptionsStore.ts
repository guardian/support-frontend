import type { TypedStartListening } from '@reduxjs/toolkit';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { renderError } from 'helpers/rendering/render';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { DateYMDString } from 'helpers/types/DateString';
import { addAddressSideEffects } from './checkout/address/sideEffects';
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
import { getInitialState } from './utils/setup';

const subscriptionsPageReducer = createReducer();

export type SubscriptionsReducer = typeof subscriptionsPageReducer;

const baseReducer = {
	common: commonReducer,
	page: subscriptionsPageReducer,
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
): SubscriptionsStore {
	try {
		addPersonalDetailsSideEffects(startSubscriptionsListening);
		addAddressSideEffects(startSubscriptionsListening);
		addPaymentsSideEffects(startSubscriptionsListening);
		const initialState = getInitialState();

		subscriptionsStore.dispatch(setInitialCommonState(initialState));
		subscriptionsStore.dispatch(setProductType(product));
		subscriptionsStore.dispatch(setBillingPeriod(initialBillingPeriod));

		startDate && subscriptionsStore.dispatch(setStartDate(startDate));
		productOption &&
			subscriptionsStore.dispatch(setProductOption(productOption));
		getFulfilmentOptionForCountry &&
			subscriptionsStore.dispatch(
				setFulfilmentOption(
					getFulfilmentOptionForCountry(
						initialState.internationalisation.countryId,
					),
				),
			);

		return subscriptionsStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;

export type SubscriptionsDispatch = typeof subscriptionsStore.dispatch;

export const useSubsDispatch: () => SubscriptionsDispatch = useDispatch;
export const useSubsSelector: TypedUseSelectorHook<SubscriptionsState> =
	useSelector;
