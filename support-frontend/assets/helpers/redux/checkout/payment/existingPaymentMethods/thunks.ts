import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getGlobal, isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';
import { oktaAuthHeader } from '../../../../utilities/authorisation';
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
			const authWithOkta = isSwitchOn('featureSwitches.authenticateWithOkta');
			const accessToken = cookie.get('GU_ACCESS_TOKEN');

			// Exit early if Okta isn't enabled or we're missing the access token
			if (!authWithOkta || !accessToken) {return [];}

			const existingPaymentMethods = await fetchJson(
				`${mdapiUrl}/user-attributes/me/existing-payment-options?currencyFilter=${currencyId}`,
				{
					mode: 'cors',
					credentials: 'include',
					// Okta authorization uses the Authorization header rather than a cookie
					headers: oktaAuthHeader(authWithOkta, accessToken),
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
