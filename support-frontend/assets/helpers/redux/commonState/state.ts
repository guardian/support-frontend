import type { Participations } from 'helpers/abTests/abtest';
import { getFallbackAmounts } from 'helpers/abTests/helpers';
import type { SelectedAmountsVariant } from 'helpers/contributions';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { Country, CountryGroup } from 'helpers/internationalisation/helpers';
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
	existingPaymentMethods?: ExistingPaymentMethod[];
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
