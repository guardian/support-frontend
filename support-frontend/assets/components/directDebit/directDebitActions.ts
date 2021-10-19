import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import * as storage from 'helpers/storage/storage';
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

function payDirectDebitClicked(): (...args: any[]) => any {
	return (
		dispatch: (...args: any[]) => any,
		getState: (...args: any[]) => any,
	) => {
		const {
			sortCodeString,
			sortCodeArray,
			accountNumber,
			accountHolderConfirmation,
		} = getState().page.directDebit;
		const sortCode = sortCodeArray.join('') || sortCodeString;
		const isTestUser: boolean = getState().page.user.isTestUser || false;
		const { csrf } = getState().page;
		dispatch(resetDirectDebitFormError());

		if (!accountHolderConfirmation) {
			dispatch(
				setDirectDebitFormError(
					'You need to confirm that you are the account holder.',
				),
			);
			return;
		}

		checkAccount(sortCode, accountNumber, isTestUser, csrf)
			.then((response) => {
				if (!response.ok) {
					throw new Error('invalid_input');
				}

				return response.json();
			})
			.then((response) => {
				if (!response.accountValid) {
					throw new Error('incorrect_input');
				}

				dispatch(setDirectDebitFormPhase('confirmation'));
			})
			.catch((e) => {
				let msg = '';

				switch (e.message) {
					case 'invalid_input':
						msg =
							'Your bank details are invalid. Please check them and try again';
						break;

					case 'incorrect_input':
						msg =
							'Your bank details are not correct. Please check them and try again';
						break;

					default:
						msg = 'Oops, something went wrong, please try again later';
				}

				dispatch(setDirectDebitFormError(msg));
			});
	};
}

function confirmDirectDebitClicked(
	onPaymentAuthorisation: (arg0: PaymentAuthorisation) => void,
): (...args: any[]) => any {
	return (
		dispatch: (...args: any[]) => any,
		getState: (...args: any[]) => any,
	) => {
		const { sortCodeString, sortCodeArray, accountNumber, accountHolderName } =
			getState().page.directDebit;
		const sortCode = sortCodeArray.join('') || sortCodeString;
		onPaymentAuthorisation({
			paymentMethod: DirectDebit,
			accountHolderName,
			sortCode,
			accountNumber,
		});
		dispatch(closeDirectDebitPopUp());
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
