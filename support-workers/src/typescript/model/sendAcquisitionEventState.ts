import { productPurchaseSchema } from '@modules/product-catalog/productPurchaseSchema';
import { optionalDropNulls } from '@modules/schemaUtils';
import { z } from 'zod';
import { paymentMethodSchema } from './paymentMethod';
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
	paymentSchedule: paymentScheduleSchema,
	accountNumber: z.string(),
	subscriptionNumber: z.string(),
	similarProductsConsent: z.boolean().optional(),
});

const commonSchemaWithPromo = commonSchema.extend({
	promoCode: z.string().optional(),
});

const deliveryProductSchema = commonSchemaWithPromo.extend({
	firstDeliveryDate: dateOrDateStringSchema,
});

export const sendThankYouEmailStateSchema = z.union([
	commonSchema.extend({
		productType: z.literal('Contribution'),
	}),
	commonSchemaWithPromo.extend({
		productType: z.literal('SupporterPlus'),
	}),
	commonSchema.extend({
		productType: z.literal('GuardianAdLite'),
	}),
	commonSchemaWithPromo.extend({
		productType: z.literal('DigitalSubscription'),
	}),
	deliveryProductSchema.extend({
		productType: z.literal('TierThree'),
	}),
	deliveryProductSchema.extend({
		productType: z.literal('Paper'),
	}),
	deliveryProductSchema.extend({
		productType: z.literal('GuardianWeekly'),
		giftRecipient: optionalDropNulls(giftRecipientSchema),
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
	acquisitionData: optionalDropNulls(acquisitionDataSchema),
});

export type SendAcquisitionEventState = z.infer<
	typeof sendAcquisitionEventStateSchema
>;
