// ----- Types ----- //
import type { Participations } from 'helpers/abTests/abtest';
import type { ContributionAmounts } from 'helpers/contributions';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import type { Action } from 'helpers/page/commonActions';
import type {
	Campaign,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import type { LocalCurrencyCountry } from '../internationalisation/localCurrencyCountry';

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
};

const getInternationalisationFromCountry = (
	countryId: IsoCountry,
	internationalisation: Internationalisation,
) => {
	const countryGroupId =
		fromCountry(countryId) ?? internationalisation.countryGroupId;
	const currencyId =
		fromCountryGroupId(countryGroupId) ?? internationalisation.currencyId;
	return {
		countryGroupId,
		currencyId,
		countryId,
	};
};

// Sets up the common reducer with its initial state.
function createCommonReducer(initialState: CommonState) {
	return function commonReducer(
		state: CommonState = initialState,
		action: Action,
	): CommonState {
		switch (action.type) {
			case 'SET_COUNTRY_INTERNATIONALISATION':
				return {
					...state,
					internationalisation: {
						...state.internationalisation,
						...getInternationalisationFromCountry(
							action.country,
							state.internationalisation,
						),
					},
				};

			case 'SET_CURRENCY_ID':
				return {
					...state,
					internationalisation: {
						...state.internationalisation,
						currencyId:
							action.useLocalCurrency &&
							state.internationalisation.localCurrencyCountry
								? state.internationalisation.localCurrencyCountry.currency
								: state.internationalisation.defaultCurrency,
					},
				};

			case 'SET_USE_LOCAL_CURRENCY_FLAG':
				return {
					...state,
					internationalisation: {
						...state.internationalisation,
						useLocalCurrency: action.useLocalCurrency,
					},
				};

			case 'SET_USE_LOCAL_AMOUNTS':
				return {
					...state,
					amounts:
						action.useLocalAmounts &&
						state.internationalisation.localCurrencyCountry
							? state.internationalisation.localCurrencyCountry.amounts
							: state.defaultAmounts,
				};

			case 'SET_EXISTING_PAYMENT_METHODS': {
				return {
					...state,
					existingPaymentMethods: action.existingPaymentMethods,
				};
			}

			case 'SET_CONTRIBUTION_TYPES': {
				return {
					...state,
					settings: {
						...state.settings,
						contributionTypes: action.contributionTypes,
					},
				};
			}

			default:
				return state;
		}
	};
}

export { createCommonReducer };
