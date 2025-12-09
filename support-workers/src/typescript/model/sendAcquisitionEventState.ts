import { productPurchaseSchema } from '@modules/product-catalog/productPurchaseSchema';
import { z } from 'zod';
import { paymentMethodSchema } from './paymentMethod';
//import { paymentScheduleSchema } from './paymentSchedule';
import { paymentScheduleSchema } from './paymentSchedule';
import { productTypeSchema } from './productType';
import {
	acquisitionDataSchema,
	analyticsInfoSchema,
	dateOrDateStringSchema,
	giftRecipientSchema,
	userSchema,
} from './stateSchemas';

const commonSchema = z.object({
	user: userSchema,
	product: productTypeSchema,
	productInformation: productPurchaseSchema,
	paymentMethod: paymentMethodSchema,
	accountNumber: z.string(),
	subscriptionNumber: z.string(),
	similarProductsConsent: z.boolean().optional(),
});

const commonSchemaWithConsent = commonSchema.extend({
	similarProductsConsent: z.boolean().optional(),
});

const commonSchemaWithConsentAndPromo = commonSchemaWithConsent.extend({
	promoCode: z.string().optional(),
});

const deliveryProductSchema = commonSchemaWithConsentAndPromo.extend({
	firstDeliveryDate: dateOrDateStringSchema,
});

export const sendThankYouEmailStateSchema = z.union([
	commonSchemaWithConsent.extend({
		productType: z.literal('Contribution'),
		paymentSchedule: paymentScheduleSchema,
	}),
	commonSchemaWithConsentAndPromo.extend({
		productType: z.literal('SupporterPlus'),
		paymentSchedule: paymentScheduleSchema,
	}),
	commonSchema.extend({
		productType: z.literal('GuardianAdLite'),
		paymentSchedule: paymentScheduleSchema,
	}),
	commonSchemaWithConsentAndPromo.extend({
		productType: z.literal('DigitalSubscription'),
		paymentSchedule: paymentScheduleSchema,
	}),
	deliveryProductSchema.extend({
		productType: z.literal('TierThree'),
		paymentSchedule: paymentScheduleSchema,
	}),
	deliveryProductSchema.extend({
		productType: z.literal('Paper'),
		paymentSchedule: paymentScheduleSchema,
	}),
	deliveryProductSchema.extend({
		productType: z.literal('GuardianWeekly'),
		giftRecipient: giftRecipientSchema.nullish(),
		paymentSchedule: paymentScheduleSchema,
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
