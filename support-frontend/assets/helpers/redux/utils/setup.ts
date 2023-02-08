import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import type { LocalCurrencyCountry } from 'helpers/internationalisation/localCurrencyCountry';
import { localCurrencyCountries } from 'helpers/internationalisation/localCurrencyCountry';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
	getCampaign,
	getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import {
	getAllQueryParamsWithExclusions,
	getQueryParameter,
} from 'helpers/urls/url';
import { getAmounts } from '../../abTests/helpers';
import type { CommonState, Internationalisation } from '../commonState/state';

function getLocalCurrencyCountry(): LocalCurrencyCountry | null | undefined {
	const queryParam = getQueryParameter('local-currency-country');

	if (queryParam) {
		return localCurrencyCountries[queryParam.toUpperCase()];
	}

	return null;
}

// Creates the initial state for the common reducer.
function buildInitialState(
	abParticipations: Participations,
	countryGroupId: CountryGroupId,
	countryId: IsoCountry,
	currencyId: IsoCurrency,
	settings: Settings,
	acquisitionData: ReferrerAcquisitionData,
): CommonState {
	const excludedParameters = ['REFPVID', 'INTCMP', 'acquisitionData'];
	const otherQueryParams = getAllQueryParamsWithExclusions(excludedParameters);
	const localCurrencyCountry = getLocalCurrencyCountry();
	const internationalisation: Internationalisation = {
		countryGroupId,
		countryId,
		currencyId,
		useLocalCurrency: false,
		defaultCurrency: currencyId,
	};

	if (localCurrencyCountry) {
		internationalisation.localCurrencyCountry = localCurrencyCountry;
	}

	const amounts = getAmounts(settings, abParticipations, countryGroupId);

	return {
		campaign: getCampaign(acquisitionData),
		referrerAcquisitionData: acquisitionData,
		otherQueryParams,
		internationalisation,
		abParticipations,
		settings,
		amounts,
		defaultAmounts: amounts,
	};
}

export function getInitialState(): CommonState {
	const countryId: IsoCountry = detectCountry();
	const countryGroupId: CountryGroupId = detectCountryGroup();
	const currencyId: IsoCurrency = detectCurrency(countryGroupId);
	const settings = getSettings();
	const participations: Participations = abTest.init(
		countryId,
		countryGroupId,
		settings,
	);
	const acquisitionData: ReferrerAcquisitionData = getReferrerAcquisitionData();
	return buildInitialState(
		participations,
		countryGroupId,
		countryId,
		currencyId,
		settings,
		acquisitionData,
	);
}
