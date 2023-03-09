import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type {
	PaymentAuthorisation,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { postRegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import trackConversion from 'helpers/tracking/conversions';
import { routes } from 'helpers/urls/routes';
import { getContributionType } from '../product/selectors/productType';
import type { GuardianProduct } from '../product/state';
import { regularPaymentRequestFromAuthorisation } from './recurringPayment';
import type { FormSubmissionStatus } from './state';

type FormSubmitRejectedMeta = {
	product: GuardianProduct;
	paymentMethod: PaymentMethod;
	stripePaymentMethod?: StripePaymentMethod;
	errorMessage?: ErrorReason;
};

export const submitForm = createAsyncThunk<
	FormSubmissionStatus,
	PaymentAuthorisation,
	{
		state: ContributionsState;
		rejectValue: FormSubmissionStatus;
		rejectedMeta: FormSubmitRejectedMeta;
	}
>(
	'formSubmission/submitForm',
	async function submitForm(
		paymentAuthorisation: PaymentAuthorisation,
		thunkApi,
	) {
		const { rejectWithValue } = thunkApi;
		const state = thunkApi.getState();
		const request = regularPaymentRequestFromAuthorisation(
			paymentAuthorisation,
			state,
		);

		const paymentRequestResult = await postRegularPaymentRequest(
			routes.recurringContribCreate,
			request,
			state.common.abParticipations,
			state.page.checkoutForm.csrf,
		);

		if (paymentRequestResult.paymentStatus === 'success') {
			trackConversion(state.common.abParticipations, '/contribute/thankyou');
			return 'success';
		}

		if (paymentAuthorisation.paymentMethod == Stripe) {
			return rejectWithValue('error', {
				paymentMethod: paymentAuthorisation.paymentMethod,
				product: getContributionType(state),
				stripePaymentMethod: paymentAuthorisation.stripePaymentMethod,
				errorMessage: paymentRequestResult.error,
			});
		}

		return rejectWithValue('error', {
			paymentMethod: paymentAuthorisation.paymentMethod,
			product: getContributionType(state),
			errorMessage: paymentRequestResult.error,
		});
	},
);
