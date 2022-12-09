import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { getQueryParameter } from 'helpers/urls/url';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';
import { getExistingPaymentMethodSwitchState } from './utils';

function isValidPaymentList(
	paymentMethodList: unknown,
): paymentMethodList is ExistingPaymentMethod[] {
	return Array.isArray(paymentMethodList);
}

export const getExistingPaymentMethods = createAsyncThunk<
	ExistingPaymentMethod[],
	undefined,
	{
		state: SubscriptionsState | ContributionsState;
	}
>(
	'existingPaymentMethods/getExistingPaymentMethods',
	async function fetchExistingPaymentMethods(_, thunkApi) {
		const { currencyId } = thunkApi.getState().common.internationalisation;

		const mdapiUrl = getGlobal<string>('mdapiUrl');

		if (mdapiUrl) {
			const existingPaymentMethods = await fetchJson(
				`${mdapiUrl}/user-attributes/me/existing-payment-options?currencyFilter=${currencyId}`,
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
			const userAppearsLoggedIn = doesUserAppearToBeSignedIn();
			const existingPaymentsEnabledViaUrlParam =
				getQueryParameter('displayExistingPaymentOptions') === 'true';
			if (userAppearsLoggedIn && existingPaymentsEnabledViaUrlParam) {
				const switchState = getExistingPaymentMethodSwitchState();
				return switchState.card || switchState.directDebit;
			}
			return false;
		},
	},
);
