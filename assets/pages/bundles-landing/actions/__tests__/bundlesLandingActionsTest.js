// @flow
import {
  changeContribType,
  changeContribAmountRecurring,
  changeContribAmountOneOff,
} from '../bundlesLandingActions';


describe('actions', () => {

  it('should create an action to change to one off contribution type', () => {

    const contribType: Contrib = 'ONE_OFF';
    const expectedAction = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };
    expect(changeContribType(contribType)).toEqual(expectedAction);
  });

  it('should create an action to change to recurring contribution type', () => {
    const contribType: Contrib = 'RECURRING';
    const expectedAction = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };
    expect(changeContribType(contribType)).toEqual(expectedAction);
  });

  it('should create an action to change the amount of a recurring contribution', () => {
    const contribAmount: Contrib = {
      value: '5',
      userDefined: false,
    };
    const expectedAction = {
      type: 'CHANGE_CONTRIB_AMOUNT_RECURRING',
      amount: contribAmount,
    };
    expect(changeContribAmountRecurring(contribAmount)).toEqual(expectedAction);
  });

  it('should create an action to change the amount of a one off contribution', () => {
    const contribAmount: Contrib = {
      value: '5',
      userDefined: false,
    };
    const expectedAction = {
      type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF',
      amount: contribAmount,
    };
    expect(changeContribAmountOneOff(contribAmount)).toEqual(expectedAction);
  });
});

