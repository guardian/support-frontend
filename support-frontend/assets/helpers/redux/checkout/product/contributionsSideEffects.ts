import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventContributionAmountUpdated } from 'helpers/tracking/quantumMetric';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import {
	setAllAmounts,
	setOtherAmount,
	setProductType,
	setSelectedAmount,
} from './actions';

const shouldCheckFormEnabled = isAnyOf(
	setAllAmounts,
	setSelectedAmount,
	setOtherAmount,
);

export function addProductSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setProductType,
		effect(action) {
			storage.setSession('selectedContributionType', action.payload);
		},
	});

	startListening({
		actionCreator: setSelectedAmount,
		effect(action, listenerApi) {
			const { countryGroupId, currencyId } =
				listenerApi.getState().common.internationalisation;
			const { amount, contributionType } = action.payload;

			sendEventContributionAmountUpdated(amount, contributionType, currencyId);

			trackComponentClick(
				`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}-${amount}`,
			);
		},
	});

	startListening({
		matcher: shouldCheckFormEnabled,
		effect(_, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
