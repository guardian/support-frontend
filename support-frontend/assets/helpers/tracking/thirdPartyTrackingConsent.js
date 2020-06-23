// @flow

import { onIabConsentNotification } from '@guardian/consent-management-platform';
import { get as getCookie, set as setCookie } from '../cookie';
import {
  detect as detectCountry,
  type IsoCountry,
} from 'helpers/internationalisation/country';

const ConsentCookieName = 'GU_TK';
const DaysToLive = 30 * 18;

const OptedIn: 'OptedIn' = 'OptedIn';
const OptedOut: 'OptedOut' = 'OptedOut';
const Unset: 'Unset' = 'Unset';

export type ThirdPartyTrackingConsent = typeof OptedIn
  | typeof OptedOut
  | typeof Unset;

const getTrackingConsent = (): Promise<ThirdPartyTrackingConsent> => {
  const countryId: IsoCountry = detectCountry();

  if (countryId === 'US') {
    return new Promise((resolve) => {
      onIabConsentNotification((consentState: boolean) => {
        /**
         * In CCPA mode consentState is a boolean
         * and a value of true means the user has OptedOut
        * */
        resolve(consentState ? OptedOut : OptedIn);
      });
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

// const getTrackingConsent = (): ThirdPartyTrackingConsent => {
//   if (trackingConsent) {
//     return trackingConsent;
//   }

//   // default to trackingConsent to Unset
//   trackingConsent = Unset;

//   const countryId: IsoCountry = detectCountry();

//   if (countryId === 'US') {
//     onIabConsentNotification((consentState) => {
//       // In CCPA mode consentState true means user has OptedOut
//       trackingConsent = consentState ? OptedOut : OptedIn;
//     });
//   } else {
//     const cookieVal: ?string = getCookie(ConsentCookieName);

//     if (cookieVal) {
//       const consentVal = cookieVal.split('.')[0];

//       if (consentVal === '1') {
//         trackingConsent = OptedIn;
//       } else if (consentVal === '0') {
//         trackingConsent = OptedOut;
//       }
//     }
//   }

//   return trackingConsent;
// };

const writeTrackingConsentCookie = (newTrackingConsent: ThirdPartyTrackingConsent) => {
  if (newTrackingConsent !== Unset) {
    const cookie = [newTrackingConsent === OptedIn ? '1' : '0', Date.now()].join('.');
    setCookie(ConsentCookieName, cookie, DaysToLive);
  }
};

export { getTrackingConsent, writeTrackingConsentCookie, OptedIn, OptedOut, Unset, ConsentCookieName };
