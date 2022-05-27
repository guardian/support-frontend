import type { Action } from '../directDebitActions';
import {
	closeDirectDebitGuarantee,
	closeDirectDebitPopUp,
	openDirectDebitGuarantee,
	openDirectDebitPopUp,
	resetDirectDebitFormError,
	setDirectDebitFormError,
	setDirectDebitFormPhase,
	updateAccountHolderConfirmation,
	updateAccountHolderName,
	updateAccountNumber,
	updateSortCode,
	updateSortCodeString,
} from '../directDebitActions';
import { directDebitReducer as reducer } from '../directDebitReducer';

// ----- Tests ----- //

describe('direct debit reducer tests', () => {
	const nonExistentAction = {
		type: 'DOES_NOT_EXIST',
	} as unknown as Action;

	it('should return the initial state', () => {
		expect(reducer(undefined, nonExistentAction)).toMatchSnapshot();
	});

	it('should handle DIRECT_DEBIT_POP_UP_OPEN', () => {
		const action = openDirectDebitPopUp();
		const newState = reducer(undefined, action);
		expect(newState.isPopUpOpen).toEqual(true);
	});

	it('should handle DIRECT_DEBIT_POP_UP_CLOSE', () => {
		const action1 = openDirectDebitPopUp();
		const action2 = closeDirectDebitPopUp();
		let newState = reducer(undefined, action1);
		expect(newState.isPopUpOpen).toEqual(true);
		newState = reducer(newState, action2);
		expect(newState.isPopUpOpen).toEqual(false);
	});

	it('should handle DIRECT_DEBIT_GUARANTEE_OPEN', () => {
		const action = openDirectDebitGuarantee();
		const newState = reducer(undefined, action);
		expect(newState.isDDGuaranteeOpen).toEqual(true);
	});

	it('should handle DIRECT_DEBIT_GUARANTEE_CLOSE', () => {
		const action1 = openDirectDebitGuarantee();
		const action2 = closeDirectDebitGuarantee();
		let newState = reducer(undefined, action1);
		expect(newState.isDDGuaranteeOpen).toEqual(true);
		newState = reducer(newState, action2);
		expect(newState.isDDGuaranteeOpen).toEqual(false);
	});

	it('should handle DIRECT_DEBIT_UPDATE_SORT_CODE', () => {
		const sortCode = '123456';
		const firstUpdate = reducer(undefined, updateSortCode(0, '12'));
		const secondUpdate = reducer(firstUpdate, updateSortCode(1, '34'));
		const thirdUpdate = reducer(secondUpdate, updateSortCode(2, '56'));
		expect(thirdUpdate.sortCodeArray.join('')).toEqual(sortCode);
	});

	it('should handle DIRECT_DEBIT_UPDATE_SORT_CODE_STRING', () => {
		const sortCodeSubmitted = '123456';
		const action = updateSortCodeString(sortCodeSubmitted);
		const newState = reducer(undefined, action);
		expect(newState.sortCodeString).toEqual(sortCodeSubmitted);
	});

	it('should handle DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', () => {
		const accountNumber = '12345678910';
		const action = updateAccountNumber(accountNumber);
		const newState = reducer(undefined, action);
		expect(newState.accountNumber).toEqual(accountNumber);
	});

	it('should handle DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', () => {
		const accountHolderName = 'John Doe';
		const action = updateAccountHolderName(accountHolderName);
		const newState = reducer(undefined, action);
		expect(newState.accountHolderName).toEqual(accountHolderName);
	});

	it('should handle DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION', () => {
		const accountHolderConfirmation = true;
		const action = updateAccountHolderConfirmation(accountHolderConfirmation);
		const newState = reducer(undefined, action);
		expect(newState.accountHolderConfirmation).toEqual(
			accountHolderConfirmation,
		);
	});

	it('should handle DIRECT_DEBIT_SET_FORM_ERROR', () => {
		const message = 'this is an error';
		const action = setDirectDebitFormError(message);
		const newState = reducer(undefined, action);
		expect(newState.formError).toEqual(message);
	});

	it('should handle DIRECT_DEBIT_RESET_FORM_ERROR', () => {
		const action = resetDirectDebitFormError();
		const newState = reducer(undefined, action);
		expect(newState.formError).toEqual('');
	});

	it('should handle DIRECT_DEBIT_SET_FORM_PHASE correctly', () => {
		const phaseConf = 'confirmation';
		const phaseEntry = 'entry';
		let action = setDirectDebitFormPhase(phaseConf);
		let newState = reducer(undefined, action);
		expect(newState.phase).toEqual(phaseConf);
		action = setDirectDebitFormPhase(phaseEntry);
		newState = reducer(undefined, action);
		expect(newState.phase).toEqual(phaseEntry);
	});
});
