import { optionalDropNulls } from '@modules/schemaUtils';
import { z } from 'zod';
import { countrySchema } from './address';
import { stripePaymentTypeSchema } from './paymentFields';
import {
	guardianDirectDebitGateway,
	tortoiseMediaDirectDebitGateway,
} from './paymentGateway';
// Payment methods are the activated payment details which are passed into Zuora as opposed to
// payment fields which are the details entered by the user into the checkout

export const stripePaymentGatewaySchema = z.union([
	z.literal('Stripe PaymentIntents GNM Membership'),
	z.literal('Stripe PaymentIntents GNM Membership AUS'),
	z.literal('Stripe - Observer - Tortoise Media'),
]);
export type StripePaymentGateway = z.infer<typeof stripePaymentGatewaySchema>;

const payPalPaymentPaymentMethodSchema = z.object({
	PaypalBaid: z.string(),
	PaypalEmail: z.string(),
	PaypalType: z.literal('ExpressCheckout'),
	Type: z.literal('PayPal'),
	PaymentGateway: z.literal('PayPal Express'),
});
export type PayPalPaymentMethod = z.infer<
	typeof payPalPaymentPaymentMethodSchema
>;

const payPalCompletePaymentsWithBAIDPaymentMethodSchema = z.object({
	PaypalBaid: z.string(),
	PaypalEmail: z.string(),
	Type: z.literal('PayPalCompletePaymentsWithBAID'),
	PaymentGateway: z.literal('PayPal Complete Payments'),
});
export type PayPalCompletePaymentsWithBAIDPaymentMethod = z.infer<
	typeof payPalCompletePaymentsWithBAIDPaymentMethodSchema
>;

const stripePaymentMethodSchema = z.object({
	TokenId: z.string(), // Stripe Card id
	SecondTokenId: z.string(), // Stripe Customer Id
	CreditCardNumber: z.string(),
	CreditCardExpirationMonth: z.number(),
	CreditCardExpirationYear: z.number(),
	CreditCardType: z.string().optional(),
	PaymentGateway: stripePaymentGatewaySchema,
	Type: z.literal('CreditCardReferenceTransaction'),
	StripePaymentType: stripePaymentTypeSchema.optional(),
});
export type StripePaymentMethod = z.infer<typeof stripePaymentMethodSchema>;

export const directDebitPaymentGatewaySchema = z.union([
	z.literal(guardianDirectDebitGateway),
	z.literal(tortoiseMediaDirectDebitGateway),
]);
const directDebitPaymentMethodSchema = z.object({
	FirstName: z.string(),
	LastName: z.string(),
	BankTransferAccountName: z.string(),
	BankCode: z.string(),
	BankTransferAccountNumber: z.string(),
	Country: countrySchema,
	City: optionalDropNulls(z.string()),
	PostalCode: optionalDropNulls(z.string()),
	State: optionalDropNulls(z.string()),
	StreetName: optionalDropNulls(z.string()),
	StreetNumber: optionalDropNulls(z.string()),
	BankTransferType: z.literal('DirectDebitUK'),
	Type: z.literal('BankTransfer'),
	PaymentGateway: directDebitPaymentGatewaySchema,
});
export type DirectDebitPaymentMethod = z.infer<
	typeof directDebitPaymentMethodSchema
>;

export const paymentMethodSchema = z.discriminatedUnion('Type', [
	payPalPaymentPaymentMethodSchema,
	payPalCompletePaymentsWithBAIDPaymentMethodSchema,
	stripePaymentMethodSchema,
	directDebitPaymentMethodSchema,
]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentMethodType = PaymentMethod['Type'];
