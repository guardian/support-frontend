// @flow
import reducer from '../oneOffContributionsReducers';


describe('One-off Reducer', () => {

  it('should return the initial state', () => {
    expect(reducer(20, 'GBP')(undefined, {})).toMatchSnapshot();
  });

  it('should handle CHECKOUT_ERROR', () => {

    const message = 'Test error';
    const action = {
      type: 'CHECKOUT_ERROR',
      message,
    };

    const newState = reducer(20, 'GBP')(undefined, action);

    expect(newState.oneoffContrib.error).toEqual(message);
  });

  it('should handle SET_PAYPAL_BUTTON', () => {

    const value = 'ExpressCheckout';
    const action = {
      type: 'SET_PAYPAL_BUTTON',
      value,
    };

    const newState = reducer(20, 'GBP')(undefined, action);

    expect(newState.oneoffContrib.error).toMatchSnapshot();
  });

});
