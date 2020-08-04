// @flow
// ----- Imports ----- //

import {
  onConsentChange as _onConsentChange,
} from '@guardian/consent-management-platform';
import {
  getTrackingConsent,
  OptedIn,
  OptedOut,
} from '../thirdPartyTrackingConsent';

const onConsentChange: any = _onConsentChange;

jest.mock('@guardian/consent-management-platform', () => ({
  onConsentChange: jest.fn(),
}));

jest.mock('helpers/logger', () => ({
  logException: jest.fn(),
}));

// ----- Tests ----- //

describe('thirdPartyTrackingConsent', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return OptedOut as ThirdPartyTrackingConsent if onConsentChange throws an error', () => {
    onConsentChange.mockImplementation(() => {
      throw new Error('fail');
    });

    return getTrackingConsent().then((trackingConsent) => {
      expect(trackingConsent).toBe(OptedOut);
    });
  });

  describe('should return the correct ThirdPartyTrackingConsent if ccpa mode', () => {
    it('OptedOut if CCPA doNotSell is true', () => {
      onConsentChange.mockImplementation(callback => callback({
        ccpa: {
          doNotSell: true,
        },
      }));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });

    it('OptedIn if CCPA doNotSell is false', () => {
      onConsentChange.mockImplementation(callback => callback({
        ccpa: {
          doNotSell: false,
        },
      }));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedIn);
      });
    });
  });

  describe('should return the correct ThirdPartyTrackingConsent if TCFv2 mode', () => {
    it('OptedOut if all consents are false', () => {
      onConsentChange.mockImplementation(callback => callback({
        tcfv2: {
          consents: {
            0: false,
            1: false,
            2: false,
          },
        },
      }));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });

    it('OptedOut if some consents are false', () => {
      onConsentChange.mockImplementation(callback => callback({
        tcfv2: {
          consents: {
            0: true,
            1: true,
            2: false,
          },
        },
      }));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedOut);
      });
    });

    it('OptedIn if all consents are true', () => {
      onConsentChange.mockImplementation(callback => callback({
        tcfv2: {
          consents: {
            0: true,
            1: true,
            2: true,
          },
        },
      }));

      return getTrackingConsent().then((trackingConsent) => {
        expect(trackingConsent).toBe(OptedIn);
      });
    });
  });
});
