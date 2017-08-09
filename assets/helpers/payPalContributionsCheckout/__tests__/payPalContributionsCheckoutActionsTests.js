// @flow
import {
  payPalContributionsButtonClicked,
  payPalContributionsSubmitPayment,
  setPayPalContributionsAmount,
  payPalContributionsError,
} from '../payPalContributionsCheckoutActions';

describe('PayPal Contributions Checkout\'s actions', () => {

  it('should create PAYPAL_PAY_CONTRIBUTIONS_CLICKED action', () => {
    const expectedAction = {
      type: 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED',
    };
    expect(payPalContributionsButtonClicked()).toEqual(expectedAction);
  });

  it('should create PAYPAL_CONTRIBUTIONS_SUBMIT action', () => {
    const expectedAction = {
      type: 'PAYPAL_CONTRIBUTIONS_SUBMIT',
    };
    expect(payPalContributionsSubmitPayment()).toEqual(expectedAction);
  });
  it('should create SET_PAYPAL_CONTRIBUTIONS_AMOUNT action', () => {
    const amount: number = 6;
    const expectedAction = {
      type: 'SET_PAYPAL_CONTRIBUTIONS_AMOUNT',
      amount,
    };
    expect(setPayPalContributionsAmount(amount)).toEqual(expectedAction);
  });
  it('should create PAYPAL_CONTRIBUTIONS_ERROR action', () => {
    const message: string = 'This is an error';
    const expectedAction = {
      type: 'PAYPAL_CONTRIBUTIONS_ERROR',
      message,
    };
    expect(payPalContributionsError(message)).toEqual(expectedAction);
  });
});
