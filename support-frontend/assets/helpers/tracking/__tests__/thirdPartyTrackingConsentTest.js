// @flow

// ----- Imports ----- //

import {
  ConsentCookieName,
  getTrackingConsent, OptedIn, OptedOut, Unset,
} from '../thirdPartyTrackingConsent';

// ----- Tests ----- //

jest.mock('ophan', () => ({ viewId: '123456' }));

describe('thirdPartyTrackingConsent', () => {
  it('should return the correct ThirdPartyTrackingConsent', () => {

    // When no cookie is present the value should be 'Unset'
    expect(getTrackingConsent()).toEqual(Unset);

    // When the cookie is present with a value starting with 1 the
    // user has opted in
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${ConsentCookieName}=1.1234567`,
    });
    expect(getTrackingConsent()).toEqual(OptedIn);


    // When the cookie is present with a value starting with 0 the
    // user has opted out
    window.document.cookie = `${ConsentCookieName}=0.1234567`;
    expect(getTrackingConsent()).toEqual(OptedOut);
  });
});
