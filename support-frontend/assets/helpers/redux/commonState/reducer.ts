import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ContributionTypes } from 'helpers/contributions';
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
	const currencyId = fromCountryGroupId(countryGroupId);
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
			return {
				...state,
				campaign,
				referrerAcquisitionData,
				otherQueryParams,
				internationalisation,
				abParticipations,
				settings,
				amounts,
				defaultAmounts,
			};
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
		setContributionTypes(state, action: PayloadAction<ContributionTypes>) {
			state.settings.contributionTypes = action.payload;
		},
		setCurrencyId(state) {
			state.internationalisation.currencyId =
				state.internationalisation.defaultCurrency;
		},
	},
});

export const commonReducer = commonSlice.reducer;
