import { productPurchaseSchema } from '@modules/product-catalog/productPurchaseSchema';
import { z } from 'zod';
import { paymentMethodSchema } from './paymentMethod';
import { paymentScheduleSchema } from './paymentSchedule';
import { productTypeSchema } from './productType';
import {
	acquisitionDataSchema,
	analyticsInfoSchema,
	giftRecipientSchema,
	userSchema,
} from './stateSchemas';

const dateOrDateStringSchema = z.preprocess(
	(input) => (typeof input === 'string' ? new Date(input) : input),
	z.date(),
);

export const sendThankYouEmailStateSchema = z.union([
	z.object({
		productType: z.literal('Contribution'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema,
		paymentMethod: paymentMethodSchema,
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
		similarProductsConsent: z.boolean().optional(),
	}),

	z.object({
		productType: z.literal('SupporterPlus'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema,
		paymentMethod: paymentMethodSchema,
		paymentSchedule: paymentScheduleSchema,
		promoCode: z.string().optional(),
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
		similarProductsConsent: z.boolean().optional(),
	}),

	z.object({
		productType: z.literal('TierThree'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema,
		paymentMethod: paymentMethodSchema,
		paymentSchedule: paymentScheduleSchema,
		promoCode: z.string().optional(),
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
		firstDeliveryDate: z.string(),
		similarProductsConsent: z.boolean().optional(),
	}),

	z.object({
		productType: z.literal('GuardianAdLite'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema,
		paymentMethod: paymentMethodSchema,
		paymentSchedule: paymentScheduleSchema,
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
	}),

	z.object({
		productType: z.literal('DigitalSubscription'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema,
		paymentMethod: paymentMethodSchema,
		paymentSchedule: paymentScheduleSchema,
		promoCode: z.string().optional(),
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
		similarProductsConsent: z.boolean().optional(),
	}),

	z.object({
		productType: z.literal('Paper'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema,
		paymentMethod: paymentMethodSchema,
		paymentSchedule: paymentScheduleSchema,
		promoCode: z.string().optional(),
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
		firstDeliveryDate: dateOrDateStringSchema,
		similarProductsConsent: z.boolean().optional(),
	}),

	z.object({
		productType: z.literal('GuardianWeekly'),
		user: userSchema,
		product: productTypeSchema,
		productInformation: productPurchaseSchema.optional(),
		giftRecipient: giftRecipientSchema.optional(),
		paymentMethod: paymentMethodSchema,
		paymentSchedule: paymentScheduleSchema,
		promoCode: z.string().optional(),
		accountNumber: z.string(),
		subscriptionNumber: z.string(),
		firstDeliveryDate: dateOrDateStringSchema,
		similarProductsConsent: z.boolean().optional(),
	}),
]);

export type SendThankYouEmailState = z.infer<
	typeof sendThankYouEmailStateSchema
>;

export type SendThankYouEmailProductType =
	SendThankYouEmailState['productType'];

export const sendAcquisitionEventStateSchema = z.object({
	requestId: z.string(),
	sendThankYouEmailState: sendThankYouEmailStateSchema,
	analyticsInfo: analyticsInfoSchema,
	acquisitionData: acquisitionDataSchema.nullish(),
});

export type SendAcquisitionEventState = z.infer<
	typeof sendAcquisitionEventStateSchema
>;
