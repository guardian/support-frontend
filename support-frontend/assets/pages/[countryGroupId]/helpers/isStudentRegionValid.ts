import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Country } from 'helpers/internationalisation/classes/country';

const euStudentCountries = ['FR', 'DE', 'ES', 'NL', 'IE'];

export const isStudentRegionValid = (
	supportRegionId: SupportRegionId,
	country?: CountryCode,
) => {
	const geoCountry = Country.detect();
	const isStudent = [
		SupportRegionId.UK,
		SupportRegionId.US,
		SupportRegionId.CA,
	].includes(supportRegionId);
	const isEurStudent =
		supportRegionId === SupportRegionId.EU &&
		euStudentCountries.includes(country ?? geoCountry);
	return isStudent || isEurStudent;
};
