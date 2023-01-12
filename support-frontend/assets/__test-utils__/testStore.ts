import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type {
	ContributionsStartListening,
	ContributionsState,
	ContributionsStore,
} from 'helpers/redux/contributionsStore';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { debugReducer } from 'helpers/redux/debug/reducer';
import type {
	SubscriptionsStartListening,
	SubscriptionsState,
	SubscriptionsStore,
} from 'helpers/redux/subscriptionsStore';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { DateYMDString } from 'helpers/types/DateString';
import { initReducer } from 'pages/supporter-plus-landing/setup/legacyReducer';

export function createTestStoreForSubscriptions(
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate?: DateYMDString,
	productOption?: ProductOptions,
	getFulfilmentOptionForCountry?: (country: string) => FulfilmentOptions,
	initialState?: SubscriptionsState,
): SubscriptionsStore {
	const subscriptionsPageReducer = createReducer();

	const baseReducer = {
		common: commonReducer,
		page: subscriptionsPageReducer,
		debug: debugReducer,
	};

	const listenerMiddleware = createListenerMiddleware();

	const testStartListening =
		listenerMiddleware.startListening as SubscriptionsStartListening;

	const testSubscriptionsStore = configureStore({
		reducer: baseReducer,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				// Disabling middleware to improve test performance
				immutableCheck: false,
				serializableCheck: false,
			}).prepend(listenerMiddleware.middleware),
	});

	return initReduxForSubscriptions(
		product,
		initialBillingPeriod,
		startDate,
		productOption,
		getFulfilmentOptionForCountry,
		testSubscriptionsStore,
		testStartListening,
	);
}

export function createTestStoreForContributions(
	initialState?: ContributionsState,
): ContributionsStore {
	const baseReducer = {
		common: commonReducer,
		page: initReducer(),
		debug: debugReducer,
	};

	const listenerMiddleware = createListenerMiddleware();

	const testStartListening =
		listenerMiddleware.startListening as ContributionsStartListening;

	const testContributionsStore = configureStore({
		reducer: baseReducer,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				// Disabling middleware to improve test performance
				immutableCheck: false,
				serializableCheck: false,
			}).prepend(listenerMiddleware.middleware),
	});

	return initReduxForContributions(testContributionsStore, testStartListening);
}
