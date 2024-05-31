import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import { billingPeriodFromContrib, getAmount } from 'helpers/contributions';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { getContributionType } from '../../product/selectors/productType';

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
		const errorsPreventOpening = contributionsFormHasErrors(state);

		if (errorsPreventOpening) {
			reject(new Error('form invalid'));
		}

		const { currencyId, countryId } = state.common.internationalisation;
		const csrfToken = state.page.checkoutForm.csrf.token ?? '';
		const contributionType = getContributionType(state);
		const { productPrices } = state.page.checkoutForm.product;
		const billingPeriod = billingPeriodFromContrib(contributionType);
		const promotion = getPromotion(productPrices, countryId, billingPeriod);
		const amount = getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		);
		const finalAmount = promotion?.discountedPrice ?? amount;

		const requestBody = {
			amount: finalAmount,
			billingPeriod,
			currency: currencyId,
			requireShippingAddress: false,
		};

		const payPalResponse = await fetchJson<{ token?: string }>(
			routes.payPalSetupPayment,
			{
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Csrf-Token': csrfToken,
				},
				body: JSON.stringify(requestBody),
			},
		);

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
