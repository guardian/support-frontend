import { fetchJson, requestOptions } from 'helpers/async/fetch';
import { logPromise } from 'helpers/async/promise';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import * as cookie from 'helpers/storage/cookie';
import type { PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';
import 'helpers/tracking/acquisitions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { addQueryParamsToURL } from 'helpers/urls/url';
import { logException } from 'helpers/utilities/logger';
import type { Stripe3DSResult } from 'pages/contributions-landing/contributionsLandingReducer';
import { PaymentSuccess } from './readerRevenueApis';
import type { PaymentResult, StripePaymentMethod } from './readerRevenueApis';

// ----- Types ----- //
type UnexpectedError = {
	type: 'unexpectedError';
	error: string;
};

type PaymentApiError<E> = {
	type: 'error';
	error: E;
};

type PaymentApiSuccess<A> = {
	type: 'success';
	data: A;
};

export type PaymentApiResponse<E, A> =
	| UnexpectedError
	| PaymentApiError<E>
	| PaymentApiSuccess<A>;

// Models a PayPal payment being successfully created.
// The user should be redirected to the approvalUrl so that they can authorize the payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalPaymentSuccess.scala
export type CreatePayPalPaymentSuccess = {
	// For brevity, unneeded fields are omitted
	approvalUrl: string; // paymentId: string,
};

// Models a failure to create a PayPal payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalApiError.scala
export type PayPalApiError = {
	// For brevity, unneeded fields are omitted
	// responseCode: number | null,
	// errorName: number | null,
	message: string;
};

export type CreatePayPalPaymentResponse = PaymentApiResponse<
	PayPalApiError,
	CreatePayPalPaymentSuccess
>;

// Data that should be posted to the payment API to create a Stripe charge.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/stripe/StripeChargeData.scala#L82
// TODO: are we deprecating signed-in email?
export type StripeChargeData = {
	paymentData: {
		currency: IsoCurrency;
		amount: number;
		email: string;
		stripePaymentMethod: StripePaymentMethod;
	};
	acquisitionData: PaymentAPIAcquisitionData;
	publicKey: string;
	recaptchaToken: string | null;
};

export type CreateStripePaymentIntentRequest = StripeChargeData & {
	paymentMethodId: string;
};

export type ConfirmStripePaymentIntentRequest = StripeChargeData & {
	paymentIntentId: string;
};

export type AmazonPayData = {
	paymentData: {
		currency: IsoCurrency;
		amount: number;
		orderReferenceId: string;
		email: string;
	};
	acquisitionData: PaymentAPIAcquisitionData;
};

// Data that should be posted to the payment API to get a url for the PayPal UI
// where the user is redirected to so that they can authorize the payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalPaymentData.scala#L74
export type CreatePaypalPaymentData = {
	currency: IsoCurrency;
	amount: number;
	// Specifies the url that PayPal should make a GET request to, should the user authorize the payment.
	// Path of url should be /paypal/rest/return (see routes file)
	returnURL: string;
	// Specifies the url that PayPal should make a GET request to, should the user not authorize the payment.
	cancelURL: string;
};

type PaymentError = {
	type: 'error';
	error: { failureReason?: ErrorReason };
};

type CreateIntentResponse = {
	type: string;
	data: { clientSecret: string };
};

// ----- Functions ----- //
function unexpectedError(message: string): UnexpectedError {
	return {
		type: 'unexpectedError',
		error: message,
	};
}

function paymentApiEndpointWithMode(url: string) {
	if (cookie.get('_test_username')) {
		return addQueryParamsToURL(url, {
			mode: 'test',
		});
	}

	return url;
}

// Object is expected to have structure:
// { type: "error", error: { failureReason: string } }, or
// { type: "success", data: { currency: string, amount: number } }
function paymentResultFromObject(
	json: Record<string, unknown>,
): Promise<PaymentResult> {
	if ('error' in json) {
		const paymentError: PaymentError = json as PaymentError;
		const failureReason: ErrorReason = paymentError.error.failureReason
			? paymentError.error.failureReason
			: 'unknown';

		return Promise.resolve({
			paymentStatus: 'failure',
			error: failureReason,
		});
	}

	return Promise.resolve(PaymentSuccess);
}

const postToPaymentApi = (
	data: Record<string, unknown>,
	path: string,
): Promise<Record<string, unknown>> =>
	fetchJson(
		paymentApiEndpointWithMode(`${window.guardian.paymentApiUrl}${path}`),
		requestOptions(data, 'omit', 'POST', null),
	);

// Sends a one-off payment request to the payment API and standardises the result
// https://github.com/guardian/payment-api/blob/master/src/main/resources/routes#L17
const handleOneOffExecution = (
	result: Promise<Record<string, unknown>>,
): Promise<PaymentResult> => logPromise(result).then(paymentResultFromObject);

const postOneOffAmazonPayExecutePaymentRequest = (
	data: AmazonPayData,
): Promise<PaymentResult> =>
	handleOneOffExecution(
		postToPaymentApi(data, '/contribute/one-off/amazon-pay/execute-payment'),
	);

// Create a Stripe Payment Request, and if necessary perform 3DS auth and confirmation steps
const processStripePaymentIntentRequest = (
	data: CreateStripePaymentIntentRequest,
	handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>,
): Promise<PaymentResult> =>
	handleOneOffExecution(
		postToPaymentApi(data, '/contribute/one-off/stripe/create-payment').then(
			(createIntentResponse) => {
				const _createIntentResponse =
					createIntentResponse as CreateIntentResponse;
				if (_createIntentResponse.type === 'requiresaction') {
					// Do 3DS auth and then send back to payment-api for payment confirmation
					return handleStripe3DS(_createIntentResponse.data.clientSecret).then(
						(authResult: Stripe3DSResult) => {
							if (authResult.error) {
								trackComponentClick('stripe-3ds-failure');
								return {
									type: 'error',
									error: {
										failureReason: 'card_authentication_error',
									},
								};
							}

							trackComponentClick('stripe-3ds-success');
							return postToPaymentApi(
								{ ...data, paymentIntentId: authResult.paymentIntent.id },
								'/contribute/one-off/stripe/confirm-payment',
							);
						},
					);
				}

				// No 3DS auth required
				return _createIntentResponse;
			},
		),
	);

// Object is expected to have structure:
// { type: "error", error: PayPalApiError }, or
// { type: "success", data: CreatePayPalPaymentSuccess }
function createPayPalPaymentResponseFromObject(
	res: Record<string, unknown>,
): CreatePayPalPaymentResponse {
	if ('data' in res) {
		const payPalPaymentSuccess = res.data as CreatePayPalPaymentSuccess;

		if ('approvalUrl' in payPalPaymentSuccess) {
			return {
				type: 'success',
				data: {
					approvalUrl: payPalPaymentSuccess.approvalUrl,
				},
			};
		}
	}

	if ('error' in res) {
		const payPalApiError = res.error as PayPalApiError;

		if ('message' in payPalApiError) {
			return {
				type: 'error',
				error: {
					message: payPalApiError.message,
				},
			};
		}
	}

	const err = `unable to deserialize response from payment API: ${JSON.stringify(
		res,
	)}`;
	logException(err);
	return unexpectedError(err);
}

async function postOneOffPayPalCreatePaymentRequest(
	data: CreatePaypalPaymentData,
): Promise<CreatePayPalPaymentResponse> {
	try {
		const res = await logPromise(
			fetchJson(
				paymentApiEndpointWithMode(window.guardian.paymentApiPayPalEndpoint),
				requestOptions(data, 'omit', 'POST', null),
			),
		);
		return createPayPalPaymentResponseFromObject(res);
	} catch (err) {
		return unexpectedError(`error creating a PayPal payment: ${err as string}`);
	}
}

export {
	postOneOffPayPalCreatePaymentRequest,
	processStripePaymentIntentRequest,
	postOneOffAmazonPayExecutePaymentRequest,
};
