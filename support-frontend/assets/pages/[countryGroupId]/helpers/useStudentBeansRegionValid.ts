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

export const useStudentBeansRegionValid = (
	supportRegionId: SupportRegionId,
	countryCode: CountryCode,
) => {
	// Student Beans Europe feature switch enables the link to Student Landing Page for prescribed countries
	const { enableStudentBeansEurope } = useFeatureSwitches();
	if (studentBeansRegions.includes(supportRegionId)) {
		return true;
	}
	return (
		enableStudentBeansEurope &&
		supportRegionId === SupportRegionId.EU &&
		studentBeansEuCountries.includes(countryCode)
	);
};
