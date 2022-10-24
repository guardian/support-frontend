import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	getInitialAddressFieldsState,
	initialPostcodeFinderState,
} from 'helpers/redux/checkout/address/state';
import { initialCsrfState } from 'helpers/redux/checkout/csrf/state';
import { initialMarketingConsentState } from 'helpers/redux/checkout/marketingConsent/state';
import { initialAmazonPayState } from 'helpers/redux/checkout/payment/amazonPay/state';
import { initialDirectDebitState } from 'helpers/redux/checkout/payment/directDebit/state';
import { initialPaymentMethodState } from 'helpers/redux/checkout/payment/paymentMethod/reducer';
import { initialPaymentRequestButtonState } from 'helpers/redux/checkout/payment/paymentRequestButton/state';
import { initialPayPalState } from 'helpers/redux/checkout/payment/payPal/state';
import { initialSepaState } from 'helpers/redux/checkout/payment/sepa/state';
import { initialStripeCardState } from 'helpers/redux/checkout/payment/stripe/state';
import { initialStripeAccountDetailsState } from 'helpers/redux/checkout/payment/stripeAccountDetails/state';
import { initialPersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import { initialProductState } from 'helpers/redux/checkout/product/state';
import { initialRecaptchaState } from 'helpers/redux/checkout/recaptcha/state';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import { initialCommonState } from 'helpers/redux/commonState/state';
import type {
	ContributionsStartListening,
	ContributionsState,
	ContributionsStore,
} from 'helpers/redux/contributionsStore';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { debugReducer, initialDebugState } from 'helpers/redux/debug/reducer';
import type {
	SubscriptionsStartListening,
	SubscriptionsState,
	SubscriptionsStore,
} from 'helpers/redux/subscriptionsStore';
import { initReduxForSubscriptions } from 'helpers/redux/subscriptionsStore';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { DateYMDString } from 'helpers/types/DateString';
import { initialUserState } from 'helpers/user/userReducer';
import {
	initialFormState,
	initReducer,
} from 'pages/contributions-landing/contributionsLandingReducer';

export const initialContributionsTestStoreState: ContributionsState = {
	common: initialCommonState,
	page: {
		form: initialFormState,
		checkoutForm: {
			personalDetails: initialPersonalDetailsState,
			product: initialProductState,
			marketingConsent: initialMarketingConsentState,
			csrf: initialCsrfState,
			recaptcha: initialRecaptchaState,
			payment: {
				paymentMethod: initialPaymentMethodState,
				directDebit: initialDirectDebitState,
				amazonPay: initialAmazonPayState,
				sepa: initialSepaState,
				payPal: initialPayPalState,
				stripe: initialStripeCardState,
				stripeAccountDetails: initialStripeAccountDetailsState,
				paymentRequestButton: initialPaymentRequestButtonState,
			},
			billingAddress: {
				fields: getInitialAddressFieldsState(),
				postcode: initialPostcodeFinderState,
			},
		},
		user: initialUserState,
	},
	debug: initialDebugState,
};

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
