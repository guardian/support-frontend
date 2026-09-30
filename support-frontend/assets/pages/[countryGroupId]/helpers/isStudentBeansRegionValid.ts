import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';

// Australian region not supported by Student Beans
const studentBeansRegions = [
	SupportRegionId.UK,
	SupportRegionId.US,
	SupportRegionId.CA,
];
const studentBeansEuCountries = ['FR', 'DE', 'ES', 'NL', 'IE'];

export const isStudentBeansRegionValid = (
	supportRegionId: SupportRegionId,
	countryCode: CountryCode,
	enableStudentBeansEurope: boolean,
) => {
	if (!studentBeansRegions.includes(supportRegionId)) {
		return (
			enableStudentBeansEurope &&
			supportRegionId === SupportRegionId.EU &&
			studentBeansEuCountries.includes(countryCode)
		);
	}
	return true;
};
