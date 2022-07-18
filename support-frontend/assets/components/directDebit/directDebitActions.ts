import type { Dispatch } from 'redux';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import {
	resetFormError,
	setFormError,
	setPhase,
	setPopupClose,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import * as storage from 'helpers/storage/storage';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { checkAccount } from './helpers/ajax';

// ----- Types ----- //
export type SortCodeIndex = 0 | 1 | 2;
export type Phase = 'entry' | 'confirmation';
export type Action =
	| {
			type: 'DIRECT_DEBIT_POP_UP_OPEN';
	  }
	| {
			type: 'DIRECT_DEBIT_POP_UP_CLOSE';
	  }
	| {
			type: 'DIRECT_DEBIT_GUARANTEE_OPEN';
	  }
	| {
			type: 'DIRECT_DEBIT_GUARANTEE_CLOSE';
	  }
	| {
			type: 'DIRECT_DEBIT_UPDATE_SORT_CODE';
			index: SortCodeIndex;
			partialSortCode: string;
	  }
	| {
			type: 'DIRECT_DEBIT_UPDATE_SORT_CODE_STRING';
			sortCodeString: string;
	  }
	| {
			type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER';
			accountNumber: string;
	  }
	| {
			type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME';
			accountHolderName: string;
	  }
	| {
			type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION';
			accountHolderConfirmation: boolean;
	  }
	| {
			type: 'DIRECT_DEBIT_SET_FORM_ERROR';
			message: string;
	  }
	| {
			type: 'DIRECT_DEBIT_RESET_FORM_ERROR';
	  }
	| {
			type: 'DIRECT_DEBIT_SET_FORM_PHASE';
			phase: Phase;
	  };

// ----- Actions ----- //
const openDirectDebitPopUp = (): Action => {
	storage.setSession('selectedPaymentMethod', DirectDebit);
	return {
		type: 'DIRECT_DEBIT_POP_UP_OPEN',
	};
};

const closeDirectDebitPopUp = (): Action => ({
	type: 'DIRECT_DEBIT_POP_UP_CLOSE',
});

const openDirectDebitGuarantee = (): Action => ({
	type: 'DIRECT_DEBIT_GUARANTEE_OPEN',
});

const closeDirectDebitGuarantee = (): Action => ({
	type: 'DIRECT_DEBIT_GUARANTEE_CLOSE',
});

const updateSortCode = (
	index: SortCodeIndex,
	partialSortCode: string,
): Action => ({
	type: 'DIRECT_DEBIT_UPDATE_SORT_CODE',
	index,
	partialSortCode,
});

const updateSortCodeString = (sortCodeString: string): Action => ({
	type: 'DIRECT_DEBIT_UPDATE_SORT_CODE_STRING',
	sortCodeString,
});

const updateAccountNumber = (accountNumber: string): Action => ({
	type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER',
	accountNumber,
});

const updateAccountHolderName = (accountHolderName: string): Action => ({
	type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME',
	accountHolderName,
});

const updateAccountHolderConfirmation = (
	accountHolderConfirmation: boolean,
): Action => ({
	type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION',
	accountHolderConfirmation,
});

const setDirectDebitFormError = (message: string): Action => ({
	type: 'DIRECT_DEBIT_SET_FORM_ERROR',
	message,
});

const resetDirectDebitFormError = (): Action => ({
	type: 'DIRECT_DEBIT_RESET_FORM_ERROR',
});

const setDirectDebitFormPhase = (phase: Phase): Action => ({
	type: 'DIRECT_DEBIT_SET_FORM_PHASE',
	phase,
});

const directDebitErrorMessages = {
	invalidInput:
		'Your bank details are invalid. Please check them and try again',
	incorrectInput:
		'Your bank details are not correct. Please check them and try again',
	default: 'Oops, something went wrong, please try again later',
};

type DirectDebitConfirmationResponse = {
	accountValid: boolean;
};

function payDirectDebitClicked(): (
	dispatch: Dispatch,
	getState: () => CheckoutState,
) => void {
	return async (dispatch, getState) => {
		const {
			sortCodeString,
			sortCodeArray,
			accountNumber,
			accountHolderConfirmation,
		} = getState().page.checkoutForm.payment.directDebit;
		const recaptchaCompleted = getState().page.checkoutForm.recaptcha.completed;
		const sortCode = sortCodeArray.join('') || sortCodeString;
		const isTestUser = getState().page.user.isTestUser ?? false;
		const { csrf } = getState().page.checkoutForm;
		dispatch(resetFormError());

		if (!accountHolderConfirmation) {
			return dispatch(
				setFormError('You need to confirm that you are the account holder.'),
			);
		}

		if (!recaptchaCompleted) {
			return dispatch(
				setFormError("Please check the 'I'm not a robot' checkbox"),
			);
		}

		try {
			const response = await checkAccount(
				sortCode,
				accountNumber,
				isTestUser,
				csrf,
			);
			if (!response.ok) {
				return dispatch(setFormError(directDebitErrorMessages.invalidInput));
			}
			const checkAccountStatus =
				(await response.json()) as DirectDebitConfirmationResponse;

			if (!checkAccountStatus.accountValid) {
				return dispatch(setFormError(directDebitErrorMessages.incorrectInput));
			}

			return dispatch(setPhase('confirmation'));
		} catch (error) {
			return dispatch(setFormError(directDebitErrorMessages.default));
		}
	};
}

function confirmDirectDebitClicked(
	onPaymentAuthorisation: (authorisation: PaymentAuthorisation) => void,
): (dispatch: Dispatch, getState: () => CheckoutState) => void {
	return (dispatch, getState) => {
		const { sortCodeString, sortCodeArray, accountNumber, accountHolderName } =
			getState().page.checkoutForm.payment.directDebit;
		const sortCode = sortCodeArray.join('') || sortCodeString;
		onPaymentAuthorisation({
			paymentMethod: DirectDebit,
			accountHolderName,
			sortCode,
			accountNumber,
		});
		return dispatch(setPopupClose());
	};
}

// ----- Exports ----//
export {
	openDirectDebitPopUp,
	closeDirectDebitPopUp,
	openDirectDebitGuarantee,
	closeDirectDebitGuarantee,
	updateSortCode,
	updateSortCodeString,
	updateAccountNumber,
	updateAccountHolderName,
	updateAccountHolderConfirmation,
	setDirectDebitFormError,
	resetDirectDebitFormError,
	payDirectDebitClicked,
	confirmDirectDebitClicked,
	setDirectDebitFormPhase,
};
