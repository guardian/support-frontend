// @flow
import reducer from '../contributionsThankYouReducer';


describe('Thank you Reducer', () => {

  it('should return the initial state', () => {
    console.log(reducer(undefined, {}));
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle CONSENT_API_ERROR', () => {

    const consentApiError = true;
    const action = {
      type: 'CONSENT_API_ERROR',
      consentApiError,
    };

    const newState = reducer(undefined, action);

    expect(newState.thankYouState.consentApiError).toEqual(consentApiError);
  });
});
