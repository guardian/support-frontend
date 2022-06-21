import type { PostcodeFinderState } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import type {
	CaState,
	IsoCountry,
	UsState,
} from 'helpers/internationalisation/country';
import { detect } from 'helpers/internationalisation/country';
import type { FormError } from 'helpers/subscriptionsForms/validation';

export interface AddressFields {
	country: IsoCountry;
	state: UsState | CaState | null;
	lineOne: string | null;
	lineTwo: string | null;
	postCode: string | null;
	city: string | null;
}

export type AddressFormField = keyof AddressFields;
export type AddressFormFieldError = FormError<AddressFormField>;

export type AddressFieldsState = AddressFields & {
	errors: AddressFormFieldError[];
};

export function getInitialAddressFieldsState(): AddressFieldsState {
	return {
		country: detect(),
		state: null,
		lineOne: null,
		lineTwo: null,
		postCode: null,
		city: null,
		errors: [],
	};
}

export interface AddressState {
	fields: AddressFieldsState;
	postcode: PostcodeFinderState;
}
