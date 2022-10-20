import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventContributionCartValue } from 'helpers/tracking/quantumMetric';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import {
	setAllAmounts,
	setOtherAmount,
	setProductType,
	setSelectedAmount,
} from './actions';
import { getContributionCartValueData } from './selectors/cartValue';

const shouldCheckFormEnabled = isAnyOf(
	setAllAmounts,
	setSelectedAmount,
	setOtherAmount,
);

const shouldSendEventContributionCartValue = isAnyOf(
	setAllAmounts,
	setProductType,
	setSelectedAmount,
);

export function addProductSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		matcher: shouldSendEventContributionCartValue,
		effect(_, listenerApi) {
			const { contributionAmount, contributionType, contributionCurrency } =
				getContributionCartValueData(listenerApi.getState());

			if (contributionAmount) {
				sendEventContributionCartValue(
					contributionAmount.toString(),
					contributionType,
					contributionCurrency,
				);
			}
		},
	});

	startListening({
		actionCreator: setProductType,
		effect(action) {
			/**
			 * selectedContributionType is read from storage in 2 places:
			 * 1) It is used to set the selected contribution type on return
			 * visits to the Contributions Landing Page in the same session.
			 * 2) It is used on the Contributions Thank You page to send data to Quantum
			 * Metric, and to also set a cookie for one off contributions.
			 */
			storage.setSession('selectedContributionType', action.payload);
		},
	});

	startListening({
		actionCreator: setSelectedAmount,
		effect(action, listenerApi) {
			const { countryGroupId } =
				listenerApi.getState().common.internationalisation;
			const { amount, contributionType } = action.payload;

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

	startListening({
		type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED',
		effect(_, listenerApi) {
			const { contributionAmount } = getContributionCartValueData(
				listenerApi.getState(),
			);

			if (contributionAmount) {
				storage.setSession('contributionAmount', contributionAmount.toString());
			}
		},
	});
}
