import { CardNumberElement } from '@stripe/react-stripe-js';
import type {
	ExpressPaymentType,
	Stripe,
	StripeElements,
} from '@stripe/stripe-js';
import { appropriateErrorMessage } from '../../../helpers/forms/errorReasons';
import type {
	RegularPaymentFields,
	StripePaymentMethod,
} from '../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod as LegacyPaymentMethod } from '../../../helpers/forms/paymentMethods';
import {
	DirectDebit,
	PayPal,
	PayPalCompletePayments,
	StripeHostedCheckout,
} from '../../../helpers/forms/paymentMethods';
import {
	stripeCreateSetupIntentPrb,
	stripeCreateSetupIntentRecaptcha,
} from '../checkout/helpers/stripe';

/**
 * We have not added StripeExpressCheckoutElement to the old PaymentMethod
 * as it is heavily coupled through the code base and would require adding
 * a lot of extra unused code to those coupled areas.
 */
export type PaymentMethod =
	| LegacyPaymentMethod
	| 'StripeExpressCheckoutElement';

export class FormSubmissionError extends Error {
	context: string;

	constructor(message: string, context: string) {
		super(message);
		this.context = context;
		this.name = 'FormSubmissionError';
	}
}

const getStripePaymentFields = async (
	stripe: Stripe | null,
	stripeElements: StripeElements | null,
	isTestUser: boolean,
	stripePublicKey: string,
	recaptchaToken: string | undefined,
): Promise<RegularPaymentFields | undefined> => {
	const cardElement = stripeElements?.getElement(CardNumberElement);
	if (stripe && cardElement && recaptchaToken) {
		const stripeClientSecret = await stripeCreateSetupIntentRecaptcha(
			isTestUser,
			stripePublicKey,
			recaptchaToken,
		);

		const stripeIntentResult = await stripe.confirmCardSetup(
			stripeClientSecret,
			{
				payment_method: {
					card: cardElement,
				},
			},
		);

		if (stripeIntentResult.error) {
			throw new FormSubmissionError(
				'There was an issue with your card details.',
				appropriateErrorMessage(stripeIntentResult.error.decline_code ?? ''),
			);
		} else if (stripeIntentResult.setupIntent.payment_method) {
			return {
				paymentType: 'Stripe',
				stripePublicKey,
				stripePaymentType: 'StripeCheckout' as StripePaymentMethod,
				paymentMethod: stripeIntentResult.setupIntent.payment_method as string,
			};
		}
	}
	return;
};
const getStripeExpressCheckoutPaymentFields = async (
	stripeExpressCheckoutPaymentType: ExpressPaymentType | undefined,
	stripe: Stripe | null,
	stripeElements: StripeElements | null,
	stripePublicKey: string,
): Promise<RegularPaymentFields | undefined> => {
	if (stripe && stripeElements) {
		/** 1. Get a clientSecret from our server from the stripePublicKey */
		const stripeClientSecret = await stripeCreateSetupIntentPrb(
			stripePublicKey,
		);

		/** 2. Get the Stripe paymentMethod from the Stripe elements */
		const { paymentMethod: stripePaymentMethod, error: paymentMethodError } =
			await stripe.createPaymentMethod({
				elements: stripeElements,
			});

		if (paymentMethodError) {
			throw new FormSubmissionError(
				'There was an issue with wallet.',
				appropriateErrorMessage(paymentMethodError.decline_code ?? ''),
			);
			return;
		}

		/** 3. Get the setupIntent from the paymentMethod */
		const { setupIntent, error: cardSetupError } =
			await stripe.confirmCardSetup(stripeClientSecret, {
				payment_method: stripePaymentMethod.id,
			});

		if (cardSetupError) {
			throw new FormSubmissionError(
				'There was an issue with wallet.',
				appropriateErrorMessage(cardSetupError.decline_code ?? ''),
			);
			return;
		}

		const stripePaymentType: StripePaymentMethod =
			stripeExpressCheckoutPaymentType === 'apple_pay'
				? 'StripeApplePay'
				: 'StripePaymentRequestButton';

		/** 4. Pass the setupIntent through to the paymentFields sent to our /create endpoint */
		return {
			paymentType: 'Stripe',
			paymentMethod: setupIntent.payment_method as string,
			stripePaymentType,
			stripePublicKey,
		};
	}
	return;
};

export const getPaymentFieldsForPaymentMethod = async (
	paymentMethod: PaymentMethod | undefined,
	stripeExpressCheckoutPaymentType: ExpressPaymentType | undefined,
	stripe: Stripe | null,
	stripeElements: StripeElements | null,
	isTestUser: boolean,
	stripePublicKey: string,
	recaptchaToken: string | undefined,
	formData: FormData,
	checkoutSessionId: string | undefined,
): Promise<RegularPaymentFields | undefined> => {
	if (paymentMethod === 'Stripe') {
		return getStripePaymentFields(
			stripe,
			stripeElements,
			isTestUser,
			stripePublicKey,
			recaptchaToken,
		);
	}
	if (paymentMethod === 'StripeExpressCheckoutElement') {
		return getStripeExpressCheckoutPaymentFields(
			stripeExpressCheckoutPaymentType,
			stripe,
			stripeElements,
			stripePublicKey,
		);
	}
	if (paymentMethod === 'PayPal') {
		return {
			paymentType: PayPal,
			baid: formData.get('payPalBAID') as string,
		};
	}
	if (paymentMethod === 'DirectDebit' && recaptchaToken) {
		return {
			paymentType: DirectDebit,
			accountHolderName: formData.get('accountHolderName') as string,
			accountNumber: formData.get('accountNumber') as string,
			sortCode: formData.get('sortCode') as string,
			recaptchaToken,
		};
	}
	if (paymentMethod === 'StripeHostedCheckout') {
		return {
			paymentType: StripeHostedCheckout,
			checkoutSessionId: checkoutSessionId,
			stripePublicKey,
		};
	}
	if (paymentMethod === 'PayPalCompletePayments') {
		return {
			paymentType: PayPalCompletePayments,
			paymentToken: formData.get('payPalPaymentToken') as string,
			email: formData.get('payPalEmail') as string,
		};
	}

	return;
};
