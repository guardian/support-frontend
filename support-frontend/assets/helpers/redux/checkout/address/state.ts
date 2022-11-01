import { z } from 'zod';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { detect } from 'helpers/internationalisation/country';
import type { SliceErrors } from 'helpers/redux/utils/validation/errors';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { isPostCodeValid } from './validationFunctions';

export const addressFieldsSchema = z
	.object({
		country: z.string().min(1, 'Please select a country'),
		state: z
			.string()
			.min(1, 'Please enter a state, province or territory')
			.max(
				40,
				'Please enter a state, province or territory no longer than 40 characters',
			),
		postCode: z
			.string()
			.min(1, 'Please enter a postal or zip code')
			.max(
				20,
				'Please enter a postal or zip code no longer than 20 characters.',
			),
	})
	.refine(({ country, postCode }) => isPostCodeValid(country, postCode), {
		message: 'Please enter a valid postal or zip code',
	});

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
	return {
		country: detect(),
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
