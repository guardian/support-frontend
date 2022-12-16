import { commonSlice } from './reducer';

export const {
	setInitialCommonState,
	setCountryInternationalisation,
	setContributionTypes,
	setCurrencyId,
	setUseLocalCurrencyFlag,
	setUseLocalAmounts,
} = commonSlice.actions;
