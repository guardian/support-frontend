import { z } from 'zod';

export const titleSchema = z.union([
	z.literal('Mr'),
	z.literal('Mrs'),
	z.literal('Ms'),
	z.literal('Miss'),
	z.literal('Mx'),
	z.literal('Dr'),
	z.literal('Prof'),
	z.literal('Rev'),
]);

export const addressSchema = z.object({
	lineOne: z.string().nullable(),
	lineTwo: z.string().nullable(),
	city: z.string().nullable(),
	state: z.string().nullable(),
	postCode: z.string().nullable(),
	country: z.string(), //TODO: build a schema for this
});

export const userSchema = z.object({
	id: z.string(),
	primaryEmailAddress: z.string(),
	title: titleSchema.nullable(),
	firstName: z.string(),
	lastName: z.string(),
	billingAddress: addressSchema,
	deliveryAddress: addressSchema.nullable(),
	telephoneNumber: z.string().nullable(),
	isTestUser: z.boolean().default(false),
	deliveryInstructions: z.string().nullable(),
});

export const currencySchema = z.union([
	z.literal('GBP'),
	z.literal('EUR'),
	z.literal('USD'),
	z.literal('CAD'),
	z.literal('AUD'),
	z.literal('NZD'),
]);

export const billingPeriodSchema = z.union([
	z.literal('Monthly'), //TODO: share this with support-frontend
	z.literal('Annual'),
	z.literal('Quarterly'),
]);

export const contributionProductSchema = z.object({
	amount: z.number(),
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	productType: z.literal('Contribution'),
});

export const supporterPlusProductSchema = z.object({
	amount: z.number(),
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	productType: z.literal('SupporterPlus'),
});

export const tierThreeProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	fulfilmentOptions: z.string(), //TODO type this properly
	productOptions: z.string(), //TODO type this properly
	productType: z.literal('TierThree'),
});

export const paperProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	fulfilmentOptions: z.string(), //TODO type this properly
	productOptions: z.string(), //TODO type this properly
	productType: z.literal('Paper'),
});

export const guardianWeeklyProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	fulfilmentOptions: z.string(), //TODO type this properly
	productType: z.literal('GuardianWeekly'),
});

export const digitalPackProductSchema = z.object({
	currency: currencySchema,
	billingPeriod: billingPeriodSchema,
	readerType: z.string(), //TODO type this properly
	productType: z.literal('DigitalPack'),
});

export const productTypeSchema = z.discriminatedUnion('productType', [
	contributionProductSchema,
	supporterPlusProductSchema,
	tierThreeProductSchema,
	guardianWeeklyProductSchema,
	paperProductSchema,
	digitalPackProductSchema,
]);

const stripePaymentProviderSchema = z.literal('Stripe');
const payPalPaymentProviderSchema = z.literal('PayPal');
const directDebitPaymentProviderSchema = z.literal('DirectDebit');
const sepapaymentProviderSchema = z.literal('Sepa');
const existingPaymentProviderSchema = z.literal('Existing');

const paymentProviderSchema = z.union([
	stripePaymentProviderSchema,
	z.literal('StripeApplePay'),
	z.literal('StripePaymentRequestButton'),
	payPalPaymentProviderSchema,
	directDebitPaymentProviderSchema,
	sepapaymentProviderSchema,
	existingPaymentProviderSchema,
]);

export const analyticsInfoSchema = z.object({
	isGiftPurchase: z.boolean(),
	paymentProvider: paymentProviderSchema,
});

const payPalPaymentFieldsSchema = z.object({
	paymentType: payPalPaymentProviderSchema,
	baid: z.string(),
});

