// @flow

// ----- Imports ----- //

import type { Action } from './directDebitActions';

// ----- Setup ----- //

export type DirectDebitState = {
  isPopUpOpen: boolean,
  sortCodeArray: Array<string>,
  bankAccountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  formError: string
};


const initialState: DirectDebitState = {
  isPopUpOpen: false,
  sortCodeArray: Array(3).fill(''),
  bankAccountNumber: '',
  accountHolderName: '',
  accountHolderConfirmation: false,
  formError: '',
};


// ----- Reducers ----- //

const directDebitReducer = (
  state: DirectDebitState = initialState,
  action: Action,
): DirectDebitState => {

  switch (action.type) {

    case 'DIRECT_DEBIT_POP_UP_OPEN':

      return Object.assign({}, state, {
        isPopUpOpen: true,
      });

    case 'DIRECT_DEBIT_POP_UP_CLOSE':

      return Object.assign({}, state, {
        isPopUpOpen: false,
      });

    case 'DIRECT_DEBIT_UPDATE_SORT_CODE':
      initialState.sortCodeArray[action.index] = action.partialSortCode;
      return Object.assign({}, state, {
        sortCode: initialState.sortCodeArray,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER':

      return Object.assign({}, state, {
        bankAccountNumber: action.accountNumber,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME':

      return Object.assign({}, state, {
        accountHolderName: action.accountHolderName,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION':
      return Object.assign({}, state, {
        accountHolderConfirmation: action.accountHolderConfirmation,
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

    default:
      return state;

  }

};


// ----- Exports ----- //

export { directDebitReducer };
