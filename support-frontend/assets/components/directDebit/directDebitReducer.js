// @flow

// ----- Imports ----- //

import type { Action, Phase } from './directDebitActions';

// ----- Setup ----- //

export type DirectDebitState = {
  sortCode: string,
  accountNumber: string,
  accountHolderName: string,
  formError: string,
  phase: Phase
};


const initialState: DirectDebitState = {
  sortCode: '',
  accountNumber: '',
  accountHolderName: '',
  formError: '',
  phase: 'entry',
};


// ----- Reducers ----- //

const directDebitReducer = (
  state: DirectDebitState = initialState,
  action: Action,
): DirectDebitState => {

  switch (action.type) {

    case 'DIRECT_DEBIT_UPDATE_SORT_CODE':
      initialState.sortCode = action.sortCode;
      return Object.assign({}, state, {
        sortCode: initialState.sortCode,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER':

      return Object.assign({}, state, {
        accountNumber: action.accountNumber,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME':

      return Object.assign({}, state, {
        accountHolderName: action.accountHolderName,
      });

    case 'DIRECT_DEBIT_SET_FORM_ERROR':
      return Object.assign({}, state, {
        formError: action.message,
      });

    case 'DIRECT_DEBIT_RESET_FORM_ERROR': {
      return Object.assign({}, state, {
        formError: '',
      });
    }

    case 'DIRECT_DEBIT_SET_FORM_PHASE': {
      return Object.assign({}, state, {
        phase: action.phase,
      });
    }

    default:
      return state;

  }

};


// ----- Exports ----- //

export { directDebitReducer };
