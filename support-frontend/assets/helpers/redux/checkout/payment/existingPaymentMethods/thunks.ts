import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { getExistingPaymentMethodSwitchState } from './utils';

function isValidPaymentList(
	paymentMethodList: unknown,
): paymentMethodList is ExistingPaymentMethod[] {
	return Array.isArray(paymentMethodList);
}

export const getExistingPaymentMethods = createAsyncThunk<
	ExistingPaymentMethod[],
	IsoCurrency,
	{
		state: SubscriptionsState | ContributionsState;
	}
>(
	'existingPaymentMethods/getExistingPaymentMethods',
	async function fetchExistingPaymentMethods(currency) {
		const mdapiUrl = getGlobal<string>('mdapiUrl');

		if (mdapiUrl) {
			const existingPaymentMethods = await fetchJson(
				`${mdapiUrl}/user-attributes/me/existing-payment-options?currencyFilter=${currency}`,
				{
					mode: 'cors',
					credentials: 'include',
				},
			);
			if (isValidPaymentList(existingPaymentMethods)) {
				return existingPaymentMethods;
			} else {
				return [];
			}
		}
		return [];
	},
	{
		condition: () => {
			const switchState = getExistingPaymentMethodSwitchState();
			return switchState.card || switchState.directDebit;
		},
	},
);
