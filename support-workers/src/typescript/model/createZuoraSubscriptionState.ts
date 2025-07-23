import { z } from 'zod';
import {
	salesforceContactRecordSchema,
	salesforceContactRecordsSchema,
} from '../services/salesforce';
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

export const contributionStateSchema = z.object({
	productType: z.literal('Contribution'),
	product: contributionProductSchema,
	paymentMethod: paymentMethodSchema,
	salesForceContact: salesforceContactRecordSchema,
	similarProductsConsent: z.boolean().nullable(),
});
export type ContributionState = z.infer<typeof contributionStateSchema>;

export const supporterPlusStateSchema = z.object({
	productType: z.literal('SupporterPlus'),
	billingCountry: countrySchema,
	product: supporterPlusProductSchema,
	paymentMethod: paymentMethodSchema,
	appliedPromotion: appliedPromotionSchema.nullable(),
	salesForceContact: salesforceContactRecordSchema,
	similarProductsConsent: z.boolean().nullable(),
});
export type SupporterPlusState = z.infer<typeof supporterPlusStateSchema>;

export const tierThreeStateSchema = z.object({
	productType: z.literal('TierThree'),
	user: userSchema,
	product: tierThreeProductSchema,
	paymentMethod: paymentMethodSchema,
	firstDeliveryDate: z.string(),
	appliedPromotion: appliedPromotionSchema.nullable(),
	salesForceContact: salesforceContactRecordSchema,
	similarProductsConsent: z.boolean().nullable(),
});
export type TierThreeState = z.infer<typeof tierThreeStateSchema>;

export const guardianAdLiteStateSchema = z.object({
	productType: z.literal('GuardianAdLite'),
	product: guardianAdLiteProductSchema,
	paymentMethod: paymentMethodSchema,
	salesForceContact: salesforceContactRecordSchema,
});
export type GuardianAdLiteState = z.infer<typeof guardianAdLiteStateSchema>;

export const digitalSubscriptionStateSchema = z.object({
	productType: z.literal('DigitalSubscription'),
	billingCountry: countrySchema,
	product: digitalPackProductSchema,
	paymentMethod: paymentMethodSchema,
	appliedPromotion: appliedPromotionSchema.nullable(),
	salesForceContact: salesforceContactRecordSchema,
	similarProductsConsent: z.boolean().nullable(),
});
export type DigitalSubscriptionState = z.infer<
	typeof digitalSubscriptionStateSchema
>;

export const paperStateSchema = z.object({
	productType: z.literal('Paper'),
	user: userSchema,
	product: paperProductSchema,
	paymentMethod: paymentMethodSchema,
	firstDeliveryDate: z.string(),
	appliedPromotion: appliedPromotionSchema.nullable(),
	salesForceContact: salesforceContactRecordSchema,
	similarProductsConsent: z.boolean().nullable(),
});
export type PaperState = z.infer<typeof paperStateSchema>;

export const guardianWeeklyStateSchema = z.object({
	productType: z.literal('GuardianWeekly'),
	user: userSchema,
	giftRecipient: giftRecipientSchema.nullable(),
	product: guardianWeeklyProductSchema,
	paymentMethod: paymentMethodSchema,
	firstDeliveryDate: z.string(),
	appliedPromotion: appliedPromotionSchema.nullable(),
	salesforceContacts: salesforceContactRecordsSchema,
	similarProductsConsent: z.boolean().nullable(),
});
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
