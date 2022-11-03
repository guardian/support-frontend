import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import { billingPeriodFromContrib } from 'helpers/contributions';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { getContributionType } from '../../product/selectors/productType';
import { getUserSelectedAmount } from '../../product/selectors/selectedAmount';

export type PayPalTokenResolve = (token: string) => void;
export type PayPalTokenReject = (err: Error) => void;

type PayPalLoadFns = {
	resolve: PayPalTokenResolve;
	reject: PayPalTokenReject;
};

export const setUpPayPalPayment = createAsyncThunk<
	unknown,
	PayPalLoadFns,
	{
		state: ContributionsState;
	}
>('paypal/setUpPayment', async function setUp({ resolve, reject }, thunkApi) {
	try {
		const state = thunkApi.getState();
		const { currencyId } = state.common.internationalisation;
		const csrfToken = state.page.checkoutForm.csrf.token ?? '';
		const contributionType = getContributionType(state);
		const amount = getUserSelectedAmount(state);
		const billingPeriod = billingPeriodFromContrib(contributionType);

		const requestBody = {
			amount,
			billingPeriod,
			currency: currencyId,
			requireShippingAddress: false,
		};

		const payPalResponse = (await fetchJson(routes.payPalSetupPayment, {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Csrf-Token': csrfToken,
			},
			body: JSON.stringify(requestBody),
		})) as { token?: string };

		if (payPalResponse.token) {
			resolve(payPalResponse.token);
		} else {
			throw new Error('PayPal token came back blank');
		}
	} catch (error) {
		logException((error as Error).message);
		reject(error as Error);
	}
});

export const loadPayPalExpressSdk = createAsyncThunk(
	'paypal/loadPayPalExpressSdk',
	loadPayPalRecurring,
);
