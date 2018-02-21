// @flow
import { setConsentApiError } from '../contributionsThankYouActions';


describe('Contributions Thank You actions', () => {

  it('should create an action to flag a checkout error', () => {
    const consentApiError:boolean = true;
    const expectedAction = {
      type: 'CONSENT_API_ERROR',
      consentApiError,
    };
    expect(setConsentApiError(consentApiError)).toEqual(expectedAction);
  });

});
