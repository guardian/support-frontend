import { storage } from '@guardian/libs';
import type { InferInput } from 'valibot';
import {
	boolean,
	nullish,
	number,
	object,
	optional,
	picklist,
	safeParse,
	string,
} from 'valibot';
import { isoCountries } from 'helpers/internationalisation/country';

const formDetailsSchema = object({
	personalData: object({
		firstName: string(),
		lastName: string(),
		email: string(),
	}),
	addressFields: object({
		billingAddress: object({
			lineOne: nullish(string()),
			lineTwo: nullish(string()),
			city: nullish(string()),
			state: nullish(string()),
			postCode: nullish(string()),
			country: picklist(isoCountries),
		}),
		deliveryAddress: optional(
			object({
				lineOne: nullish(string()),
				lineTwo: nullish(string()),
				city: nullish(string()),
				state: nullish(string()),
				postCode: nullish(string()),
				country: picklist(isoCountries),
			}),
		),
	}),
	deliveryInstructions: optional(string()),
	billingAddressMatchesDelivery: optional(boolean()),
});

export type PersistableFormFields = InferInput<typeof formDetailsSchema>;

export type CheckoutSession = {
	checkoutSessionId: string;
	formFields: PersistableFormFields;
};

const schema = object({
	formDetails: formDetailsSchema,
	version: number(),
	checkoutSessionId: string(),
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

export const getFormDetails = (
	checkoutSessionId: string,
): CheckoutSession | undefined => {
	const persistedData = storage.session.get(KEY);

	const parsed = safeParse(schema, persistedData);

	if (!parsed.success) {
		return undefined;
	}

	if (parsed.output.checkoutSessionId != checkoutSessionId) {
		return undefined;
	}

	return { checkoutSessionId, formFields: parsed.output.formDetails };
};
