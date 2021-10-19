import type { $Keys } from 'utility-types';

const Stripe: 'Stripe' = 'Stripe';
const PayPal: 'PayPal' = 'PayPal';
const DirectDebit: 'DirectDebit' = 'DirectDebit';
const Sepa: 'Sepa' = 'Sepa';
const ExistingCard: 'ExistingCard' = 'ExistingCard';
const ExistingDirectDebit: 'ExistingDirectDebit' = 'ExistingDirectDebit';
const AmazonPay: 'AmazonPay' = 'AmazonPay';
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
// This lets us create a union type from the object keys,
// avoiding the need to specify them separately and keep them in sync!
// https://flow.org/en/docs/types/utilities/#toc-keys
// We need to supply the type parameter, but we're only using the keys
// so it's irrelevant - so we supply null
export type PaymentMethod = $Keys<PaymentMethodMap<null>>;
export {
	Stripe,
	PayPal,
	DirectDebit,
	Sepa,
	ExistingCard,
	ExistingDirectDebit,
	AmazonPay,
};
