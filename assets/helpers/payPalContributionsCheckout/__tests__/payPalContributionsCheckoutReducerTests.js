// @flow

// ----- Imports ----- //

import createReducer from '../payPalContributionsCheckoutReducer';


// ----- Tests ----- //

describe('PayPal Contribution Reducer Tests', () => {

  it('should return the initial state', () => {
    const reducer = createReducer(5, 'GBP');
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle PAYPAL_PAY_CONTRIBUTIONS_CLICKED', () => {
    const reducer = createReducer(5, 'GBP');
    const action = {
      type: 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED',
      payPalPayClicked: true,
    };
    const newState = reducer(undefined, action);

    expect(newState.payPalPayClicked).toEqual(true);
    expect(newState.amount).toMatchSnapshot();
    expect(newState.currency).toMatchSnapshot();
  });

});
