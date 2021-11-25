import {
	closeDirectDebitGuarantee,
	closeDirectDebitPopUp,
	openDirectDebitGuarantee,
	openDirectDebitPopUp,
	resetDirectDebitFormError,
	setDirectDebitFormError,
	updateAccountHolderConfirmation,
	updateAccountHolderName,
	updateAccountNumber,
	updateSortCode,
	updateSortCodeString,
} from '../directDebitActions';

describe('actions', () => {
	it('should create an action to open the direct debit pop up', () => {
		const expectedAction = {
			type: 'DIRECT_DEBIT_POP_UP_OPEN',
		};
		expect(openDirectDebitPopUp()).toEqual(expectedAction);
	});
	it('should create an action to close the direct debit pop up', () => {
		const expectedAction = {
			type: 'DIRECT_DEBIT_POP_UP_CLOSE',
		};
		expect(closeDirectDebitPopUp()).toEqual(expectedAction);
	});
	it('should create an action to open the direct debit guarantee section', () => {
		const expectedAction = {
			type: 'DIRECT_DEBIT_GUARANTEE_OPEN',
		};
		expect(openDirectDebitGuarantee()).toEqual(expectedAction);
	});
	it('should create an action to close the direct debit guarantee section', () => {
		const expectedAction = {
			type: 'DIRECT_DEBIT_GUARANTEE_CLOSE',
		};
		expect(closeDirectDebitGuarantee()).toEqual(expectedAction);
	});
	it('should create an action to update the sort code', () => {
		const partialSortCode = '12';
		const expectedAction = {
			type: 'DIRECT_DEBIT_UPDATE_SORT_CODE',
			index: 0,
			partialSortCode,
		};
		expect(updateSortCode(0, partialSortCode)).toEqual(expectedAction);
	});
	it('should create an action to update the sort code string', () => {
		const sortCodeString = '121212';
		const expectedAction = {
			type: 'DIRECT_DEBIT_UPDATE_SORT_CODE_STRING',
			sortCodeString,
		};
		expect(updateSortCodeString(sortCodeString)).toEqual(expectedAction);
	});
	it('should create an action to update the account number', () => {
		const accountNumber = '123456789';
		const expectedAction = {
			type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER',
			accountNumber,
		};
		expect(updateAccountNumber(accountNumber)).toEqual(expectedAction);
	});
	it('should create an action to update the account holder name', () => {
		const accountHolderName = 'John Doe';
		const expectedAction = {
			type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME',
			accountHolderName,
		};
		expect(updateAccountHolderName(accountHolderName)).toEqual(expectedAction);
	});
	it('should create an action to update the account holder confirmation', () => {
		const accountHolderConfirmation = true;
		const expectedAction = {
			type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION',
			accountHolderConfirmation,
		};
		expect(updateAccountHolderConfirmation(accountHolderConfirmation)).toEqual(
			expectedAction,
		);
	});
	it('should create an action to set the error message in the direct debit form', () => {
		const message = 'this is an error';
		const expectedAction = {
			type: 'DIRECT_DEBIT_SET_FORM_ERROR',
			message,
		};
		expect(setDirectDebitFormError(message)).toEqual(expectedAction);
	});
	it('should create an action to reset the error message in the direct debit form', () => {
		const expectedAction = {
			type: 'DIRECT_DEBIT_RESET_FORM_ERROR',
		};
		expect(resetDirectDebitFormError()).toEqual(expectedAction);
	});
});
