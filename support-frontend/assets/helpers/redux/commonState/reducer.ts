import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
	ContributionAmounts,
	ContributionTypes,
} from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import { setProductType } from 'helpers/redux/checkout/product/actions';
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

function getLocalisedCurrencyId(
	internationalisation: Internationalisation,
	shouldUseLocalCurrency: boolean,
) {
	if (shouldUseLocalCurrency && internationalisation.localCurrencyCountry) {
		return internationalisation.localCurrencyCountry.currency;
	}
	return internationalisation.defaultCurrency;
}

function getLocalisedAmounts(
	internationalisation: Internationalisation,
	defaultAmounts: ContributionAmounts,
	shouldUseLocalCurrency: boolean,
) {
	if (shouldUseLocalCurrency && internationalisation.localCurrencyCountry) {
		return {
			...defaultAmounts,
			...internationalisation.localCurrencyCountry.amounts,
		};
	}
	return defaultAmounts;
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
		setCurrencyId(state, action: PayloadAction<boolean>) {
			state.internationalisation.currencyId = getLocalisedCurrencyId(
				state.internationalisation,
				action.payload,
			);
		},
		setUseLocalCurrencyFlag(state, action: PayloadAction<boolean>) {
			state.internationalisation.useLocalCurrency = action.payload;
		},
		setUseLocalAmounts(state, action: PayloadAction<boolean>) {
			state.amounts = getLocalisedAmounts(
				state.internationalisation,
				state.defaultAmounts,
				action.payload,
			);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(setProductType, (state, action) => {
			// Reset amount localisation when the contributions product changes
			const { useLocalCurrency } = state.internationalisation;
			const shouldUseLocalCurrency =
				action.payload === 'ONE_OFF' ? useLocalCurrency : false;

			state.amounts = getLocalisedAmounts(
				state.internationalisation,
				state.defaultAmounts,
				shouldUseLocalCurrency,
			);
			state.internationalisation.currencyId = getLocalisedCurrencyId(
				state.internationalisation,
				shouldUseLocalCurrency,
			);
		});
	},
});

export const commonReducer = commonSlice.reducer;
