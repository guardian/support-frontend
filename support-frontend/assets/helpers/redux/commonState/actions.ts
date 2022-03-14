import { commonSlice } from './reducer';

export const {
	setInitialState,
	setCountryInternationalisation,
	setExistingPaymentMethods,
	setContributionTypes,
	setCurrencyId,
	setUseLocalCurrencyFlag,
	setUseLocalAmounts,
} = commonSlice.actions;
