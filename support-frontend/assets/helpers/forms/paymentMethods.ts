import type { PaymentMethodSwitch } from './checkouts';
import type { StripePaymentMethod } from './paymentIntegrations/readerRevenueApis';

const Stripe = 'Stripe';
const PayPal = 'PayPal';
const DirectDebit = 'DirectDebit';
const StripeHostedCheckout = 'StripeHostedCheckout';
const Sepa = 'Sepa';
const None = 'None';

export type PaymentMethod =
	| typeof Stripe
	| typeof PayPal
	| typeof DirectDebit
	| typeof StripeHostedCheckout
	| typeof Sepa
	| typeof None;

type FullPaymentMethod = {
	paymentMethod: PaymentMethod;
	stripePaymentMethod?: StripePaymentMethod;
};

const paymentMethods = [
	Stripe,
	PayPal,
	DirectDebit,
	StripeHostedCheckout,
	Sepa,
	None,
];

export const isPaymentMethod = (
	paymentMethod: unknown,
): paymentMethod is PaymentMethod => {
	return (
		typeof paymentMethod === 'string' && paymentMethods.includes(paymentMethod)
	);
};

export function toPaymentMethodSwitchNaming(
	paymentMethod: PaymentMethod,
): PaymentMethodSwitch | null {
	switch (paymentMethod) {
		case PayPal:
			return 'payPal';

		case Stripe:
			return 'stripe';

		case DirectDebit:
			return 'directDebit';

		case StripeHostedCheckout:
			return 'stripeHostedCheckout';

		case Sepa:
			return 'sepa';

		case None:
			return null;
	}
}

export { Stripe, PayPal, DirectDebit, StripeHostedCheckout, Sepa };
