import { createAsyncThunk } from '@reduxjs/toolkit';
import { checkAccount } from 'components/directDebit/helpers/ajax';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';

export const directDebitErrorMessages = {
	notConfirmed: 'You need to confirm that you are the account holder.',
	notCompletedRecaptcha: "Please check the 'I'm not a robot' checkbox",
	invalidInput:
		'Your bank details are invalid. Please check them and try again',
	incorrectInput:
		'Your bank details are not correct. Please check them and try again',
	default: 'Oops, something went wrong, please try again later',
};

type DirectDebitConfirmationResponse = {
	accountValid: boolean;
};

export const confirmAccountDetails = createAsyncThunk<
	boolean,
	void,
	{
		state: SubscriptionsState | ContributionsState;
	}
>(
	'directDebit/confirmAccountDetails',
	async function confirmAccountDetails(_, { getState }) {
		const {
			sortCodeString,
			sortCodeArray,
			accountNumber,
			accountHolderConfirmation,
		} = getState().page.checkoutForm.payment.directDebit;
		const sortCode = sortCodeArray.join('') || sortCodeString;
		const isTestUser = getState().page.user.isTestUser ?? false;
		const { csrf } = getState().page.checkoutForm;

		if (!accountHolderConfirmation) {
			throw new Error(directDebitErrorMessages.notConfirmed);
		}

		const response = await checkAccount(
			sortCode,
			accountNumber,
			isTestUser,
			csrf,
		);
		if (!response.ok) {
			throw new Error(directDebitErrorMessages.invalidInput);
		}
		const checkAccountStatus =
			(await response.json()) as DirectDebitConfirmationResponse;

		return checkAccountStatus.accountValid;
	},
);

export const payWithDirectDebit = createAsyncThunk<
	void,
	(authorisation: PaymentAuthorisation) => void,
	{
		state: SubscriptionsState | ContributionsState;
		rejectValue: string;
	}
>(
	'directDebit/payWithDirectDebit',
	function payWithDirectDebit(onPaymentAuthorisation, { getState }) {
		const { sortCodeString, sortCodeArray, accountNumber, accountHolderName } =
			getState().page.checkoutForm.payment.directDebit;
		const sortCode = sortCodeArray.join('') || sortCodeString;
		onPaymentAuthorisation({
			paymentMethod: DirectDebit,
			accountHolderName,
			sortCode,
			accountNumber,
		});
	},
);
