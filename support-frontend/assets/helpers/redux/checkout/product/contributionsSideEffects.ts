import { isAnyOf } from '@reduxjs/toolkit';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import {
	getMaximumContributionAmount,
	getMinimumContributionAmount,
} from 'helpers/redux/commonState/selectors';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventContributionCartValue } from 'helpers/tracking/quantumMetric';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import { validateForm } from '../checkoutActions';
import {
	setAllAmounts,
	setOtherAmount,
	setOtherAmountError,
	setProductType,
	setSelectedAmount,
} from './actions';
import { getContributionCartValueData } from './selectors/cartValue';
import { isContribution } from './selectors/productType';

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

	startListening({
		actionCreator: validateForm,
		effect(_, listenerApi) {
			const state = listenerApi.getState();
			const { currencyId } = state.common.internationalisation;
			const { productType, selectedAmounts, otherAmounts } =
				state.page.checkoutForm.product;
			if (isContribution(productType)) {
				if (selectedAmounts[productType] === 'other') {
					const customAmount = otherAmounts[productType].amount ?? '';
					const minAmount = getMinimumContributionAmount(state);
					const maxAmount = getMaximumContributionAmount(state);

					if (amountIsNotInRange(customAmount, minAmount, maxAmount)) {
						const currency = currencies[currencyId];
						listenerApi.dispatch(
							setOtherAmountError(
								`Please provide an amount between ${simpleFormatAmount(
									currency,
									minAmount,
								)} and ${simpleFormatAmount(currency, maxAmount)}`,
							),
						);
					}
				}
			}
		},
	});
}

function amountIsNotInRange(amount: string, min: number, max: number) {
	const amountAsFloat = Number.parseFloat(amount);

	return amountAsFloat > max || amountAsFloat < min;
}
