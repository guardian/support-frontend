import {
	Canada,
	type CountryGroupId,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';

export default function getCurrentMaxRatesByCountry(
	countryGroupId: CountryGroupId,
): string | undefined {
	if (countryGroupId === UnitedStates) {
		return 'U.S regular rates are currently: All-access digital is $18 per month and $180 per year. Digital plus is $28 per month and $280 per year.';
	}

	if (countryGroupId === Canada) {
		return 'Canada regular rates are currently: All-access digital is $18 per month and $180 per year. Digital plus is $30 per month and $300 per year.';
	}

	return;
}
