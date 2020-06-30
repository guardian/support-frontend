// @flow

import { onIabConsentNotification } from '@guardian/consent-management-platform';
import { get as getCookie, set as setCookie } from '../cookie';
import { logException } from 'helpers/logger';
import { ccpaEnabled } from 'helpers/tracking/ccpa';

const ConsentCookieName = 'GU_TK';
const DaysToLive = 30 * 18;

const OptedIn: 'OptedIn' = 'OptedIn';
const OptedOut: 'OptedOut' = 'OptedOut';
const Unset: 'Unset' = 'Unset';

export type ThirdPartyTrackingConsent = typeof OptedIn
  | typeof OptedOut
  | typeof Unset;

const getTrackingConsent = (): Promise<ThirdPartyTrackingConsent> => {
  if (ccpaEnabled()) {
    return new Promise((resolve) => {
      onIabConsentNotification((consentState: boolean) => {
        /**
         * In CCPA mode consentState will be a boolean.
         * In non-CCPA mode consentState will be an Object.
         * Check whether consentState is valid (a boolean).
         * */
        if (typeof consentState !== 'boolean') {
          throw new Error('consentState not a boolean');
        } else {
          // consentState true means the user has OptedOut
          resolve(consentState ? OptedOut : OptedIn);
        }
      });
    }).catch((err) => {
      logException(`CCPA: ${err}`);
      // fallback to OptedOut if there's an issue getting consentState
      return Promise.resolve(OptedOut);
    });
  }

  const cookieVal: ?string = getCookie(ConsentCookieName);

  if (cookieVal) {
    const consentVal = cookieVal.split('.')[0];

    if (consentVal === '1') {
      return Promise.resolve(OptedIn);
    } else if (consentVal === '0') {
      return Promise.resolve(OptedOut);
    }
  }

  return Promise.resolve(Unset);
};

const writeTrackingConsentCookie = (newTrackingConsent: ThirdPartyTrackingConsent) => {
  if (newTrackingConsent !== Unset) {
    const cookie = [newTrackingConsent === OptedIn ? '1' : '0', Date.now()].join('.');
    setCookie(ConsentCookieName, cookie, DaysToLive);
  }
};

export { getTrackingConsent, writeTrackingConsentCookie, OptedIn, OptedOut, Unset, ConsentCookieName };
