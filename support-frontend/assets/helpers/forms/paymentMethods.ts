import type { StripePaymentMethod } from './paymentIntegrations/readerRevenueApis';

const Stripe = 'Stripe';
const PayPal = 'PayPal';
const DirectDebit = 'DirectDebit';
const Sepa = 'Sepa';
const AmazonPay = 'AmazonPay';
const None = 'None';

export type PaymentMethodMap<T> = {
	Stripe: T;
	PayPal: T;
	DirectDebit: T;
	Sepa: T;
	None: T;
	AmazonPay: T;
};

export type PaymentMethod =
	| typeof Stripe
	| typeof PayPal
	| typeof DirectDebit
	| typeof Sepa
	| typeof AmazonPay
	| typeof None;

export type FullPaymentMethod = {
	paymentMethod: PaymentMethod;
	stripePaymentMethod?: StripePaymentMethod;
};

export const recaptchaRequiredPaymentMethods: PaymentMethod[] = [
	DirectDebit,
	Stripe,
];

const paymentMethods = [Stripe, PayPal, DirectDebit, Sepa, AmazonPay, None];

export const isPaymentMethod = (
	paymentMethod: unknown,
): paymentMethod is PaymentMethod => {
	return (
		typeof paymentMethod === 'string' && paymentMethods.includes(paymentMethod)
	);
};

export { Stripe, PayPal, DirectDebit, Sepa, AmazonPay };
