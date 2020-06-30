// @flow
// ----- Imports ----- //

import {
  ccpaEnabled as _ccpaEnabledy,
} from 'helpers/tracking/ccpa';
import {
  onIabConsentNotification as _onIabConsentNotification,
} from '@guardian/consent-management-platform';
import { get as _getCookie } from 'helpers/cookie';
import {
  getTrackingConsent,
  OptedIn,
  OptedOut,
  Unset,
} from '../thirdPartyTrackingConsent';

const ccpaEnabled: any = _ccpaEnabledy;
const getCookie: any = _getCookie;
const onIabConsentNotification: any = _onIabConsentNotification;

jest.mock('helpers/tracking/ccpa', () => ({
  ccpaEnabled: jest.fn(),
}));

jest.mock('@guardian/consent-management-platform', () => ({
  onIabConsentNotification: jest.fn(),
}));

jest.mock('helpers/cookie', () => ({
  get: jest.fn(),
}));

jest.mock('helpers/logger', () => ({
  logException: jest.fn(),
}));

// ----- Tests ----- //

describe('thirdPartyTrackingConsent', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should return the correct ThirdPartyTrackingConsent if ccpaEnabled is true', () => {
    beforeEach(() => {
      ccpaEnabled.mockReturnValue(true);
    });

    it('if CCPA consentState is true', () => {
      onIabConsentNotification.mockImplementation(callback => callback(true));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });

    it('if CCPA consentState is false', () => {
      onIabConsentNotification.mockImplementation(callback => callback(false));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedIn);
      });
    });

    it('if onIabConsentNotification does not return a valid CCPA consentState', () => {
      onIabConsentNotification.mockImplementation(callback => callback('foo'));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });

    it('if onIabConsentNotification throws an error', () => {
      onIabConsentNotification.mockImplementation(() => {
        throw new Error('fail');
      });

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });
  });

  describe('should return the correct ThirdPartyTrackingConsent if ccpaEnabled is false', () => {
    beforeEach(() => {
      ccpaEnabled.mockReturnValue(false);
    });

    it('if getCookie returns a value starting with 1', () => {
      getCookie.mockReturnValue('1.54321');

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedIn);
      });
    });

    it('if getCookie returns a value starting with 0', () => {
      getCookie.mockReturnValue('0.54321');

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });

    it('if getCookie returns a null value', () => {
      getCookie.mockReturnValue(null);

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(Unset);
      });
    });
  });
});
