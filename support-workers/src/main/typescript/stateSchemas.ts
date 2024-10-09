import { z } from "zod";

export const titleSchema = z.union([
  z.literal("Mr"),
  z.literal("Mrs"),
  z.literal("Ms"),
  z.literal("Miss"),
  z.literal("Mx"),
  z.literal("Dr"),
  z.literal("Prof"),
  z.literal("Rev"),
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
  z.literal("GBP"),
  z.literal("EUR"),
  z.literal("USD"),
  z.literal("CAD"),
  z.literal("AUD"),
  z.literal("NZD"),
]);

export const billingPeriodSchema = z.union([
  z.literal("Monthly"), //TODO: share this with support-frontend
  z.literal("Annual"),
  z.literal("Quarterly"),
]);

export const contributionProductSchema = z.object({
  amount: z.number(),
  currency: currencySchema,
  billingPeriod: billingPeriodSchema,
  productType: z.literal("Contribution"),
});

export const supporterPlusProductSchema = z.object({
  amount: z.number(),
  currency: currencySchema,
  billingPeriod: billingPeriodSchema,
  productType: z.literal("SupporterPlus"),
});

export const tierThreeProductSchema = z.object({
  currency: currencySchema,
  billingPeriod: billingPeriodSchema,
  fulfilmentOptions: z.string(), //TODO type this properly
  productOptions: z.string(), //TODO type this properly
  productType: z.literal("TierThree"),
});

export const paperProductSchema = z.object({
  currency: currencySchema,
  billingPeriod: billingPeriodSchema,
  fulfilmentOptions: z.string(), //TODO type this properly
  productOptions: z.string(), //TODO type this properly
  productType: z.literal("Paper"),
});

export const guardianWeeklyProductSchema = z.object({
  currency: currencySchema,
  billingPeriod: billingPeriodSchema,
  fulfilmentOptions: z.string(), //TODO type this properly
  productType: z.literal("GuardianWeekly"),
});

export const digitalPackProductSchema = z.object({
  currency: currencySchema,
  billingPeriod: billingPeriodSchema,
  readerType: z.string(), //TODO type this properly
  productType: z.literal("DigitalPack"),
});

export const productTypeSchema = z.discriminatedUnion("productType", [
  contributionProductSchema,
  supporterPlusProductSchema,
  tierThreeProductSchema,
  guardianWeeklyProductSchema,
  paperProductSchema,
  digitalPackProductSchema,
]);

const paymentProviderSchema = z.union([
  z.literal("Stripe"),
  z.literal("StripeApplePay"),
  z.literal("StripePaymentRequestButton"),
  z.literal("PayPal"),
  z.literal("DirectDebit"),
  z.literal("Sepa"),
  z.literal("Existing"),
  z.literal("Redemption"),
  z.literal("AmazonPay"),
]);

export const analyticsInfoSchema = z.object({
  isGiftPurchase: z.boolean(),
  paymentProvider: paymentProviderSchema,
});

const payPalPaymentFieldsSchema = z.object({
  baid: z.string(),
});

const stripePaymentTypeSchema = z.union([
  z.literal("StripePaymentRequestButton"),
  z.literal("StripeApplePay"),
  z.literal("StripeCheckout"),
]);

const stripePaymentFieldsSchema = z.object({
  paymentMethod: z.string(),
  stripePaymentType: stripePaymentTypeSchema, //TODO: this was optional in scala model
  stripePublicKey: z.string(), //TODO: this has more validation in scala model
});

export type StripePaymentFields = z.infer<typeof stripePaymentFieldsSchema>;

const directDebitPaymentFieldsSchema = z.object({
  accountHolderName: z.string(),
  sortCode: z.string(),
  accountNumber: z.string(),
  recaptchaToken: z.string(),
});

const sepaPaymentFieldsSchema = z.object({
  accountHolderName: z.string(),
  iban: z.string(),
  country: z.string().nullable(),
  streetName: z.string().nullable(),
});

const existingPaymentFieldsSchema = z.object({
  billingAccountId: z.string(),
});

const amazonPayPaymentFieldsSchema = z.object({
  amazonPayBillingAgreementId: z.string(),
});

//TODO: this needs to be a discriminated union to be useful
const paymentFieldsSchema = z.union([
  payPalPaymentFieldsSchema,
  stripePaymentFieldsSchema,
  directDebitPaymentFieldsSchema,
  sepaPaymentFieldsSchema,
  existingPaymentFieldsSchema,
  amazonPayPaymentFieldsSchema,
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

export const createPaymentMethodStateSchema = z.object({
  requestId: z.string(),
  user: userSchema,
  //giftRecipient: Option[GiftRecipient], TODO: I think we can remove this
  product: productTypeSchema,
  analyticsInfo: analyticsInfoSchema,
  paymentFields: paymentFieldsSchema, //TODO scala model is an either with redemption data
  firstDeliveryDate: z.date().nullable(),
  promoCode: z.string().nullable(),
  csrUsername: z.string().nullable(),
  salesforceCaseId: z.string().nullable(),
  acquisitionData: acquisitionDataSchema.nullable(),
  // TODO: Are these used?
  ipAddress: z.string(),
  userAgent: z.string(),
});

export type CreatePaymentMethodState = z.infer<
  typeof createPaymentMethodStateSchema
>;
