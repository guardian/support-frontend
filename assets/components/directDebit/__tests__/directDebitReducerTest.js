import { directDebitReducer as reducer } from '../directDebitReducer';

// ----- Tests ----- //

describe('direct debit reducer tests', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle DIRECT_DEBIT_POP_UP_OPEN', () => {
    const action = {
      type: 'DIRECT_DEBIT_POP_UP_OPEN',
    };

    const newState = reducer(undefined, action);
    expect(newState.isPopUpOpen).toEqual(true);
  });

  it('should handle DIRECT_DEBIT_POP_UP_CLOSE', () => {
    const action1 = {
      type: 'DIRECT_DEBIT_POP_UP_OPEN',
    };
    const action2 = {
      type: 'DIRECT_DEBIT_POP_UP_CLOSE',
    };

    let newState = reducer(undefined, action1);
    expect(newState.isPopUpOpen).toEqual(true);

    newState = reducer(newState, action2);
    expect(newState.isPopUpOpen).toEqual(false);
  });

  it('should handle DIRECT_DEBIT_GUARANTEE_OPEN', () => {
    const action = {
      type: 'DIRECT_DEBIT_GUARANTEE_OPEN',
    };

    const newState = reducer(undefined, action);
    expect(newState.isDDGuaranteeOpen).toEqual(true);
  });

  it('should handle DIRECT_DEBIT_GUARANTEE_CLOSE', () => {
    const action1 = {
      type: 'DIRECT_DEBIT_GUARANTEE_OPEN',
    };
    const action2 = {
      type: 'DIRECT_DEBIT_GUARANTEE_CLOSE',
    };

    let newState = reducer(undefined, action1);
    expect(newState.isDDGuaranteeOpen).toEqual(true);

    newState = reducer(newState, action2);
    expect(newState.isDDGuaranteeOpen).toEqual(false);
  });

  it('should handle DIRECT_DEBIT_UPDATE_SORT_CODE', () => {
    const sortCode = '123456';
    function action(index, partialSortCode) {
      return {
        type: 'DIRECT_DEBIT_UPDATE_SORT_CODE',
        index,
        partialSortCode,
      };
    }

    const firstUpdate = reducer(undefined, action(0, '12'));
    const secondUpdate = reducer(firstUpdate, action(1, '34'));
    const thirdUpdate = reducer(secondUpdate, action(2, '56'));

    expect(thirdUpdate.sortCodeArray.join('')).toEqual(sortCode);
  });

  it('should handle DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', () => {

    const accountNumber = '12345678910';
    const action = {
      type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER',
      accountNumber,
    };

    const newState = reducer(undefined, action);

    expect(newState.accountNumber).toEqual(accountNumber);
  });

  it('should handle DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', () => {

    const accountHolderName = 'John Doe';
    const action = {
      type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME',
      accountHolderName,
    };

    const newState = reducer(undefined, action);

    expect(newState.accountHolderName).toEqual(accountHolderName);
  });

  it('should handle DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION', () => {

    const accountHolderConfirmation = true;
    const action = {
      type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION',
      accountHolderConfirmation,
    };

    const newState = reducer(undefined, action);

    expect(newState.accountHolderConfirmation).toEqual(accountHolderConfirmation);
  });

  it('should handle DIRECT_DEBIT_SET_FORM_ERROR', () => {

    const message = 'this is an error';
    const action = {
      type: 'DIRECT_DEBIT_SET_FORM_ERROR',
      message,
    };

    const newState = reducer(undefined, action);

    expect(newState.formError).toEqual(message);
  });

  it('should handle DIRECT_DEBIT_RESET_FORM_ERROR', () => {

    const action = {
      type: 'DIRECT_DEBIT_RESET_FORM_ERROR',
    };

    const newState = reducer(undefined, action);

    expect(newState.formError).toEqual('');
  });
});

