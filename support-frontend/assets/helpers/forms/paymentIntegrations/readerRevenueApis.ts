import type { ProductPurchase } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import type {
	IsoCountry,
	UsState,
} from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import type { PaymentIntentResult, PaymentMethod } from '@stripe/stripe-js';
import {
	fetchJson,
	getRequestOptions,
	requestOptions,
} from 'helpers/async/fetch';
import { logPromise, pollUntilPromise } from 'helpers/async/promise';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { StripeHostedCheckout } from 'helpers/forms/paymentMethods';
import {
	DirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { ReaderType } from 'helpers/productPrice/readerType';
import type {
	DigitalPack,
	GuardianWeekly,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import type {
	AcquisitionABTest,
	OphanIds,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';
import { logException } from 'helpers/utilities/logger';

// ----- Types ----- //
export type StripePaymentMethod =
	| 'StripeCheckout'
	| 'StripeElements'
	// We use Stripe’s payment request button element
	// (https://stripe.com/docs/stripe-js/elements/payment-request-button) for
	// taking Apple Pay and Google Pay payments (and possibly a third wallet I’m
	// unaware of).
	// However, we still use these values to distinguish Apple Pay payments from
	// non-Apple Pay payments. Therefore `StripeApplePay` means ”Apple Pay, via
	// the payment request button”, and `StripePaymentRequestButton` means “any
	// non-Apple-Pay payment method (wallet) that uses the payment request
	// button”
	| 'StripeApplePay'
	| 'StripePaymentRequestButton';
type RegularContribution = {
	productType: 'Contribution';
	amount: number;
	currency: string;
	billingPeriod: BillingPeriod;
};
type SupporterPlus = {
	productType: 'SupporterPlus';
	amount: number;
	currency: string;
	billingPeriod: BillingPeriod;
};
type TierThree = {
	productType: 'TierThree';
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
	productOptions: ProductOptions;
};
type GuardianAdLite = {
	productType: 'GuardianAdLite';
	currency: string;
	billingPeriod: BillingPeriod;
};
type DigitalSubscription = {
	productType: typeof DigitalPack;
	currency: string;
	billingPeriod: BillingPeriod;
	readerType: ReaderType;
	amount?: number;
};
type PaperSubscription = {
	productType: typeof Paper;
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
	productOptions: ProductOptions;
	deliveryAgent?: number;
};
type GuardianWeeklySubscription = {
	productType: typeof GuardianWeekly;
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
};
export type SubscriptionProductFields =
	| SupporterPlus
	| DigitalSubscription
	| PaperSubscription
	| GuardianWeeklySubscription
	| TierThree
	| GuardianAdLite;
export type ProductFields = RegularContribution | SubscriptionProductFields;
type RegularPayPalPaymentFields = {
	paymentType: typeof PayPal;
	baid: string;
};
type RegularStripePaymentIntentFields = {
	paymentType: typeof Stripe;
	paymentMethod: string | PaymentMethod;
	// The ID of the Stripe Payment Method
	stripePaymentType: StripePaymentMethod; // The type of Stripe payment, e.g. Apple Pay
	stripePublicKey: string;
};
type RegularDirectDebitPaymentFields = {
	paymentType: typeof DirectDebit;
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
	recaptchaToken?: string;
};
type RegularSepaPaymentFields = {
	paymentType: typeof Sepa;
	accountHolderName: string;
	iban: string;
	country?: Option<string>;
	streetName?: Option<string>;
};
type RegularStripeHostedCheckoutPaymentFields = {
	paymentType: typeof StripeHostedCheckout;
	checkoutSessionId?: string;
	stripePublicKey: string;
};
export type RegularPaymentFields =
	| RegularPayPalPaymentFields
	| RegularStripePaymentIntentFields
	| RegularDirectDebitPaymentFields
	| RegularSepaPaymentFields
	| RegularStripeHostedCheckoutPaymentFields;
export type RegularPaymentRequestAddress = {
	country: IsoCountry;
	state?: UsState | null;
	lineOne?: Option<string>;
	lineTwo?: Option<string>;
	postCode?: Option<string>;
	city?: Option<string>;
};
export type GiftRecipientType = {
	title?: Title;
	firstName: string;
	lastName: string;
	email?: string;
	message?: string;
	deliveryDate?: string;
};
export type AppliedPromotion = {
	promoCode: string;
	supportRegionId: SupportRegionId;
};
// The model that is sent to support-workers
export type RegularPaymentRequest = {
	title?: Title;
	firstName: string;
	lastName: string;
	billingAddress: RegularPaymentRequestAddress;
	deliveryAddress?: RegularPaymentRequestAddress;
	email: string;
	giftRecipient?: GiftRecipientType;
	product: ProductFields;
	productInformation: ProductPurchase;
	firstDeliveryDate: Option<string>;
	paymentFields: RegularPaymentFields;
	ophanIds: OphanIds;
	referrerAcquisitionData: ReferrerAcquisitionData;
	supportAbTests: AcquisitionABTest[];
	telephoneNumber?: string;
	appliedPromotion?: AppliedPromotion;
	deliveryInstructions?: string;
	csrUsername?: string;
	salesforceCaseId?: string;
	recaptchaToken?: string;
	debugInfo: string;
	similarProductsConsent?: boolean;
};
type StripePaymentIntentAuthorisation = {
	paymentMethod: typeof Stripe;
	stripePaymentMethod: StripePaymentMethod;
	paymentMethodId: string | PaymentMethod;
	handle3DS?: (clientSecret: string) => Promise<PaymentIntentResult>;
};
type PayPalAuthorisation = {
	paymentMethod: typeof PayPal;
	token: string;
};
type DirectDebitAuthorisation = {
	paymentMethod: typeof DirectDebit;
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
};
type SepaAuthorisation = {
	paymentMethod: typeof Sepa;
	accountHolderName: string;
	iban: string;
	country?: string;
	streetName?: string;
};
// Represents an authorisation to execute payments with a given payment method.
// This will generally be supplied by third-party code (Stripe, PayPal, GoCardless).
// It applies both to one-off payments, where it is sent to the Payment API which
// immediately executes the payment, and recurring, where it ultimately ends up in Zuora
// which uses it to execute payments in the future.
export type PaymentAuthorisation =
	| StripePaymentIntentAuthorisation
	| PayPalAuthorisation
	| DirectDebitAuthorisation
	| SepaAuthorisation;

type Status = 'failure' | 'pending' | 'success';

// Represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// The only method/type combination which will not make use of this PayPal one-off,
// because the end of that checkout happens on the backend after the user is redirected to our site.
export type PaymentResult = {
	paymentStatus: Status;
	subscriptionCreationPending?: true;
	error?: ErrorReason;
	userType?: UserType;
};

export type StatusResponse = {
	status: Status;
	trackingUri: string;
	failureReason?: ErrorReason;
};

// ----- Setup ----- //
const PaymentSuccess: PaymentResult = {
	paymentStatus: 'success',
};
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;

// ----- Functions ----- //
function regularPaymentFieldsFromAuthorisation(
	authorisation: PaymentAuthorisation,
	stripePublicKey: string,
	recaptchaToken: string,
): RegularPaymentFields {
	switch (authorisation.paymentMethod) {
		case Stripe:
			if (authorisation.paymentMethodId) {
				return {
					paymentType: Stripe,
					paymentMethod: authorisation.paymentMethodId,
					stripePaymentType: authorisation.stripePaymentMethod,
					stripePublicKey: stripePublicKey,
				};
			}

			throw new Error(
				'Neither token nor paymentMethod found in authorisation data for Stripe recurring contribution',
			);

		case PayPal:
			return {
				paymentType: PayPal,
				baid: authorisation.token,
			};

		case DirectDebit:
			return {
				paymentType: DirectDebit,
				accountHolderName: authorisation.accountHolderName,
				sortCode: authorisation.sortCode,
				accountNumber: authorisation.accountNumber,
				recaptchaToken,
			};

		case Sepa:
			if (authorisation.country && authorisation.streetName) {
				return {
					paymentType: Sepa,
					accountHolderName: authorisation.accountHolderName,
					iban: authorisation.iban.replace(/ /g, ''),
					country: authorisation.country,
					streetName: authorisation.streetName,
				};
			} else {
				return {
					paymentType: Sepa,
					accountHolderName: authorisation.accountHolderName,
					iban: authorisation.iban.replace(/ /g, ''),
				};
			}
	}
}

/**
 * Process the response for a regular payment from the recurring contribution endpoint.
 *
 * If the payment is:
 * - pending, then we start polling the API until it's done or some timeout occurs
 * - failed, then we bubble up an error value
 * - otherwise, we bubble up a success value
 */
function checkRegularStatus(
	csrf: CsrfState,
): (statusResponse: StatusResponse) => Promise<PaymentResult> {
	const handleCompletion = (json: StatusResponse) => {
		switch (json.status) {
			case 'success':
			case 'pending':
				return PaymentSuccess;

			default: {
				const failureReason = json.failureReason ?? 'unknown';
				const failureResult: PaymentResult = {
					paymentStatus: 'failure',
					error: failureReason,
				};
				return failureResult;
			}
		}
	};

	// Exhaustion of the maximum number of polls is considered a payment success
	const handleExhaustedPolls = (error: Error | undefined) => {
		if (error === undefined) {
			const exhaustedResult: PaymentResult = {
				paymentStatus: 'success',
				subscriptionCreationPending: true,
			};
			return exhaustedResult;
		}

		throw error;
	};

	return (statusResponse: StatusResponse) => {
		switch (statusResponse.status) {
			case 'pending':
				return logPromise(
					pollUntilPromise(
						MAX_POLLS,
						POLLING_INTERVAL,
						() =>
							fetchJson<StatusResponse>(
								statusResponse.trackingUri,
								getRequestOptions('same-origin', csrf),
							),
						(json2: StatusResponse) => json2.status === 'pending',
					)
						.then(handleCompletion)
						.catch(handleExhaustedPolls),
				);

			default:
				return Promise.resolve(handleCompletion(statusResponse));
		}
	};
}

/** Sends a regular payment request to the recurring contribution endpoint and checks the result */
function postRegularPaymentRequest(
	uri: string,
	data: RegularPaymentRequest,
	csrf: CsrfState,
): Promise<PaymentResult> {
	return logPromise(
		fetch(uri, requestOptions(data, 'same-origin', 'POST', csrf)),
	)
		.then((response: Response) => {
			if (response.status === 500) {
				logException(`500 Error while trying to post to ${uri}`);
				return {
					paymentStatus: 'failure',
					error: 'internal_error',
				} as PaymentResult;
			} else if (response.status === 400) {
				return response.text().then((text: string) => {
					logException(
						`Bad request error while trying to post to ${uri} - ${text}`,
					);
					return {
						paymentStatus: 'failure',
						error: text,
					} as PaymentResult;
				});
			}

			return response.json().then(checkRegularStatus(csrf));
		})
		.catch(() => {
			logException(`Error while trying to interact with ${uri}`);
			return {
				paymentStatus: 'failure',
				error: 'unknown',
			};
		});
}

export {
	postRegularPaymentRequest,
	regularPaymentFieldsFromAuthorisation,
	PaymentSuccess,
};
