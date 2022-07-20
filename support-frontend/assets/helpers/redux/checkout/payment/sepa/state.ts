import type { Country } from '@guardian/consent-management-platform/dist/types/countries';

export interface SepaState {
	iban?: string;
	accountHolderName?: string;
	streetName?: string;
	country?: Country;
}

export const initialSepaState: SepaState = {
	iban: undefined,
	accountHolderName: undefined,
	streetName: undefined,
	country: undefined,
};
