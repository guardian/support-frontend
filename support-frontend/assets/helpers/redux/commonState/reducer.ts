import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ContributionTypes } from 'helpers/contributions';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import type { Internationalisation } from './state';
import { initialCommonState } from './state';

function getInternationalisationFromCountry(
	countryId: IsoCountry,
	internationalisation: Internationalisation,
) {
	const countryGroupId =
		fromCountry(countryId) ?? internationalisation.countryGroupId;
	const currencyId =
		fromCountryGroupId(countryGroupId) ?? internationalisation.currencyId;
	return {
		countryGroupId,
		currencyId,
		countryId,
	};
}

// export type SetCountryAction = {
// 	type: 'SET_COUNTRY_INTERNATIONALISATION';
// 	country: IsoCountry;
// };
// export type Action =
// 	| SetCountryAction
// 	| {
// 			type: 'SET_EXISTING_PAYMENT_METHODS';
// 			existingPaymentMethods: ExistingPaymentMethod[];
// 	  }
// 	| {
// 			type: 'SET_CONTRIBUTION_TYPES';
// 			contributionTypes: ContributionTypes;
// 	  }
// 	| {
// 			type: 'SET_CURRENCY_ID';
// 			useLocalCurrency: boolean;
// 	  }
// 	| {
// 			type: 'SET_USE_LOCAL_CURRENCY_FLAG';
// 			useLocalCurrency: boolean;
// 	  }
// 	| {
// 			type: 'SET_USE_LOCAL_AMOUNTS';
// 			useLocalAmounts: boolean;
// 	  };

const commonSlice = createSlice({
	name: 'common',
	initialState: initialCommonState,
	reducers: {
		setCountryInternationalisation(state, action: PayloadAction<IsoCountry>) {
			state.internationalisation = {
				...state.internationalisation,
				...getInternationalisationFromCountry(
					action.payload,
					state.internationalisation,
				),
			};
		},
		setExistingPaymentMethods(
			state,
			action: PayloadAction<ExistingPaymentMethod[]>,
		) {
			state.existingPaymentMethods = action.payload;
		},
		setContributionTypes(state, action: PayloadAction<ContributionTypes>) {
			state.settings.contributionTypes = action.payload;
		},
		setCurrencyId(state, action: PayloadAction<boolean>) {
			state.internationalisation.currencyId =
				action.payload && state.internationalisation.localCurrencyCountry
					? state.internationalisation.localCurrencyCountry.currency
					: state.internationalisation.defaultCurrency;
		},
		setUseLocalCurrencyFlag(state, action: PayloadAction<boolean>) {
			state.internationalisation.useLocalCurrency = action.payload;
		},
		setUseLocalAmounts(state, action: PayloadAction<boolean>) {
			state.amounts =
				action.payload && state.internationalisation.localCurrencyCountry
					? state.internationalisation.localCurrencyCountry.amounts
					: state.defaultAmounts;
		},
	},
});

export const commonActions = commonSlice.actions;

export const commonReducer = commonSlice.reducer;
