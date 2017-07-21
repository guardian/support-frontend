// @flow
import reducer from '../reducers';
import type { Contrib, ContribState, Amount } from '../reducers';

jest.mock('ophan', () => {});

describe('reducer tests', () => {

  it('should return the initial state', () => {

    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_TYPE', () => {

    const contribType: Contrib = 'ONE_OFF';
    const action = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };

    const newState = reducer(undefined, action);

    expect(newState.contribution.type).toEqual(contribType);
    expect(newState.contribution.error).toMatchSnapshot();
    expect(newState.contribution.amount).toMatchSnapshot();
  });

  it('should handle CHANGE_CONTRIB_AMOUNT', () => {

    const amount: Amount = {
      value: '45',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT',
      amount,
    };

    const newState = reducer(undefined, action);

    expect(newState.contribution.type).toMatchSnapshot();
    expect(newState.contribution.error).toMatchSnapshot();
    expect(newState.contribution.amount.recurring).toEqual(amount);
    expect(newState.contribution.amount.oneOff).toEqual(amount);
  });

  it('should handle CHANGE_CONTRIB_AMOUNT_RECURRING', () => {

    const amount: Amount = {
      value: '45',
      userDefined: true,
    };
    const action = {
      type: 'CHANGE_CONTRIB_AMOUNT_RECURRING',
      amount,
    };

    const newState = reducer(undefined, action);

    expect(newState.contribution.type).toMatchSnapshot();
    expect(newState.contribution.error).toMatchSnapshot();
    expect(newState.contribution.amount.recurring).toEqual(amount);
    expect(newState.contribution.amount.oneOff).toMatchSnapshot();
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

    expect(newState.contribution.type).toMatchSnapshot();
    expect(newState.contribution.error).toMatchSnapshot();
    expect(newState.contribution.amount.oneOff).toEqual(amount);
    expect(newState.contribution.amount.recurring).toMatchSnapshot();
  });
});
