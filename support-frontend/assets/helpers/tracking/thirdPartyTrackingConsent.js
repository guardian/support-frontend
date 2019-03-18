// @flow

import { get as getCookie } from '../cookie';

const ConsentCookieName = 'GU_TK';
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

export { getTrackingConsent, OptedIn, OptedOut, Unset, ConsentCookieName };
