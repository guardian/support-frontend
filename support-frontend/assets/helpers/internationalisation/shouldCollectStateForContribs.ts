import type { ContributionType } from 'helpers/contributions';
import { fromString as isoCountryFromString } from './country';
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

			const isoCountry = isoCountryFromString(
				window.guardian.geoip.countryCode,
			);

			if (!isoCountry) {
				return false;
			}

			const doesNotRequireState = AUDCountriesWithNoStates.includes(isoCountry);

			return !doesNotRequireState;
		}
		return true;
	}
	return false;
}
