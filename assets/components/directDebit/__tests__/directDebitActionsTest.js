// @flow
import {
  openDirectDebitPopUp,
  closeDirectDebitPopUp,
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
  setDirectDebitFormError,
  resetDirectDebitFormError,
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

  it('should create an action to update the sort code', () => {
    const sortCode: string = '123456';
    const expectedAction = {
      type: 'DIRECT_DEBIT_UPDATE_SORT_CODE',
      sortCode,
    };
    expect(updateSortCode(sortCode)).toEqual(expectedAction);
  });

  it('should create an action to update the account number', () => {
    const accountNumber: string = '123456789';
    const expectedAction = {
      type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER',
      accountNumber,
    };
    expect(updateAccountNumber(accountNumber)).toEqual(expectedAction);
  });

  it('should create an action to update the account holder name', () => {
    const accountHolderName: string = 'John Doe';
    const expectedAction = {
      type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME',
      accountHolderName,
    };
    expect(updateAccountHolderName(accountHolderName)).toEqual(expectedAction);
  });

  it('should create an action to update the account holder confirmation', () => {
    const accountHolderConfirmation: boolean = true;
    const expectedAction = {
      type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION',
      accountHolderConfirmation,
    };
    expect(updateAccountHolderConfirmation(accountHolderConfirmation)).toEqual(expectedAction);
  });

  it('should create an action to set the error message in the direct debit form', () => {
    const message: string = 'this is an error';
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

