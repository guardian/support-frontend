import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { StripePaymentIntentResult } from 'helpers/forms/stripe';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { routes } from 'helpers/urls/routes';

type SetupIntentData = {
	token: string;
	stripePublicKey: string;
	isTestUser: boolean;
};

export const getSetupIntent = createAsyncThunk<
	string,
	SetupIntentData,
	{
		state: SubscriptionsState | ContributionsState;
	}
>(
	'stripeCard/getSetupIntent',
	async function fetchSetupIntent(setupIntentData, thunkApi) {
		const { csrf } = thunkApi.getState().page.checkoutForm;
		const result: StripePaymentIntentResult = await fetchJson(
			routes.stripeSetupIntentRecaptcha,
			requestOptions(setupIntentData, 'same-origin', 'POST', csrf),
		);
		if (result.client_secret) {
			return result.client_secret;
		} else {
			throw new Error(
				`Missing client_secret field in response from ${routes.stripeSetupIntentRecaptcha}`,
			);
		}
	},
);
