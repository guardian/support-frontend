import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ContributionTypes } from 'helpers/contributions';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import type { CommonStateSetupData, Internationalisation } from './state';
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

export const commonSlice = createSlice({
	name: 'common',
	initialState: initialCommonState,
	reducers: {
		setInitialCommonState(state, action: PayloadAction<CommonStateSetupData>) {
			const {
				campaign,
				referrerAcquisitionData,
				otherQueryParams,
				internationalisation,
				abParticipations,
				settings,
				amounts,
				defaultAmounts,
			} = action.payload;
			state.campaign = campaign;
			state.referrerAcquisitionData = referrerAcquisitionData;
			state.otherQueryParams = otherQueryParams;
			state.internationalisation = internationalisation;
			state.abParticipations = abParticipations;
			state.settings = settings;
			state.amounts = amounts;
			state.defaultAmounts = defaultAmounts;
		},
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
					? {
							...state.defaultAmounts,
							...state.internationalisation.localCurrencyCountry.amounts,
					  }
					: state.defaultAmounts;
		},
	},
});

export const commonReducer = commonSlice.reducer;
