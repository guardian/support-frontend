import { z } from 'zod';
// Payment fields are the details entered by the user into the checkout as opposed to
// payment methods which are the activated payment details which are passed into Zuora

const stripePaymentProviderSchema = z.literal('Stripe');
const payPalPaymentProviderSchema = z.literal('PayPal');
const directDebitPaymentProviderSchema = z.literal('DirectDebit');
const existingPaymentProviderSchema = z.literal('Existing');

export const paymentProviderSchema = z.union([
	stripePaymentProviderSchema,
	z.literal('StripeApplePay'),
	z.literal('StripePaymentRequestButton'),
	payPalPaymentProviderSchema,
	directDebitPaymentProviderSchema,
	existingPaymentProviderSchema,
]);
const payPalPaymentFieldsSchema = z.object({
	paymentType: payPalPaymentProviderSchema,
	baid: z.string(),
});
export type PayPalPaymentFields = z.infer<typeof payPalPaymentFieldsSchema>;
export const stripePaymentTypeSchema = z.union([
	z.literal('StripePaymentRequestButton'),
	z.literal('StripeApplePay'),
	z.literal('StripeCheckout'),
]);
const stripePaymentFieldsSchema = z.object({
	paymentType: stripePaymentProviderSchema,
	paymentMethod: z.string(),
	stripePaymentType: stripePaymentTypeSchema, //TODO: this was optional in scala model
	stripePublicKey: z.string(), //TODO: this has more validation in scala model
});
export type StripePaymentFields = z.infer<typeof stripePaymentFieldsSchema>;
const directDebitPaymentFieldsSchema = z.object({
	paymentType: directDebitPaymentProviderSchema,
	accountHolderName: z.string(),
	sortCode: z.string(),
	accountNumber: z.string(),
	recaptchaToken: z.string(),
});
export type DirectDebitPaymentFields = z.infer<
	typeof directDebitPaymentFieldsSchema
>;
const existingPaymentFieldsSchema = z.object({
	paymentType: existingPaymentProviderSchema,
	billingAccountId: z.string(),
});
export const paymentFieldsSchema = z.discriminatedUnion('paymentType', [
	payPalPaymentFieldsSchema,
	stripePaymentFieldsSchema,
	directDebitPaymentFieldsSchema,
	existingPaymentFieldsSchema,
]);
export type PaymentFields = z.infer<typeof paymentFieldsSchema>;
