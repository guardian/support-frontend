import type { IsoCountry } from 'helpers/internationalisation/country';

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
