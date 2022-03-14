import { commonSlice } from './reducer';

export const {
	setInitialCommonState,
	setCountryInternationalisation,
	setExistingPaymentMethods,
	setContributionTypes,
	setCurrencyId,
	setUseLocalCurrencyFlag,
	setUseLocalAmounts,
} = commonSlice.actions;
