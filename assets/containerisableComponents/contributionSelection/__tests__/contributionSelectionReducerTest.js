// @flow

// ----- Imports ----- //

import { contributionSelectionReducerFor } from '../contributionSelectionReducer';
import { contributionSelectionActionsFor } from '../contributionSelectionActions';


// ----- Tests ----- //

describe('Contributions Selection reducer', () => {

  const PREFIX = 'MY_PREFIX';
  const reducer = contributionSelectionReducerFor(PREFIX, 'GBPCountries');
  const actions = contributionSelectionActionsFor(PREFIX);

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should not change the state for an action with the wrong scope', () => {

    const otherActions = contributionSelectionActionsFor('OTHER_PREFIX');

    const changeContributionType = otherActions.setContributionType('ONE_OFF');
    expect(reducer(undefined, changeContributionType)).toMatchSnapshot();

    const changeAmount = otherActions.setAmount('42');
    expect(reducer(undefined, changeAmount)).toMatchSnapshot();

    const changeCustomAmount = otherActions.setCustomAmount('42');
    expect(reducer(undefined, changeCustomAmount)).toMatchSnapshot();

  });

  it('should handle SET_CONTRIBUTION_TYPE', () => {

    const contributionType = 'ONE_OFF';

    const changeContributionType = actions.setContributionType(contributionType);
    expect(reducer(undefined, changeContributionType).contributionType).toEqual(contributionType);

  });

  it('should re-parse custom amounts when SET_CONTRIBUTION_TYPE is fired for MONTHLY', () => {

    const contributionType = 'MONTHLY';
    const initialState = {
      contributionType: 'ONE_OFF',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: '1',
      isCustomAmount: true,
      error: null,
    };

    const changeContributionType = actions.setContributionType(contributionType, 'GBPCountries');
    const newState = reducer(initialState, changeContributionType);
    expect(newState.error).toEqual('tooLittle');

  });

  it('should re-parse custom amounts when SET_CONTRIBUTION_TYPE is fired for ONE_OFF', () => {

    const contributionType = 'ONE_OFF';
    const initialState = {
      contributionType: 'MONTHLY',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: '1',
      isCustomAmount: true,
      error: 'tooLittle',
    };

    const changeContributionType = actions.setContributionType(contributionType, 'GBPCountries');
    const newState = reducer(initialState, changeContributionType);
    expect(newState.error).toBeNull();

  });

  it('should handle SET_AMOUNT for one-off', () => {

    const amount = '42';
    const initialState = {
      contributionType: 'ONE_OFF',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: null,
      isCustomAmount: false,
      error: null,
    };

    const newState = reducer(initialState, actions.setAmount(amount));

    expect(newState.oneOffAmount).toEqual(amount);
    expect(newState.monthlyAmount).toEqual(initialState.monthlyAmount);
    expect(newState.annualAmount).toEqual(initialState.annualAmount);
    expect(newState.isCustomAmount).toEqual(false);
    expect(newState.error).toBeNull();

  });

  it('should handle SET_AMOUNT for monthly', () => {

    const amount = '42';
    const initialState = {
      contributionType: 'MONTHLY',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: null,
      isCustomAmount: false,
      error: null,
    };

    const newState = reducer(initialState, actions.setAmount(amount));

    expect(newState.monthlyAmount).toEqual(amount);
    expect(newState.oneOffAmount).toEqual(initialState.oneOffAmount);
    expect(newState.annualAmount).toEqual(initialState.annualAmount);
    expect(newState.isCustomAmount).toEqual(false);
    expect(newState.error).toBeNull();

  });

  it('should handle SET_AMOUNT for annual', () => {

    const amount = '42';
    const initialState = {
      contributionType: 'ANNUAL',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: null,
      isCustomAmount: false,
      error: null,
    };

    const newState = reducer(initialState, actions.setAmount(amount));

    expect(newState.annualAmount).toEqual(amount);
    expect(newState.oneOffAmount).toEqual(initialState.oneOffAmount);
    expect(newState.monthlyAmount).toEqual(initialState.monthlyAmount);
    expect(newState.isCustomAmount).toEqual(false);
    expect(newState.error).toBeNull();

  });

  it('should handle SET_CUSTOM_AMOUNT', () => {

    const amount = '42';
    const initialState = {
      contributionType: 'ONE_OFF',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: null,
      isCustomAmount: false,
      error: null,
    };

    const newState = reducer(initialState, actions.setCustomAmount(amount, 'GBPCountries'));

    expect(newState.customAmount).toEqual(Number(amount));
    expect(newState.isCustomAmount).toEqual(true);
    expect(newState.error).toBeNull();

  });

  it('should handle SET_CUSTOM_AMOUNT errors', () => {

    const amount = 'notanumber';
    const initialState = {
      contributionType: 'ONE_OFF',
      oneOffAmount: '50',
      monthlyAmount: '5',
      annualAmount: '75',
      customAmount: null,
      isCustomAmount: false,
      error: null,
    };

    const newState = reducer(initialState, actions.setCustomAmount(amount, 'GBPCountries'));

    expect(newState.customAmount).toBeNull();
    expect(newState.error).toEqual('invalidEntry');

  });

});
