import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';

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
	// Student Beans Europe feature switch enables the link to Student Landing Page for prescribed countries
	const { enableStudentBeansEurope } = useFeatureSwitches();
	return isStudentBeansRegionValid(
		supportRegionId,
		countryCode,
		enableStudentBeansEurope,
	);
};
