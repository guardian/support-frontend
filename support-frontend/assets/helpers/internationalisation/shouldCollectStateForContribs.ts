import type { ContributionType } from 'helpers/contributions';
import type { CountryGroup, CountryGroupId } from './countryGroup';
import {
	AUDCountries,
	Canada,
	countryGroups,
	UnitedStates,
} from './countryGroup';

export function shouldCollectStateForContributions(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): boolean {
	if (contributionType === 'ONE_OFF') return false;

	if (countryGroupId === UnitedStates || countryGroupId === Canada) {
		return true;
	}
	if (countryGroupId === AUDCountries) {
		if (window.guardian.geoip) {
			// Some countries, eg. Tuvalu, pay in Australian dollars but are obviously not
			// in any Australian state/territory, so we do not need to collect their state
			const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
			const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(
				(c) => c !== 'AU',
			);

			const doesNotRequireState = AUDCountriesWithNoStates.includes(
				window.guardian.geoip.countryCode,
			);

			return !doesNotRequireState;
		}
		return true;
	}
	return false;
}
