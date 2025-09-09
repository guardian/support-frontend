import { storage } from '@guardian/libs';
import { isoCountries } from '@modules/internationalisation/country';
import { z } from 'zod';

const formDetailsSchema = z.object({
	personalData: z.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.string(),
	}),
	addressFields: z.object({
		billingAddress: z.object({
			lineOne: z.string().nullish(),
			lineTwo: z.string().nullish(),
			city: z.string().nullish(),
			state: z.string().nullish(),
			postCode: z.string().nullish(),
			country: z.enum(isoCountries),
		}),
		deliveryAddress: z
			.object({
				lineOne: z.string().nullish(),
				lineTwo: z.string().nullish(),
				city: z.string().nullish(),
				state: z.string().nullish(),
				postCode: z.string().nullish(),
				country: z.enum(isoCountries),
			})
			.optional(),
	}),
	deliveryInstructions: z.string().nullish(),
	billingAddressMatchesDelivery: z.oboolean(),
});

export type PersistableFormFields = z.infer<typeof formDetailsSchema>;

export type CheckoutSession = {
	checkoutSessionId: string;
	formFields: PersistableFormFields;
};

const schema = z.object({
	formDetails: formDetailsSchema,
	version: z.number(),
	checkoutSessionId: z.string(),
});

const oneDayInMillis = 24 * 60 * 60 * 1000;

const KEY = 'checkoutSessionFormData';

export const persistFormDetails = (
	checkoutSessionId: string,
	formDetails: PersistableFormFields,
): void => {
	const dataToPersist = {
		formDetails,
		version: 1,
		checkoutSessionId,
	};

	const expiry = Date.now() + oneDayInMillis;

	storage.session.set(KEY, dataToPersist, expiry);
};

export const deleteFormDetails = (): void => {
	storage.session.remove(KEY);
};

export const getFormDetails = (
	checkoutSessionId: string,
): CheckoutSession | undefined => {
	const persistedData = storage.session.get(KEY);

	const parsed = schema.safeParse(persistedData);

	if (!parsed.success) {
		return undefined;
	}

	if (parsed.data.checkoutSessionId != checkoutSessionId) {
		return undefined;
	}

	return { checkoutSessionId, formFields: parsed.data.formDetails };
};
