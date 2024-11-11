import type { Participations } from 'helpers/abTests/abtest';
import * as abTest from 'helpers/abTests/abtest';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import { CountryHelper } from 'helpers/internationalisation/classes/country';
import { CountryGroupHelper } from 'helpers/internationalisation/classes/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
	getCampaign,
	getReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { getAllQueryParamsWithExclusions } from 'helpers/urls/url';
import type { SelectedAmountsVariant } from '../../contributions';
import type { CommonState, Internationalisation } from '../commonState/state';

// Creates the initial state for the common reducer.
function buildInitialState(
	abParticipations: Participations,
	countryGroupId: CountryGroupId,
	countryId: IsoCountry,
	currencyId: IsoCurrency,
	settings: Settings,
	acquisitionData: ReferrerAcquisitionData,
	amounts: SelectedAmountsVariant,
): CommonState {
	const excludedParameters = ['REFPVID', 'INTCMP', 'acquisitionData'];
	const otherQueryParams = getAllQueryParamsWithExclusions(excludedParameters);
	const internationalisation: Internationalisation = {
		countryGroupId,
		countryId,
		currencyId,
		useLocalCurrency: false,
		defaultCurrency: currencyId,
	};

	return {
		campaign: getCampaign(acquisitionData),
		referrerAcquisitionData: acquisitionData,
		otherQueryParams,
		internationalisation,
		abParticipations,
		settings,
		amounts,
	};
}

export function getInitialState(): CommonState {
	const countryId: IsoCountry = CountryHelper.detect();
	const countryGroupId: CountryGroupId = CountryGroupHelper.detect();
	const currencyId: IsoCurrency = detectCurrency(countryGroupId);
	const settings = getSettings();
	const { selectedAmountsVariant, amountsParticipation } =
		getAmountsTestVariant(countryId, countryGroupId, settings);

	const abtestInitalizerData = {
		countryId,
		countryGroupId,
		selectedAmountsVariant,
	};

	const participations: Participations = abTest.init(abtestInitalizerData);
	const participationsWithAmountsTest = {
		...participations,
		...amountsParticipation,
	};

	const acquisitionData: ReferrerAcquisitionData = getReferrerAcquisitionData();
	return buildInitialState(
		participationsWithAmountsTest,
		countryGroupId,
		countryId,
		currencyId,
		settings,
		acquisitionData,
		selectedAmountsVariant,
	);
}
