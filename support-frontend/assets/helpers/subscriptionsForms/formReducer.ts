// ----- Reducer ----- //
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	getWeeklyFulfilmentOption,
	NoFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import {
	NoProductOptions,
	paperProductsWithDigital,
	paperProductsWithoutDigital,
} from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import { removeError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { isTestUser } from 'helpers/user/user';

function createFormReducer(
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate: Option<string>,
	productOption: Option<ProductOptions>,
	fulfilmentOption: Option<FulfilmentOptions>,
) {
	const { productPrices, orderIsAGift } = window.guardian;
	const initialState: FormState = {
		stage: 'checkout',
		product,
		startDate,
		billingAddressIsSame: true,
		billingPeriod: initialBillingPeriod,
		paymentMethod: null,
		formErrors: [],
		submissionError: null,
		formSubmitted: false,
		isTestUser: isTestUser(),
		productPrices,
		productOption: productOption ?? NoProductOptions,
		fulfilmentOption: fulfilmentOption ?? NoFulfilmentOptions,
		payPalHasLoaded: false,
		orderIsAGift,
		stripePaymentMethod: null,
		deliveryInstructions: null,
		debugInfo: '',
	};

	return function (
		originalState: FormState = initialState,
		action: Action,
	): FormState {
		const state = {
			...originalState,
			debugInfo: `${originalState.debugInfo} ${JSON.stringify(action)}\n`,
		};

		switch (action.type) {
			case 'SET_STAGE':
				return { ...state, stage: action.stage };

			case 'SET_START_DATE':
				return { ...state, startDate: action.startDate };

			case 'SET_BILLING_PERIOD':
				return { ...state, billingPeriod: action.billingPeriod };

			case 'ON_DELIVERY_COUNTRY_CHANGED':
				return {
					...state,
					paymentMethod: null,
					fulfilmentOption:
						product === GuardianWeekly
							? getWeeklyFulfilmentOption(action.country)
							: state.fulfilmentOption,
				};

			case 'SET_PAYMENT_METHOD':
				return {
					...state,
					paymentMethod: action.paymentMethod,
					formErrors: removeError('paymentMethod', state.formErrors),
				};

			case 'SET_FORM_ERRORS':
				return { ...state, formErrors: action.errors };

			case 'SET_SUBMISSION_ERROR':
				return {
					...state,
					submissionError: action.error,
					formSubmitted: false,
				};

			case 'SET_FORM_SUBMITTED':
				return { ...state, formSubmitted: action.formSubmitted };

			case 'SET_BILLING_ADDRESS_IS_SAME':
				return {
					...state,
					billingAddressIsSame: action.isSame,
					formErrors: removeError('billingAddressIsSame', state.formErrors),
				};

			case 'SET_PAYPAL_HAS_LOADED':
				return { ...state, payPalHasLoaded: true };

			case 'SET_ORDER_IS_GIFT':
				return { ...state, orderIsAGift: action.orderIsAGift };

			case 'SET_STRIPE_PAYMENT_METHOD':
				return { ...state, stripePaymentMethod: action.stripePaymentMethod };

			case 'SET_DELIVERY_INSTRUCTIONS':
				return { ...state, deliveryInstructions: action.instructions };

			case 'SET_ADD_DIGITAL_SUBSCRIPTION':
				return {
					...state,
					productOption: action.addDigital
						? paperProductsWithDigital[state.productOption]
						: paperProductsWithoutDigital[state.productOption],
				};
			case 'SET_CSR_USERNAME':
				return {
					...state,
					csrUsername: action.username,
				};

			case 'SET_SALESFORCE_CASE_ID':
				return {
					...state,
					salesforceCaseId: action.caseId,
				};

			default:
				return state;
		}
	};
}

export { createFormReducer };
