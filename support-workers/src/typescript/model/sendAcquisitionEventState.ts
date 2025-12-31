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

const commonSchema = z.object({
	user: userSchema,
	product: productTypeSchema,
	productInformation: productPurchaseSchema,
	paymentMethod: paymentMethodSchema,
	paymentSchedule: paymentScheduleSchema,
	accountNumber: z.string(),
	subscriptionNumber: z.string(),
});

const commonSchemaWithConsent = commonSchema.extend({
	similarProductsConsent: z.boolean().optional(),
});

const commonSchemaWithConsentAndPromo = commonSchemaWithConsent.extend({
	promoCode: z.string().optional(),
});

const deliveryProductSchema = commonSchemaWithConsentAndPromo.extend({
	firstDeliveryDate: z.string(),
});

export const sendThankYouEmailStateSchema = z.union([
	commonSchemaWithConsent.extend({
		productType: z.literal('Contribution'),
	}),
	commonSchemaWithConsentAndPromo.extend({
		productType: z.literal('SupporterPlus'),
	}),
	commonSchema.extend({
		productType: z.literal('GuardianAdLite'),
	}),
	commonSchemaWithConsentAndPromo.extend({
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
		giftRecipient: giftRecipientSchema.nullish(),
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
