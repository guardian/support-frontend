import { isoCountries } from '@modules/internationalisation/country';
import { z } from 'zod';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { isEmpty, isValidZipCode } from 'helpers/forms/formValidation';
import { Country } from 'helpers/internationalisation/classes/country';
import type { SliceErrors } from 'helpers/redux/utils/validation/errors';
import type { FormError } from 'helpers/subscriptionsForms/validation';

export const addressFieldsSchema = z
	.object({
		country: z.enum(isoCountries),
		state: z
			.string()
			.min(1, 'Please enter a state, province or territory')
			.max(
				40,
				'Please enter a state, province or territory no longer than 40 characters',
			),
		postCode: z
			.string()
			.max(
				20,
				'Please enter a postal or zip code no longer than 20 characters.',
			),
	})
	.refine(
		({ country, postCode }) =>
			isEmpty(postCode) || (country === 'US' && isValidZipCode(postCode)),
		{
			message: 'Please enter a valid postal or zip code',
			path: ['postCode'],
		},
	);

type AddressFieldsValidatedState = z.infer<typeof addressFieldsSchema>;

export type AddressFields = AddressFieldsValidatedState & {
	lineOne: string | null;
	lineTwo: string | null;
	city: string | null;
};

export type AddressFormField = keyof AddressFields;
export type AddressFormFieldError = FormError<AddressFormField>;

export type AddressFieldsState = AddressFields & {
	// TODO: Eventually we should move the subs checkouts over to the new validation mechanism
	// but for now we need to leave the old validation mechanism alone
	errors: AddressFormFieldError[];
	errorObject?: SliceErrors<AddressFieldsValidatedState>;
};

export function getInitialAddressFieldsState(): AddressFieldsState {
	const country = Country.detect();
	return {
		country,
		state: '',
		lineOne: null,
		lineTwo: null,
		postCode: '',
		city: null,
		errors: [],
		errorObject: {},
	};
}

export type PostcodeFinderState = {
	results: PostcodeFinderResult[];
	isLoading: boolean;
	postcode: string;
	error?: string;
};

export const initialPostcodeFinderState: PostcodeFinderState = {
	results: [],
	isLoading: false,
	postcode: '',
};

export interface AddressState {
	fields: AddressFieldsState;
	postcode: PostcodeFinderState;
}
