import { productPurchaseSchema } from '@modules/product-catalog/productPurchaseSchema';
import { z } from 'zod';
import { salesforceContactRecordSchema } from '../services/salesforce';
import { countrySchema } from './address';
import { paymentMethodSchema } from './paymentMethod';
import {
	contributionProductSchema,
	digitalPackProductSchema,
	guardianAdLiteProductSchema,
	guardianWeeklyProductSchema,
	paperProductSchema,
	supporterPlusProductSchema,
	tierThreeProductSchema,
} from './productType';
import {
	appliedPromotionSchema,
	baseStateSchema,
	giftRecipientSchema,
	userSchema,
} from './stateSchemas';

const baseProductStateSchema = z.object({
	salesForceContact: salesforceContactRecordSchema,
});

export const contributionStateSchema = z
	.object({
		productType: z.literal('Contribution'),
		product: contributionProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
		similarProductsConsent: z.boolean().nullable(),
	})
	.merge(baseProductStateSchema);

export type ContributionState = z.infer<typeof contributionStateSchema>;

export const supporterPlusStateSchema = z
	.object({
		productType: z.literal('SupporterPlus'),
		billingCountry: countrySchema,
		product: supporterPlusProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
		appliedPromotion: appliedPromotionSchema.nullable(),
		similarProductsConsent: z.boolean().nullable(),
	})
	.merge(baseProductStateSchema);
export type SupporterPlusState = z.infer<typeof supporterPlusStateSchema>;

export const tierThreeStateSchema = z
	.object({
		productType: z.literal('TierThree'),
		user: userSchema,
		product: tierThreeProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
		firstDeliveryDate: z.string(),
		appliedPromotion: appliedPromotionSchema.nullable(),
		similarProductsConsent: z.boolean().nullable(),
	})
	.merge(baseProductStateSchema);
export type TierThreeState = z.infer<typeof tierThreeStateSchema>;

export const guardianAdLiteStateSchema = z
	.object({
		productType: z.literal('GuardianAdLite'),
		product: guardianAdLiteProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
	})
	.merge(baseProductStateSchema);
export type GuardianAdLiteState = z.infer<typeof guardianAdLiteStateSchema>;

export const digitalSubscriptionStateSchema = z
	.object({
		productType: z.literal('DigitalSubscription'),
		billingCountry: countrySchema,
		product: digitalPackProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
		appliedPromotion: appliedPromotionSchema.nullable(),
		similarProductsConsent: z.boolean().nullable(),
	})
	.merge(baseProductStateSchema);
export type DigitalSubscriptionState = z.infer<
	typeof digitalSubscriptionStateSchema
>;

export const paperStateSchema = z
	.object({
		productType: z.literal('Paper'),
		user: userSchema,
		product: paperProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
		firstDeliveryDate: z.string(),
		appliedPromotion: appliedPromotionSchema.nullable(),
		similarProductsConsent: z.boolean().nullable(),
	})
	.merge(baseProductStateSchema);
export type PaperState = z.infer<typeof paperStateSchema>;

export const guardianWeeklyStateSchema = z
	.object({
		productType: z.literal('GuardianWeekly'),
		user: userSchema,
		giftRecipient: giftRecipientSchema.nullable(),
		product: guardianWeeklyProductSchema,
		productInformation: productPurchaseSchema.nullish(),
		paymentMethod: paymentMethodSchema,
		firstDeliveryDate: z.string(),
		appliedPromotion: appliedPromotionSchema.nullable(),
		similarProductsConsent: z.boolean().nullable(),
	})
	.merge(baseProductStateSchema);
export type GuardianWeeklyState = z.infer<typeof guardianWeeklyStateSchema>;

export const createZuoraSubscriptionProductStateSchema = z.discriminatedUnion(
	'productType',
	[
		contributionStateSchema,
		supporterPlusStateSchema,
		tierThreeStateSchema,
		guardianAdLiteStateSchema,
		digitalSubscriptionStateSchema,
		paperStateSchema,
		guardianWeeklyStateSchema,
	],
);

export const createZuoraSubscriptionStateSchema = baseStateSchema.merge(
	z.object({
		productSpecificState: createZuoraSubscriptionProductStateSchema,
	}),
);

export type CreateZuoraSubscriptionState = z.infer<
	typeof createZuoraSubscriptionStateSchema
>;
