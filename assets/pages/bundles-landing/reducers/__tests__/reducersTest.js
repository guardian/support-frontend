// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';

import reducer from '../reducers';


// ----- Tests ----- //

jest.mock('ophan', () => {});

describe('reducer tests', () => {

  it('should return the initial state', () => {

    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE to ONE_OFF', () => {

    const contribType: Contrib = 'ONE_OFF';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toEqual(contribType);
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE to MONTHLY', () => {

    const contribType: Contrib = 'MONTHLY';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toEqual(contribType);
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE to ANNUAL', () => {

    const contribType: Contrib = 'ANNUAL';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toEqual(contribType);
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT', () => {

    const amount: Amount = {
      value: '50',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT',
      amount,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.monthly).toEqual(amount);
    expect(newState.amount.oneOff).toEqual(amount);
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_MONTHLY', () => {

    const amount: Amount = {
      value: '45',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY',
      amount,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.monthly).toEqual(amount);
    expect(newState.amount.oneOff).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_ANNUAL', () => {

    const amount: Amount = {
      value: '50',
      userDefined: false,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL',
      amount,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.annual).toEqual(amount);
    expect(newState.amount.oneOff).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_ONEOFF', () => {

    const amount: Amount = {
      value: '45',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF',
      amount,
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.oneOff).toEqual(amount);
    expect(newState.amount.monthly).toMatchSnapshot();
  });
});
