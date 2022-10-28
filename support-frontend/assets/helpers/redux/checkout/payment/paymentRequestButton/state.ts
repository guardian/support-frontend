import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { StripeAccount } from 'helpers/forms/stripe';

type StripePaymentRequestButtonData = {
	buttonClicked: boolean;
	completed: boolean;
	paymentError?: ErrorReason;
};

export type PaymentRequestError = {
	account: StripeAccount;
	error: ErrorReason;
};

export type PaymentRequestButtonState = Record<
	StripeAccount,
	StripePaymentRequestButtonData
>;

// TODO: Once we can turn off the old checkout, which relies on this structure,
// we should simplify this to a single object, and simply reset buttonClicked and completed
// when the contributionType and/or stripeAccount changes
export const initialPaymentRequestButtonState: PaymentRequestButtonState = {
	ONE_OFF: {
		buttonClicked: false,
		completed: false,
	},
	REGULAR: {
		buttonClicked: false,
		completed: false,
	},
};