const stripePaymentTypeSchema = z.union([
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

const sepaPaymentFieldsSchema = z.object({
	paymentType: sepapaymentProviderSchema,
	accountHolderName: z.string(),
	iban: z.string(),
	country: z.string().nullable(),
	streetName: z.string().nullable(),
});

const existingPaymentFieldsSchema = z.object({
	paymentType: existingPaymentProviderSchema,
	billingAccountId: z.string(),
});

const paymentFieldsSchema = z.discriminatedUnion('paymentType', [
	payPalPaymentFieldsSchema,
	stripePaymentFieldsSchema,
	directDebitPaymentFieldsSchema,
	sepaPaymentFieldsSchema,
	existingPaymentFieldsSchema,
]);

export type PaymentFields = z.infer<typeof paymentFieldsSchema>;

const ophanIdsSchema = z.object({
	pageviewId: z.string().nullable(),
	browserId: z.string().nullable(),
});

const abTestSchema = z.object({
	name: z.string(),
	variant: z.string(),
});

const queryParamSchema = z.object({
	name: z.string(),
	value: z.string(),
});

const referrerAcquisitionDataSchema = z.object({
	campaignCode: z.string().nullable(),
	referrerPageviewId: z.string().nullable(),
	referrerUrl: z.string().nullable(),
	componentId: z.string().nullable(),
	componentType: z.string().nullable(),
	source: z.string().nullable(),
	abTests: z.array(abTestSchema).nullable(),
	queryParameters: z.array(queryParamSchema).nullable(),
	hostname: z.string().nullable(),
	gaClientId: z.string().nullable(),
	userAgent: z.string().nullable(),
	ipAddress: z.string().nullable(),
	labels: z.array(z.string()).nullable(),
});

const acquisitionDataSchema = z.object({
	ophanIds: ophanIdsSchema,
	referrerAcquisitionData: referrerAcquisitionDataSchema,
	supportAbTests: z.array(abTestSchema),
});

const baseStateSchema = z.object({
	requestId: z.string(),
	user: userSchema,
	//giftRecipient: Option[GiftRecipient], TODO: I think we can remove this
	product: productTypeSchema,
	analyticsInfo: analyticsInfoSchema,
	firstDeliveryDate: z.coerce.date().nullable(),
	appliedPromotion: z
		.object({
			promoCode: z.string(),
			countryGroupId: z.string(), //TODO: build a schema for this
		})
		.nullable(),
	csrUsername: z.string().nullable(),
	salesforceCaseId: z.string().nullable(),
	acquisitionData: acquisitionDataSchema.nullable(),
});

export const createPaymentMethodStateSchema = baseStateSchema.merge(
	z.object({
		paymentFields: paymentFieldsSchema, //TODO scala model is an either with redemption data
		ipAddress: z.string(),
		userAgent: z.string(),
	}),
);

export type CreatePaymentMethodState = z.infer<
	typeof createPaymentMethodStateSchema
>;

const stripePaymentGatewaySchema = z.union([
	z.literal('Stripe Gateway 1'), //TODO: are all of these still used?
	z.literal('Stripe Gateway GNM Membership AUS'),
	z.literal('Stripe PaymentIntents GNM Membership'),
	z.literal('Stripe PaymentIntents GNM Membership AUS'),
	z.literal('Stripe Bank Transfer - GNM Membership'),
]);
const directDebitPaymentGatewaySchema = z.literal('GoCardless');
export const paymentGatewaySchema = z
	.union([
		z.literal('PayPal Express'),
		directDebitPaymentGatewaySchema,
		// z.literal("GoCardless - Zuora Instance"), TODO: I think we can delete this
		z.literal('Amazon Pay - Contributions USA'),
	])
	.or(stripePaymentGatewaySchema);

const payPalPaymentPaymentMethodSchema = z.object({
	PaypalBaid: z.string(),
	PaypalEmail: z.string(),
	PaypalType: z.literal('ExpressCheckout'),
	Type: z.literal('PayPal'),
	PaymentGateway: z.literal('PayPal Express'),
});

const stripePaymentMethodSchema = z.object({
	TokenId: z.string(), // Stripe Card id
	SecondTokenId: z.string(), // Stripe Customer Id
	CreditCardNumber: z.string(),
	CreditCardCountry: z.string(), //TODO: build a schema for this
	CreditCardExpirationMonth: z.number(),
	CreditCardExpirationYear: z.number(),
	CreditCardType: z.string().optional(),
	PaymentGateway: stripePaymentGatewaySchema,
	Type: z.literal('CreditCardReferenceTransaction'),
	StripePaymentType: stripePaymentTypeSchema, //TODO: this is optional in the scala model
});

const directDebitPaymentMethodSchema = z.object({
	FirstName: z.string(),
	LastName: z.string(),
	BankTransferAccountName: z.string(),
	BankCode: z.string(),
	BankTransferAccountNumber: z.string(),
	Country: z.string(), //TODO: build a schema for this
	City: z.string().optional(),
	PostalCode: z.string().optional(),
	State: z.string().optional(),
	StreetName: z.string().optional(),
	StreetNumber: z.string().optional(),
	BankTransferType: z.literal('DirectDebitUK'),
	Type: z.literal('BankTransfer'),
	PaymentGateway: directDebitPaymentGatewaySchema,
});

const paymentMethodSchema = z.discriminatedUnion('Type', [
	payPalPaymentPaymentMethodSchema,
	stripePaymentMethodSchema,
	directDebitPaymentMethodSchema,
]);

export const createSalesforceContactStateSchema = baseStateSchema.merge(
	z.object({
		paymentMethod: paymentMethodSchema,
	}),
);

export type CreateSalesforceContactState = z.infer<
	typeof createSalesforceContactStateSchema
>;
