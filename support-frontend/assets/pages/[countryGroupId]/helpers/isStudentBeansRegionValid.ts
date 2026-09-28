import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

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

export const isStudentBeansRegionValidSwitchedOn = (
	supportRegionId: SupportRegionId,
	countryCode: CountryCode,
) => {
	return isStudentBeansRegionValid(
		supportRegionId,
		countryCode,
		isSwitchOn('featureSwitches.enableStudentBeansEurope'),
	);
};
