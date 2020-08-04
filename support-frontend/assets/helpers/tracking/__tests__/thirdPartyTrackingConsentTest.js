// @flow
// ----- Imports ----- //

// import {
//   ccpaEnabled as _ccpaEnabledy,
// } from 'helpers/tracking/ccpa';
import {
  onConsentChange as _onConsentChange,
// onIabConsentNotification as _onIabConsentNotification,
} from '@guardian/consent-management-platform';
// import { get as _getCookie } from 'helpers/cookie';
import {
  getTrackingConsent,
  OptedIn,
  OptedOut,
} from '../thirdPartyTrackingConsent';

// const ccpaEnabled: any = _ccpaEnabledy;
// const getCookie: any = _getCookie;
const onConsentChange: any = _onConsentChange;

// jest.mock('helpers/tracking/ccpa', () => ({
//   ccpaEnabled: jest.fn(),
// }));

jest.mock('@guardian/consent-management-platform', () => ({
  onConsentChange: jest.fn(),
}));

// jest.mock('helpers/cookie', () => ({
//   get: jest.fn(),
// }));

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
