import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Country } from 'helpers/internationalisation/classes/country';

// Australian region not supported by Student Beans
const studentBeansRegions = [
	SupportRegionId.UK,
	SupportRegionId.US,
	SupportRegionId.CA,
];
const studentBeansEuCountries = ['FR', 'DE', 'ES', 'NL', 'IE'];

export const isStudentBeansRegionValid = (
	supportRegionId: SupportRegionId,
	enableStudentBeansEurope: boolean,
	countryOverride?: CountryCode,
) => {
	if (!studentBeansRegions.includes(supportRegionId)) {
		return (
			enableStudentBeansEurope &&
			supportRegionId === SupportRegionId.EU &&
			studentBeansEuCountries.includes(countryOverride ?? Country.detect())
		);
	}
	return true;
};
