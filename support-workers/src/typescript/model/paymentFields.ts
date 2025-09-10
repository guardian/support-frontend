import { z } from 'zod';
// Payment fields are the details entered by the user into the checkout as opposed to
// payment methods which are the activated payment details which are passed into Zuora

const stripePaymentProviderSchema = z.literal('Stripe');
const stripeHostedPaymentProviderSchema = z.literal('StripeHostedCheckout');
const stripeApplePayPaymentProviderSchema = z.literal('StripeApplePay');
const stripePaymentRequestButtonProviderSchema = z.literal(
	'StripePaymentRequestButton',
);
const payPalPaymentProviderSchema = z.literal('PayPal');
const directDebitPaymentProviderSchema = z.literal('DirectDebit');
const existingPaymentProviderSchema = z.literal('Existing');

export const paymentProviderSchema = z.union([
	stripePaymentProviderSchema,
	stripeHostedPaymentProviderSchema,
	stripeApplePayPaymentProviderSchema,
	stripePaymentRequestButtonProviderSchema,
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
	stripePaymentRequestButtonProviderSchema,
	stripeApplePayPaymentProviderSchema,
	z.literal('StripeCheckout'),
]);
export type StripePaymentType = z.infer<typeof stripePaymentTypeSchema>;
const stripePaymentFieldsSchema = z.object({
	paymentType: stripePaymentProviderSchema,
	paymentMethod: z.string(),
	stripePaymentType: stripePaymentTypeSchema,
	stripePublicKey: z.string(),
});
export type StripePaymentFields = z.infer<typeof stripePaymentFieldsSchema>;
const stripeHostedPaymentFieldsSchema = z.object({
	paymentType: stripeHostedPaymentProviderSchema,
	checkoutSessionId: z.string().nullable(),
	stripePublicKey: z.string(),
});
export type StripeHostedPaymentFields = z.infer<
	typeof stripeHostedPaymentFieldsSchema
>;
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
	stripeHostedPaymentFieldsSchema,
	directDebitPaymentFieldsSchema,
	existingPaymentFieldsSchema,
]);
export type PaymentFields = z.infer<typeof paymentFieldsSchema>;
