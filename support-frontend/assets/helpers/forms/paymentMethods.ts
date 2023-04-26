import type { StripePaymentMethod } from './paymentIntegrations/readerRevenueApis';

const Stripe = 'Stripe';
const PayPal = 'PayPal';
const DirectDebit = 'DirectDebit';
const Sepa = 'Sepa';
const ExistingCard = 'ExistingCard';
const ExistingDirectDebit = 'ExistingDirectDebit';
const AmazonPay = 'AmazonPay';
const None = 'None';

export type PaymentMethodMap<T> = {
	Stripe: T;
	PayPal: T;
	DirectDebit: T;
	Sepa: T;
	ExistingCard: T;
	ExistingDirectDebit: T;
	None: T;
	AmazonPay: T;
};

export type PaymentMethod =
	| typeof Stripe
	| typeof PayPal
	| typeof DirectDebit
	| typeof Sepa
	| typeof ExistingCard
	| typeof ExistingDirectDebit
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

export {
	Stripe,
	PayPal,
	DirectDebit,
	Sepa,
	ExistingCard,
	ExistingDirectDebit,
	AmazonPay,
};
