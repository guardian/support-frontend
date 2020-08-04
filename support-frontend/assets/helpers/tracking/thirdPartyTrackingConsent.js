// @flow

import { onConsentChange } from '@guardian/consent-management-platform';
import { logException } from 'helpers/logger';

const OptedIn: 'OptedIn' = 'OptedIn';
const OptedOut: 'OptedOut' = 'OptedOut';
const Unset: 'Unset' = 'Unset';

export type ThirdPartyTrackingConsent = typeof OptedIn
  | typeof OptedOut
  | typeof Unset;

type ConsentVector = {
    [key: string]: boolean;
}

type ConsentState = {
    tcfv2?: {
        consents: ConsentVector;
        eventStatus: 'tcloaded' | 'cmpuishown' | 'useractioncomplete';
        vendorConsents: ConsentVector;
    };
    ccpa?: {
        doNotSell: boolean;
    };
}

const getTrackingConsent = (): Promise<ThirdPartyTrackingConsent> => new Promise((resolve) => {
  onConsentChange((state: ConsentState) => {
    const consentGranted = state.ccpa ?
      !state.ccpa.doNotSell : state.tcfv2 && Object.values(state.tcfv2.consents).every(Boolean);

    if (consentGranted) {
      resolve(OptedIn);
    } else {
      resolve(OptedOut);
    }
  });
}).catch((err) => {
  logException(`CCPA: ${err}`);
  // fallback to OptedOut if there's an issue getting consentState
  return Promise.resolve(OptedOut);
});

export { getTrackingConsent, OptedIn, OptedOut, Unset };
