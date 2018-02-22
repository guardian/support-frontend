// @flow

import * as storage from 'helpers/storage';

import { checkAccount } from './helpers/ajax';


// ----- Types ----- //

export type Action =
  | { type: 'DIRECT_DEBIT_POP_UP_OPEN' }
  | { type: 'DIRECT_DEBIT_POP_UP_CLOSE' }
  | { type: 'DIRECT_DEBIT_UPDATE_SORT_CODE', index: number, partialSortCode: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', accountNumber: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', accountHolderName: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION', accountHolderConfirmation: boolean }
  | { type: 'DIRECT_DEBIT_SET_FORM_ERROR', message: string }
  | { type: 'DIRECT_DEBIT_RESET_FORM_ERROR' };


// ----- Actions ----- //

const openDirectDebitPopUp = (): Action => {
  storage.setSession('paymentMethod', 'DirectDebit');
  return { type: 'DIRECT_DEBIT_POP_UP_OPEN' };
};

const closeDirectDebitPopUp = (): Action =>
  ({ type: 'DIRECT_DEBIT_POP_UP_CLOSE' });

const updateSortCode = (index: number, partialSortCode: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_SORT_CODE', index, partialSortCode });

const updateAccountNumber = (accountNumber: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', accountNumber });

const updateAccountHolderName = (accountHolderName: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', accountHolderName });

const updateAccountHolderConfirmation = (accountHolderConfirmation: boolean): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION', accountHolderConfirmation });

const setDirectDebitFormError = (message: string): Action =>
  ({ type: 'DIRECT_DEBIT_SET_FORM_ERROR', message });

const resetDirectDebitFormError = (): Action =>
  ({ type: 'DIRECT_DEBIT_RESET_FORM_ERROR' });


function payDirectDebitClicked(callback: Function): Function {

  return (dispatch: Function, getState: Function) => {

    const {
      sortCode,
      bankAccountNumber,
      accountHolderName,
      accountHolderConfirmation,
    } = getState().page.directDebit;

    const bankSortCode = sortCode.join('');
    const isTestUser: boolean = getState().page.user.isTestUser || false;
    const { csrf } = getState().page;

    dispatch(resetDirectDebitFormError());

    if (!accountHolderConfirmation) {
      dispatch(setDirectDebitFormError('You need to confirm that you are the account holder.'));
      return;
    }

    checkAccount(bankSortCode, bankAccountNumber, isTestUser, csrf)
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
        callback(undefined, bankAccountNumber, bankSortCode, accountHolderName);
        dispatch(closeDirectDebitPopUp());
      })
      .catch((e) => {
        let msg = '';
        switch (e.message) {
          case 'invalid_input': msg = 'Your bank details are invalid. Please check them and try again';
            break;
          case 'incorrect_input': msg = 'Your bank details are not correct. Please check them and try again';
            break;
          default: msg = 'Oops, something went wrong, please try again later';

        }
        dispatch(setDirectDebitFormError(msg));
      });
  };
}

// ----- Exports ----//

export {
  openDirectDebitPopUp,
  closeDirectDebitPopUp,
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
  setDirectDebitFormError,
  resetDirectDebitFormError,
  payDirectDebitClicked,
};
