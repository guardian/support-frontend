import { boolean, z } from 'zod';
import { supportInternationalisationIds } from '../../../../support-frontend/assets/helpers/internationalisation/countryGroup';
import { addressSchema } from './address';
import { paymentFieldsSchema, paymentProviderSchema } from './paymentFields';
import { paymentMethodSchema } from './paymentMethod';
import { productTypeSchema } from './productType';

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

export const userSchema = z.object({
	id: z.string(),
	primaryEmailAddress: z.string(),
	title: titleSchema.nullable(),
	firstName: z.string(),
	lastName: z.string(),
	billingAddress: addressSchema,
	deliveryAddress: addressSchema.nullable(),
	telephoneNumber: z.string().nullable(),
	isTestUser: z.boolean(),
	deliveryInstructions: z.string().nullable(),
});
export type User = z.infer<typeof userSchema>;

export const analyticsInfoSchema = z.object({
	isGiftPurchase: z.boolean(),
	paymentProvider: paymentProviderSchema,
});

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

export const giftRecipientSchema = z.object({
	title: titleSchema.nullable(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().nullable(),
});

const baseStateSchema = z.object({
	requestId: z.string(),
	user: userSchema,
	giftRecipient: giftRecipientSchema.nullable(),
	product: productTypeSchema,
	analyticsInfo: analyticsInfoSchema,
	//TODO: This should probably be a date but the scala lambdas struggle to deserialise the default date representation
	// so leave it as a string until all the lambdas are Typescript
	firstDeliveryDate: z.string().nullable(),
	appliedPromotion: z
		.object({
			promoCode: z.string(),
			countryGroupId: z.enum(supportInternationalisationIds),
		})
		.nullable(),
	csrUsername: z.string().nullable(),
	salesforceCaseId: z.string().nullable(),
	acquisitionData: acquisitionDataSchema.nullable(),
	similarProductsConsent: boolean().nullable(),
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

export type LambdaState =
	| CreatePaymentMethodState
	| CreateSalesforceContactState;

export type WrappedState<InputState> = {
	state: InputState;
	error: {
		Error: string;
		Cause: string;
	} | null;
	requestInfo: {
		testUser: boolean;
		failed: boolean;
		messages: string[];
		accountExists: boolean;
	};
};

export function wrapperSchemaForState<SchemaType extends z.ZodTypeAny>(
	stateSchema: SchemaType,
) {
	return z.object({
		state: stateSchema,
		error: z
			.object({
				Error: z.string(),
				Cause: z.string(),
			})
			.nullable(),
		requestInfo: z.object({
			testUser: z.boolean(),
			failed: z.boolean(),
			messages: z.array(z.string()),
			accountExists: z.boolean(),
		}),
	});
}
