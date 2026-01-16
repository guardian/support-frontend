import { productPurchaseSchema } from '@modules/product-catalog/productPurchaseSchema';
import { appliedPromotionSchema } from '@modules/promotions/v1/schema';
import { optionalDropNulls } from '@modules/schemaUtils';
import { boolean, z } from 'zod';
import { addressSchema } from './address';
import { paymentFieldsSchema, paymentProviderSchema } from './paymentFields';
import { paymentMethodSchema } from './paymentMethod';
import { productTypeSchema } from './productType';

export const dateOrDateStringSchema = z.preprocess(
	(input) => (typeof input === 'string' ? new Date(input) : input),
	z.date(),
);

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

export type Title = z.infer<typeof titleSchema>;

export const userSchema = z.object({
	id: z.string(),
	primaryEmailAddress: z.string(),
	title: optionalDropNulls(titleSchema),
	firstName: z.string(),
	lastName: z.string(),
	billingAddress: addressSchema,
	deliveryAddress: optionalDropNulls(addressSchema),
	telephoneNumber: optionalDropNulls(z.string()),
	isTestUser: z.boolean(),
	deliveryInstructions: optionalDropNulls(z.string()),
});
export type User = z.infer<typeof userSchema>;

export const analyticsInfoSchema = z.object({
	isGiftPurchase: z.boolean(),
	paymentProvider: paymentProviderSchema,
});

const ophanIdsSchema = z.object({
	pageviewId: optionalDropNulls(z.string()),
	browserId: optionalDropNulls(z.string()),
});

const abTestSchema = z.object({
	name: z.string(),
	variant: z.string(),
});
export type AbTest = z.infer<typeof abTestSchema>;

const queryParamSchema = z.object({
	name: z.string(),
	value: z.string(),
});

const referrerAcquisitionDataSchema = z.object({
	campaignCode: optionalDropNulls(z.string()),
	referrerPageviewId: optionalDropNulls(z.string()),
	referrerUrl: optionalDropNulls(z.string()),
	componentId: optionalDropNulls(z.string()),
	componentType: optionalDropNulls(z.string()),
	source: optionalDropNulls(z.string()),
	abTests: optionalDropNulls(z.array(abTestSchema)),
	queryParameters: optionalDropNulls(z.array(queryParamSchema)),
	hostname: optionalDropNulls(z.string()),
	gaClientId: optionalDropNulls(z.string()),
	userAgent: optionalDropNulls(z.string()),
	ipAddress: optionalDropNulls(z.string()),
	labels: optionalDropNulls(z.array(z.string())),
});

export const acquisitionDataSchema = z.object({
	ophanIds: ophanIdsSchema,
	referrerAcquisitionData: referrerAcquisitionDataSchema,
	supportAbTests: z.array(abTestSchema),
});

export const giftRecipientSchema = z.object({
	title: optionalDropNulls(titleSchema),
	firstName: z.string(),
	lastName: z.string(),
	email: optionalDropNulls(z.string()),
});

export type GiftRecipient = z.infer<typeof giftRecipientSchema>;

export const baseStateSchema = z.object({
	requestId: z.string(),
	user: userSchema,
	giftRecipient: optionalDropNulls(giftRecipientSchema),
	product: productTypeSchema,
	productInformation: optionalDropNulls(productPurchaseSchema),
	analyticsInfo: analyticsInfoSchema,
	firstDeliveryDate: optionalDropNulls(dateOrDateStringSchema),
	appliedPromotion: optionalDropNulls(appliedPromotionSchema),
	csrUsername: optionalDropNulls(z.string()),
	salesforceCaseId: optionalDropNulls(z.string()),
	acquisitionData: optionalDropNulls(acquisitionDataSchema),
	similarProductsConsent: optionalDropNulls(boolean()),
});

export const createPaymentMethodStateSchema = baseStateSchema.merge(
	z.object({
		paymentFields: paymentFieldsSchema,
		ipAddress: z.string(),
		userAgent: z.string(),
	}),
);

export type CreatePaymentMethodState = z.infer<
	typeof createPaymentMethodStateSchema
>;

export const createSalesforceContactStateSchema = baseStateSchema.merge(
	z.object({
		paymentMethod: paymentMethodSchema,
	}),
);

export type CreateSalesforceContactState = z.infer<
	typeof createSalesforceContactStateSchema
>;

const requestInfoSchema = z.object({
	testUser: z.boolean(),
	failed: z.boolean(),
	messages: z.array(z.string()),
});

export type RequestInfo = z.infer<typeof requestInfoSchema>;

export type LambdaState =
	| CreatePaymentMethodState
	| CreateSalesforceContactState;

export type WrappedState<InputState> = {
	state: InputState;
	error?: {
		Error: string;
		Cause: string;
	};
	requestInfo: RequestInfo;
};

export function wrapperSchemaForState<SchemaType extends z.ZodTypeAny>(
	stateSchema: SchemaType,
) {
	return z.object({
		state: stateSchema,
		error: optionalDropNulls(
			z.object({
				Error: z.string(),
				Cause: z.string(),
			}),
		),
		requestInfo: requestInfoSchema,
	});
}

export function wrapState<S extends LambdaState>(
	state: S,
	requestInfo: RequestInfo,
	error?: { Error: string; Cause: string },
): WrappedState<S> {
	return {
		state,
		error,
		requestInfo,
	};
}
