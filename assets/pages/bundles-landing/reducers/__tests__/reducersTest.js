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

    expect(reducer(undefined, action).contribution.type).toEqual(contribType);
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

    expect(reducer(undefined, action).contribution.amount.recurring).toEqual(amount);
    expect(reducer(undefined, action).contribution.amount.oneOff).toEqual(amount);
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

    expect(reducer(undefined, action).contribution.amount.recurring).toEqual(amount);
    expect(reducer(undefined, action).contribution.amount.oneOff.value).toMatchSnapshot();
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

    expect(reducer(undefined, action).contribution.amount.oneOff).toEqual(amount);
    expect(reducer(undefined, action).contribution.amount.recurring.value).toMatchSnapshot();
  });
});
