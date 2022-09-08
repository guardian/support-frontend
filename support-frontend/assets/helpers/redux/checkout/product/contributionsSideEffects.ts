import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionType } from 'helpers/contributions';
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

	startListening({
		type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED',
		effect(_, listenerApi) {
			const state = listenerApi.getState();
			const selectedAmounts = state.page.checkoutForm.product.selectedAmounts;
			/**
			 * selectedAmounts (type SelectedAmounts) can only be indexed with ContributionType,
			 * so I'm have to type cast productType from ProductType to ContributionType
			 * to be able to index selectedAmounts. As ProductType could be 'DigiPack' which
			 * can't be used to index an onject of type SelectedAmounts.
			 */
			const productType = state.page.checkoutForm.product
				.productType as ContributionType;
			const selectedAmount = selectedAmounts[productType];
			const contributionAmount =
				selectedAmount === 'other'
					? state.page.checkoutForm.product.otherAmounts[productType].amount
					: selectedAmount;

			if (contributionAmount) {
				storage.setSession('contributionAmount', contributionAmount.toString());
			}
		},
	});
}
