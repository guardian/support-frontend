// @flow

// ----- Imports ----- //

import reducer from '../payPalContributionsCheckoutReducer';


// ----- Tests ----- //

describe('PayPal Contribution Reducer Tests', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle PAYPAL_PAY_CONTRIBUTIONS_CLICKED', () => {

    const action = {
      type: 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED',
      payPalPayClicked: true,
    };
    const newState = reducer(undefined, action);

    expect(newState.payPalPayClicked).toEqual(true);
    expect(newState.amount).toMatchSnapshot();
    expect(newState.currency).toMatchSnapshot();
  });

  it('should handle SET_PAYPAL_CONTRIBUTIONS_AMOUNT', () => {

    const action = {
      type: 'SET_PAYPAL_CONTRIBUTIONS_AMOUNT',
      amount: 33.34,
    };

    const newState = reducer(undefined, action);

    expect(newState.amount).toEqual(33.34);
    expect(newState.currency).toMatchSnapshot();
    expect(newState.payPalPayClicked).toMatchSnapshot();
  });

});
