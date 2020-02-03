// @flow

import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';

import { checkAccount } from './helpers/ajax';
import { DirectDebit } from 'helpers/paymentMethods';

// ----- Types ----- //

export type Phase = 'entry' | 'confirmation';

export type Action =
  | { type: 'DIRECT_DEBIT_UPDATE_SORT_CODE', sortCode: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', accountNumber: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', accountHolderName: string }
  | { type: 'DIRECT_DEBIT_SET_FORM_ERROR', message: string }
  | { type: 'DIRECT_DEBIT_RESET_FORM_ERROR' }
  | { type: 'DIRECT_DEBIT_SET_FORM_PHASE', phase: Phase };


// ----- Actions ----- //

const updateSortCode = (sortCode: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_SORT_CODE', sortCode });

const updateAccountNumber = (accountNumber: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', accountNumber });

const updateAccountHolderName = (accountHolderName: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', accountHolderName });

const setDirectDebitFormError = (message: string): Action =>
  ({ type: 'DIRECT_DEBIT_SET_FORM_ERROR', message });

const resetDirectDebitFormError = (): Action =>
  ({ type: 'DIRECT_DEBIT_RESET_FORM_ERROR' });

const setDirectDebitFormPhase = (phase: Phase): Action =>
  ({ type: 'DIRECT_DEBIT_SET_FORM_PHASE', phase });


function payDirectDebitClicked(): Function {
  return (dispatch: Function, getState: Function) => {

    const {
      sortCode,
      accountNumber,
    } = getState().page.directDebit;

    const isTestUser: boolean = getState().page.user.isTestUser || false;
    const { csrf } = getState().page;

    dispatch(resetDirectDebitFormError());

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

function confirmDirectDebitClicked(onPaymentAuthorisation: PaymentAuthorisation => void): Function {

  return (dispatch: Function, getState: Function) => {

    const {
      sortCode,
      accountNumber,
      accountHolderName,
    } = getState().page.directDebit;

    onPaymentAuthorisation({
      paymentMethod: DirectDebit,
      accountHolderName,
      sortCode,
      accountNumber,
    });

  };
}

// ----- Exports ----//

export {
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  setDirectDebitFormError,
  resetDirectDebitFormError,
  payDirectDebitClicked,
  confirmDirectDebitClicked,
  setDirectDebitFormPhase,
};
