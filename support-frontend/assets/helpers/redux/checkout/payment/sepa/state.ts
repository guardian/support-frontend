import type { Country } from '@guardian/consent-management-platform/dist/types/countries';

export interface SepaState {
	iban: string | null;
	accountHolderName: string | null;
	streetName?: string;
	country?: Country;
}

export const initialSepaState: SepaState = {
	iban: null,
	accountHolderName: null,
};
