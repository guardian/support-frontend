// ----- Imports ----- //
import type { PaymentIntentResult } from '@stripe/stripe-js';
import type { Dispatch } from 'redux';
import type { PaymentMatrix } from 'helpers/contributions';
import { getAmount, logInvalidCombination } from 'helpers/contributions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type {
	AmazonPayData,
	CreatePaypalPaymentData,
	CreatePayPalPaymentResponse,
	CreateStripePaymentIntentRequest,
	StripeChargeData,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import {
	postOneOffAmazonPayExecutePaymentRequest,
	postOneOffPayPalCreatePaymentRequest,
	processStripePaymentIntentRequest,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type {
	AmazonPayAuthorisation,
	PaymentAuthorisation,
	PaymentResult,
	RegularPaymentRequest,
	StripePaymentIntentAuthorisation,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	postRegularPaymentRequest,
	regularPaymentFieldsFromAuthorisation,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';
import {
	setAmazonPayFatalError,
	setAmazonPayWalletIsStale,
} from 'helpers/redux/checkout/payment/amazonPay/actions';
import { setPaymentRequestError } from 'helpers/redux/checkout/payment/paymentRequestButton/actions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getSubscriptionPromotionForBillingPeriod } from 'helpers/redux/checkout/product/selectors/subscriptionPrice';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import * as cookie from 'helpers/storage/cookie';
import {
	derivePaymentApiAcquisitionData,
	getOphanIds,
	getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import { sendEventConversionPaymentMethod } from 'helpers/tracking/quantumMetric';
import type { Option } from 'helpers/types/option';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';

export type Action =
	| {
			type: 'PAYMENT_FAILURE';
			paymentError: ErrorReason;
	  }
	| {
			type: 'PAYMENT_WAITING';
			isWaiting: boolean;
	  }
	| {
			type: 'PAYMENT_SUCCESS';
	  };

const paymentSuccess = (): Action => ({
	type: 'PAYMENT_SUCCESS',
});

const paymentWaiting = (isWaiting: boolean): Action => ({
	type: 'PAYMENT_WAITING',
	isWaiting,
});

const paymentFailure = (paymentError: ErrorReason): Action => ({
	type: 'PAYMENT_FAILURE',
	paymentError,
});

const buildStripeChargeDataFromAuthorisation = (
	stripePaymentMethod: StripePaymentMethod,
	state: ContributionsState,
): StripeChargeData => ({
	paymentData: {
		currency: state.common.internationalisation.currencyId,
		amount: getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			getContributionType(state),
		),
		email: state.page.checkoutForm.personalDetails.email,
		stripePaymentMethod,
	},
	acquisitionData: derivePaymentApiAcquisitionData(
		state.common.referrerAcquisitionData,
		state.common.abParticipations,
		state.page.checkoutForm.billingAddress.fields.postCode,
	),
	publicKey:
		/* why don't we use state.page.checkoutForm.payment.stripeAccountDetails.publicKey ?*/ getStripeKey(
			stripeAccountForContributionType[getContributionType(state)],
			state.common.internationalisation.countryId,
			state.common.internationalisation.currencyId,
			state.page.user.isTestUser,
		),
	recaptchaToken: state.page.checkoutForm.recaptcha.token,
});

const stripeChargeDataFromPaymentIntentAuthorisation = (
	authorisation: StripePaymentIntentAuthorisation,
	state: ContributionsState,
): StripeChargeData =>
	buildStripeChargeDataFromAuthorisation(
		authorisation.stripePaymentMethod,
		state,
	);

function getBillingCountryAndState(state: ContributionsState): {
	billingCountry: IsoCountry;
	billingState: Option<StateProvince>;
	postCode: string;
} {
	const {
		country: formCountry,
		state: formState,
		postCode,
	} = state.page.checkoutForm.billingAddress.fields;

	return {
		billingCountry: formCountry,
		billingState: formState,
		postCode,
	};
}

// This exists *only* to support the purchase of digi subs
function getPromoCode(state: ContributionsState) {
	const promotion = getSubscriptionPromotionForBillingPeriod(state);
	if (promotion) {
		return {
			promoCode: promotion.promoCode,
		};
	}
	return {};
}

function getProductFields(
	state: ContributionsState,
	amount: number,
): RegularPaymentRequest['product'] {
	// This exists *only* to support the purchase of digi subs
	if (state.page.checkoutForm.product.productType === 'DigitalPack') {
		return {
			productType: 'DigitalPack',
			readerType: 'Direct',
			currency: state.common.internationalisation.currencyId,
			billingPeriod: state.page.checkoutForm.product.billingPeriod,
		};
	}

	const contributionType = getContributionType(state);
	const productOptions = isSupporterPlusFromState(state)
		? { productType: 'SupporterPlus' as const }
		: { productType: 'Contribution' as const };

	return {
		amount,
		currency: state.common.internationalisation.currencyId,
		billingPeriod: contributionType === 'MONTHLY' ? Monthly : Annual,
		...productOptions,
	};
}

function regularPaymentRequestFromAuthorisation(
	authorisation: PaymentAuthorisation,
	state: ContributionsState,
): RegularPaymentRequest {
	const { actionHistory } = state.debug;
	const { billingCountry, billingState, postCode } =
		getBillingCountryAndState(state);
	const recaptchaToken = state.page.checkoutForm.recaptcha.token;
	const contributionType = getContributionType(state);

	const amount = getAmount(
		state.page.checkoutForm.product.selectedAmounts,
		state.page.checkoutForm.product.otherAmounts,
		contributionType,
	);

	return {
		firstName: state.page.checkoutForm.personalDetails.firstName.trim(),
		lastName: state.page.checkoutForm.personalDetails.lastName.trim(),
		email: state.page.checkoutForm.personalDetails.email.trim(),
		billingAddress: {
			lineOne: null,
			// required go cardless field
			lineTwo: null,
			// required go cardless field
			city: null,
			// required go cardless field
			state: shouldCollectStateForContributions(
				billingCountry,
				contributionType,
			)
				? billingState
				: null,
			// required Zuora field if country is US or CA
			postCode: billingCountry === 'US' ? postCode : null,
			// required go cardless field
			country: billingCountry, // required Zuora field
		},
		product: getProductFields(state, amount),
		firstDeliveryDate: null,
		paymentFields: {
			...regularPaymentFieldsFromAuthorisation(
				authorisation,
				state.page.checkoutForm.payment.stripeAccountDetails.publicKey,
			),
			recaptchaToken,
		},
		...getPromoCode(state),
		ophanIds: getOphanIds(),
		referrerAcquisitionData: state.common.referrerAcquisitionData,
		supportAbTests: getSupportAbTests(state.common.abParticipations),
		debugInfo: actionHistory,
	};
}

const amazonPayDataFromAuthorisation = (
	authorisation: AmazonPayAuthorisation,
	state: ContributionsState,
): AmazonPayData => ({
	paymentData: {
		currency: state.common.internationalisation.currencyId,
		amount: getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			getContributionType(state),
		),
		orderReferenceId: authorisation.orderReferenceId ?? '',
		email: state.page.checkoutForm.personalDetails.email,
	},
	acquisitionData: derivePaymentApiAcquisitionData(
		state.common.referrerAcquisitionData,
		state.common.abParticipations,
		state.page.checkoutForm.billingAddress.fields.postCode,
	),
});

// A PaymentResult represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// This will execute at the end of every checkout, with the exception
// of PayPal one-off where this happens on the backend after the user is redirected to our site.
const onPaymentResult =
	(
		paymentResult: Promise<PaymentResult>,
		paymentAuthorisation: PaymentAuthorisation,
	) =>
	(
		dispatch: Dispatch,
		getState: () => ContributionsState,
	): Promise<PaymentResult> =>
		paymentResult.then((result) => {
			const state = getState();

			switch (result.paymentStatus) {
				case 'success':
					dispatch(paymentSuccess());
					break;

				case 'failure':
				default: {
					// Payment Request button has its own error message, separate from the form
					const isPaymentRequestButton =
						paymentAuthorisation.paymentMethod == Stripe &&
						(paymentAuthorisation.stripePaymentMethod ===
							'StripePaymentRequestButton' ||
							paymentAuthorisation.stripePaymentMethod === 'StripeApplePay');

					if (isPaymentRequestButton && result.error) {
						dispatch(
							setPaymentRequestError({
								error: result.error,
								account:
									stripeAccountForContributionType[getContributionType(state)],
							}),
						);
					} else {
						if (paymentAuthorisation.paymentMethod === 'AmazonPay') {
							if (
								result.error === 'amazon_pay_try_other_card' ||
								result.error === 'amazon_pay_try_again'
							) {
								// Must re-render the wallet widget in order to display amazon's error message
								dispatch(setAmazonPayWalletIsStale(true));
							} else {
								// Disable Amazon Pay
								dispatch(setAmazonPayFatalError());
							}
						}
						// Finally, trigger the form display
						if (result.error) {
							dispatch(paymentFailure(result.error));
						}
					}

					dispatch(paymentWaiting(false));
				}
			}

			return result;
		});

const onCreateOneOffPayPalPaymentResponse =
	(paymentResult: Promise<CreatePayPalPaymentResponse>) =>
	(dispatch: Dispatch<Action>, getState: () => ContributionsState): void => {
		void paymentResult.then((result: CreatePayPalPaymentResponse) => {
			const state = getState();
			const acquisitionData = derivePaymentApiAcquisitionData(
				state.common.referrerAcquisitionData,
				state.common.abParticipations,
				state.page.checkoutForm.billingAddress.fields.postCode,
			);
			// We've only created a payment at this point, and the user has to get through
			// the PayPal flow on their site before we can actually try and execute the payment.
			// So we drop a cookie which will be used by the /paypal/rest/return endpoint
			// that the user returns to from PayPal, if payment is successful.
			cookie.set(
				'acquisition_data',
				encodeURIComponent(JSON.stringify(acquisitionData)),
			);

			if (result.type === 'success') {
				window.location.href = result.data.approvalUrl;
			} else {
				// For PayPal create payment errors, the Payment API passes through the
				// error from PayPal's API which we don't want to expose to the user.
				dispatch(paymentFailure('unknown'));
				dispatch(paymentWaiting(false));
			}
		});
	};

// The steps for one-off payment can be summarised as follows:
// 1. Create a payment
// 2. Authorise a payment
// 3. Execute a payment (money is actually taken at this point)
//
// For PayPal: we do 1 clientside, they do 2, we do 3 but serverside
// For Stripe: they do 1 & 2, we do 3 clientside.
//
// So from the clientside perspective, for one-off we just see "create payment" for PayPal
// and "execute payment" for Stripe, and these are not synonymous.
const createOneOffPayPalPayment =
	(data: CreatePaypalPaymentData) =>
	(dispatch: Dispatch<Action>, getState: () => ContributionsState): void => {
		onCreateOneOffPayPalPaymentResponse(
			postOneOffPayPalCreatePaymentRequest(data),
		)(dispatch, getState);
	};

const makeCreateStripePaymentIntentRequest =
	(
		data: CreateStripePaymentIntentRequest,
		handleStripe3DS: (clientSecret: string) => Promise<PaymentIntentResult>,
		paymentAuthorisation: PaymentAuthorisation,
	) =>
	(
		dispatch: Dispatch<Action>,
		getState: () => ContributionsState,
	): Promise<PaymentResult> =>
		onPaymentResult(
			processStripePaymentIntentRequest(data, handleStripe3DS),
			paymentAuthorisation,
		)(dispatch, getState);

const executeAmazonPayOneOffPayment =
	(data: AmazonPayData, paymentAuthorisation: PaymentAuthorisation) =>
	(
		dispatch: Dispatch<Action>,
		getState: () => ContributionsState,
	): Promise<PaymentResult> =>
		onPaymentResult(
			postOneOffAmazonPayExecutePaymentRequest(data),
			paymentAuthorisation,
		)(dispatch, getState);

function recurringPaymentAuthorisationHandler(
	dispatch: Dispatch<Action>,
	state: ContributionsState,
	paymentAuthorisation: PaymentAuthorisation,
): Promise<PaymentResult> {
	const request = regularPaymentRequestFromAuthorisation(
		paymentAuthorisation,
		state,
	);
	return onPaymentResult(
		postRegularPaymentRequest(
			routes.recurringContribCreate,
			request,
			state.page.checkoutForm.csrf,
		),
		paymentAuthorisation,
	)(dispatch, () => state);
}

// Bizarrely, adding a type to this object means the type-checking on the
// paymentAuthorisationHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const recurringPaymentAuthorisationHandlers = {
	// These are all the same because there's a single endpoint in
	// support-frontend which handles all requests to create a recurring payment
	PayPal: recurringPaymentAuthorisationHandler,
	Stripe: recurringPaymentAuthorisationHandler,
	DirectDebit: recurringPaymentAuthorisationHandler,
	Sepa: recurringPaymentAuthorisationHandler,
	ExistingCard: recurringPaymentAuthorisationHandler,
	ExistingDirectDebit: recurringPaymentAuthorisationHandler,
	AmazonPay: recurringPaymentAuthorisationHandler,
};
const error: PaymentResult = {
	paymentStatus: 'failure',
	error: 'internal_error',
};
const paymentAuthorisationHandlers: PaymentMatrix<
	(
		dispatch: Dispatch<Action>,
		state: ContributionsState,
		paymentAuthorisation: PaymentAuthorisation,
	) => Promise<PaymentResult>
