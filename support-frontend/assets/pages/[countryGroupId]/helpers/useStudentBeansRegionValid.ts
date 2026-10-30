import type { CountryCode } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';

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
	// Student Beans Europe feature switch enables the link to Student Landing Page for prescribed countries or the Australian region
	const { enableStudentBeansEuropeAustralia } = useFeatureSwitches();
	if (studentBeansRegions.includes(supportRegionId)) {
		return true;
	}
	return (
		(enableStudentBeansEuropeAustralia &&
			supportRegionId === SupportRegionId.AU) ||
		(enableStudentBeansEuropeAustralia &&
			supportRegionId === SupportRegionId.EU &&
			studentBeansEuCountries.includes(countryCode))
	);
};
