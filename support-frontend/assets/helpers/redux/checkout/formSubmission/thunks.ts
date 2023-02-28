import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { FormSubmissionStatus } from './state';

export const submitForm = createAsyncThunk<
	FormSubmissionStatus,
	PaymentAuthorisation,
	{
		state: SubscriptionsState | ContributionsState;
		rejectValue: string;
	}
>(
	'formSubmission',
	function submitForm(_paymentAuthorisation: PaymentAuthorisation) {
		return 'success';
	},
);