> = {
	ONE_OFF: {
		PayPal: () => {
			// Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
			// endpoint, after PayPal redirects the browser back to our site.
			logException('Paypal one-off has no authorisation handler');
			return Promise.resolve(error);
		},
		Stripe: (
			dispatch: Dispatch<Action>,
			state: ContributionsState,
			paymentAuthorisation: PaymentAuthorisation,
		): Promise<PaymentResult> => {
			if (paymentAuthorisation.paymentMethod === Stripe) {
				if (paymentAuthorisation.paymentMethodId) {
					const handle3DS = paymentAuthorisation.handle3DS;

					if (handle3DS) {
						const stripeData: CreateStripePaymentIntentRequest = {
							...stripeChargeDataFromPaymentIntentAuthorisation(
								paymentAuthorisation,
								state,
							),
							paymentMethodId: paymentAuthorisation.paymentMethodId,
						};
						return makeCreateStripePaymentIntentRequest(
							stripeData,
							handle3DS,
							paymentAuthorisation,
						)(dispatch, () => state);
					}

					// It shouldn't be possible to get this far without the handle3DS having been set
					logException('Stripe 3DS handler unavailable');
					return Promise.resolve(error);
				}

				logException(
					'Invalid payment authorisation: missing paymentMethodId for Stripe one-off contribution',
				);
				return Promise.resolve(error);
			}

			logException(
				`Invalid payment authorisation: Tried to use the ${paymentAuthorisation.paymentMethod} handler with Stripe`,
			);
			return Promise.resolve(error);
		},
		DirectDebit: () => {
			logInvalidCombination('ONE_OFF', DirectDebit);
			return Promise.resolve(error);
		},
		Sepa: () => {
			logInvalidCombination('ONE_OFF', Sepa);
			return Promise.resolve(error);
		},
		ExistingCard: () => {
			logInvalidCombination('ONE_OFF', ExistingCard);
			return Promise.resolve(error);
		},
		ExistingDirectDebit: () => {
			logInvalidCombination('ONE_OFF', ExistingDirectDebit);
			return Promise.resolve(error);
		},
		AmazonPay: (
			dispatch: Dispatch<Action>,
			state: ContributionsState,
			paymentAuthorisation: PaymentAuthorisation,
		): Promise<PaymentResult> => {
			if (
				paymentAuthorisation.paymentMethod === AmazonPay &&
				paymentAuthorisation.orderReferenceId !== undefined
			) {
				return executeAmazonPayOneOffPayment(
					amazonPayDataFromAuthorisation(paymentAuthorisation, state),
					paymentAuthorisation,
				)(dispatch, () => state);
			}

			return Promise.resolve(error);
		},
		None: () => {
			logInvalidCombination('ONE_OFF', 'None');
			return Promise.resolve(error);
		},
	},
	ANNUAL: {
		...recurringPaymentAuthorisationHandlers,
		None: () => {
			logInvalidCombination('ANNUAL', 'None');
			return Promise.resolve(error);
		},
	},
	MONTHLY: {
		...recurringPaymentAuthorisationHandlers,
		None: () => {
			logInvalidCombination('MONTHLY', 'None');
			return Promise.resolve(error);
		},
	},
};

const onThirdPartyPaymentAuthorised =
	(paymentAuthorisation: PaymentAuthorisation) =>
	(
		dispatch: Dispatch,
		getState: () => ContributionsState,
	): Promise<PaymentResult> => {
		const state = getState();
		const contributionType = getContributionType(state);
		const paymentMethod = state.page.checkoutForm.payment.paymentMethod.name;

		sendEventConversionPaymentMethod(paymentMethod);

		return paymentAuthorisationHandlers[contributionType][
			state.page.checkoutForm.payment.paymentMethod.name
		](dispatch, state, paymentAuthorisation);
	};

export {
	paymentFailure,
	paymentWaiting,
	paymentSuccess,
	onThirdPartyPaymentAuthorised,
	createOneOffPayPalPayment,
	getBillingCountryAndState,
};
