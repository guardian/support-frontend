import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getFallbackAmounts } from 'helpers/abTests/helpers';
import type { Participations } from 'helpers/abTests/models';
import type { SelectedAmountsVariant } from 'helpers/contributions';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import type {
	Campaign,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';

export type Internationalisation = {
	currencyId: IsoCurrency;
	countryGroupId: CountryGroupId;
	countryId: IsoCountry;
	useLocalCurrency: boolean;
	defaultCurrency: IsoCurrency;
};

export type CommonState = {
	campaign: Campaign | null | undefined;
	referrerAcquisitionData: ReferrerAcquisitionData;
	otherQueryParams: Array<[string, string]>;
	abParticipations: Participations;
	settings: Settings;
	amounts: SelectedAmountsVariant;
	internationalisation: Internationalisation;
};

export type CommonStateSetupData = {
	campaign: Campaign | null | undefined;
	referrerAcquisitionData: ReferrerAcquisitionData;
	otherQueryParams: Array<[string, string]>;
	internationalisation: Internationalisation;
	abParticipations: Participations;
	settings: Settings;
	amounts: SelectedAmountsVariant;
};

const countryGroupId = CountryGroup.detect();

export const initialCommonState: CommonState = {
	campaign: null,
	referrerAcquisitionData: {},
	otherQueryParams: [],
	abParticipations: {},
	settings: getSettings(),
	amounts: getFallbackAmounts(countryGroupId),
	internationalisation: {
		currencyId: detectCurrency(countryGroupId),
		countryGroupId,
		countryId: Country.detect(),
		useLocalCurrency: false,
		defaultCurrency: 'USD',
	},
};
