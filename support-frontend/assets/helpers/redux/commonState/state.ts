import type { Participations } from 'helpers/abTests/abtest';
import { FALLBACK_AMOUNTS } from 'helpers/abTests/helpers';
import type { ContributionAmounts } from 'helpers/contributions';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import type {
	Campaign,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import type { LocalCurrencyCountry } from '../../internationalisation/localCurrencyCountry';

export type Internationalisation = {
	currencyId: IsoCurrency;
	countryGroupId: CountryGroupId;
	countryId: IsoCountry;
	localCurrencyCountry?: LocalCurrencyCountry;
	useLocalCurrency: boolean;
	defaultCurrency: IsoCurrency;
};

export type CommonState = {
	campaign: Campaign | null | undefined;
	referrerAcquisitionData: ReferrerAcquisitionData;
	otherQueryParams: Array<[string, string]>;
	abParticipations: Participations;
	settings: Settings;
	amounts: ContributionAmounts;
	defaultAmounts: ContributionAmounts;
	internationalisation: Internationalisation;
	existingPaymentMethods?: ExistingPaymentMethod[];
	hideChooseYourAmount: boolean;
};

export type CommonStateSetupData = {
	campaign: Campaign | null | undefined;
	referrerAcquisitionData: ReferrerAcquisitionData;
	otherQueryParams: Array<[string, string]>;
	internationalisation: Internationalisation;
	abParticipations: Participations;
	settings: Settings;
	amounts: ContributionAmounts;
	defaultAmounts: ContributionAmounts;
	hideChooseYourAmount: boolean;
};

const countryGroupId = detectCountryGroup();

export const initialCommonState: CommonState = {
	campaign: null,
	referrerAcquisitionData: {},
	otherQueryParams: [],
	abParticipations: {},
	settings: getSettings(),
	amounts: FALLBACK_AMOUNTS[countryGroupId],
	defaultAmounts: FALLBACK_AMOUNTS[countryGroupId],
	hideChooseYourAmount: false,
	internationalisation: {
		currencyId: detectCurrency(countryGroupId),
		countryGroupId,
		countryId: detectCountry(),
		useLocalCurrency: false,
		defaultCurrency: 'USD',
	},
};
