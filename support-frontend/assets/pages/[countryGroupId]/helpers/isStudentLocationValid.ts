import type { CountryCode } from '@guardian/libs';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';

const euStudentCountries = ['FR', 'DE', 'ES', 'NL', 'IE'];

export const isStudentLocationValid = (
	supportRegionId: SupportRegionId,
	country: CountryCode,
) => {
	const isStudent = [
		SupportRegionId.UK,
		SupportRegionId.US,
		SupportRegionId.CA,
	].includes(supportRegionId);
	const isEurStudent =
		supportRegionId === SupportRegionId.EU &&
		euStudentCountries.includes(country);
	return isStudent || isEurStudent;
};
