import type { IsoCountry } from 'helpers/internationalisation/country';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';
import { fromCountry as countryGroupFromCountry } from 'helpers/internationalisation/countryGroup';

const usZipCodeRegex = /^\d{5}(-\d{4})?$/;

export function isPostCodeValid(
	country: IsoCountry,
	postcode: string,
): boolean {
	if (country === 'US') {
		return usZipCodeRegex.test(postcode);
	}
	return true;
}

export function isStateInCountry(country: IsoCountry, state: string): boolean {
	return !!stateProvinceFieldFromString(
		countryGroupFromCountry(country),
		state,
	);
}
