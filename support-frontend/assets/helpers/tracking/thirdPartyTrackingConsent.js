// @flow

import { get as getCookie, set as setCookie } from '../cookie';

const ConsentCookieName = 'GU_TK';
const DaysToLive = 30 * 18;

const OptedIn: 'OptedIn' = 'OptedIn';
const OptedOut: 'OptedOut' = 'OptedOut';
const Unset: 'Unset' = 'Unset';

export type ThirdPartyTrackingConsent = typeof OptedIn
  | typeof OptedOut
  | typeof Unset;

const getTrackingConsent = (): ThirdPartyTrackingConsent => {
  const cookieVal: ?string = getCookie(ConsentCookieName);
  if (cookieVal && cookieVal.split('.')[0] === '1') { return OptedIn; }
  if (cookieVal && cookieVal.split('.')[0] === '0') { return OptedOut; }
  return Unset;
};

const writeTrackingConsentCookie = (trackingConsent: ThirdPartyTrackingConsent) => {
  if (trackingConsent !== Unset) {
    const cookie = [trackingConsent === OptedIn ? '1' : '0', Date.now()].join('.');
    setCookie(ConsentCookieName, cookie, DaysToLive);
  }
};

export { getTrackingConsent, writeTrackingConsentCookie, OptedIn, OptedOut, Unset, ConsentCookieName };
