// @flow

// ----- Imports ----- //

import type { Contrib, Amount } from 'helpers/contributions';

import { createContributionLandingReducer } from '../contributionsLandingReducers';


// ----- Tests ----- //

jest.mock('ophan', () => {});

describe('reducer tests', () => {

  it('should return the initial state', () => {

    const reducer = createContributionLandingReducer('10');

    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE to ONE_OFF', () => {

    const reducer = createContributionLandingReducer('10');
    const contribType: Contrib = 'ONE_OFF';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toEqual(contribType);
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE to MONTHLY', () => {

    const reducer = createContributionLandingReducer('10');
    const contribType: Contrib = 'MONTHLY';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toEqual(contribType);
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE to ANNUAL', () => {

    const reducer = createContributionLandingReducer('10');
    const contribType: Contrib = 'ANNUAL';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toEqual(contribType);
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT', () => {

    const reducer = createContributionLandingReducer('10');
    const amount: Amount = {
      value: '50',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT',
      amount,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.monthly).toEqual(amount);
    expect(newState.amount.oneOff).toEqual(amount);
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_MONTHLY', () => {

    const reducer = createContributionLandingReducer('10');
    const amount: Amount = {
      value: '45',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY',
      amount,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.monthly).toEqual(amount);
    expect(newState.amount.oneOff).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_ANNUAL', () => {

    const reducer = createContributionLandingReducer('10');
    const amount: Amount = {
      value: '50',
      userDefined: false,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL',
      amount,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.annual).toEqual(amount);
    expect(newState.amount.oneOff).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_ONEOFF', () => {

    const reducer = createContributionLandingReducer('10');
    const amount: Amount = {
      value: '45',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF',
      amount,
      countryGroupId: 'GBPCountries',
    };

    const newState = reducer(undefined, action);

    expect(newState.type).toMatchSnapshot();
    expect(newState.error).toMatchSnapshot();
    expect(newState.amount.oneOff).toEqual(amount);
    expect(newState.amount.monthly).toMatchSnapshot();
  });
});
