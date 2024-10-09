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
  lineOne: z.string().optional(),
  lineTwo: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string(), //TODO: build a schema for this
});

export const userSchema = z.object({
  id: z.string(),
  primaryEmailAddress: z.string(),
  title: titleSchema,
  firstName: z.string(),
  lastName: z.string(),
  billingAddress: addressSchema,
  deliveryAddress: addressSchema.optional(),
  telephoneNumber: z.string().optional(),
  isTestUser: z.boolean().default(false),
  deliveryInstructions: z.string().optional(),
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

const directDebitPaymentFieldsSchema = z.object({
  accountHolderName: z.string(),
  sortCode: z.string(),
  accountNumber: z.string(),
  recaptchaToken: z.string(),
});

const sepaPaymentFieldsSchema = z.object({
  accountHolderName: z.string(),
  iban: z.string(),
  country: z.string().optional(),
  streetName: z.string().optional(),
});

const existingPaymentFieldsSchema = z.object({
  billingAccountId: z.string(),
});

const amazonPayPaymentFieldsSchema = z.object({
  amazonPayBillingAgreementId: z.string(),
});

const paymentFieldsSchema = z.union([
  payPalPaymentFieldsSchema,
  stripePaymentFieldsSchema,
  directDebitPaymentFieldsSchema,
  sepaPaymentFieldsSchema,
  existingPaymentFieldsSchema,
  amazonPayPaymentFieldsSchema,
]);

const ophanIdsSchema = z.object({
  pageviewId: z.string().optional(),
  browserId: z.string().optional(),
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
  campaignCode: z.string().optional(),
  referrerPageviewId: z.string().optional(),
  referrerUrl: z.string().optional(),
  componentId: z.string().optional(),
  componentType: z.string().optional(),
  source: z.string().optional(),
  abTests: z.set(abTestSchema).optional(),
  queryParameters: z.set(queryParamSchema).optional(),
  hostname: z.string().optional(),
  gaClientId: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  labels: z.set(z.string()).optional(),
});

const acquisitionDataSchema = z.object({
  ophanIds: ophanIdsSchema,
  referrerAcquisitionData: referrerAcquisitionDataSchema,
  supportAbTests: z.set(abTestSchema),
});

export const createPaymentMethodStateSchema = z.object({
  requestId: z.string(),
  user: userSchema,
  //giftRecipient: Option[GiftRecipient], TODO: I think we can remove this
  product: productTypeSchema,
  analyticsInfo: analyticsInfoSchema,
  paymentFields: paymentFieldsSchema, //TODO scala model is an either with redemption data
  firstDeliveryDate: z.date().optional(),
  promoCode: z.string().optional(),
  csrUsername: z.string().optional(),
  salesforceCaseId: z.string().optional(),
  acquisitionData: acquisitionDataSchema.optional(),
  // TODO: Are these used?
  ipAddress: z.string(),
  userAgent: z.string(),
});

export type CreatePaymentMethodState = z.infer<
  typeof createPaymentMethodStateSchema
>;
