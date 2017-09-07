// @flow
import {
  changeContribType,
  changeContribAmountOneOff, changeContribAmountMonthly, changeContribAmountAnnual,
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

  it('should create an action to change to annual contribution type', () => {
    const contribType: Contrib = 'ANNUAL';
    const expectedAction = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };
    expect(changeContribType(contribType)).toEqual(expectedAction);
  });

  it('should create an action to change to monthly contribution type', () => {
    const contribType: Contrib = 'MONTHLY';
    const expectedAction = {
      type: 'CHANGE_CONTRIB_TYPE',
      contribType,
    };
    expect(changeContribType(contribType)).toEqual(expectedAction);
  });

  it('should create an action to change the amount of an annual contribution', () => {
    const contribAmount: Contrib = {
      value: '5',
      userDefined: false,
    };
    const expectedAction = {
      type: 'CHANGE_CONTRIB_AMOUNT_ANNUAL',
      amount: contribAmount,
    };
    expect(changeContribAmountAnnual(contribAmount)).toEqual(expectedAction);
  });

  it('should create an action to change the amount of a monthly contribution', () => {
    const contribAmount: Contrib = {
      value: '5',
      userDefined: false,
    };
    const expectedAction = {
      type: 'CHANGE_CONTRIB_AMOUNT_MONTHLY',
      amount: contribAmount,
    };
    expect(changeContribAmountMonthly(contribAmount)).toEqual(expectedAction);
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

