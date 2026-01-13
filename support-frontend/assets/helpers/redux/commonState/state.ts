import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { Participations } from 'helpers/abTests/models';
import type { SelectedAmountsVariant } from 'helpers/contributions';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type {
	Campaign,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';

type Internationalisation = {
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
