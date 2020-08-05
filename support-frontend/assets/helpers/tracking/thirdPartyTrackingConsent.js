// @flow

import { logException } from 'helpers/logger';
import { getGlobal } from 'helpers/globals';

const OptedIn: 'OptedIn' = 'OptedIn';
const OptedOut: 'OptedOut' = 'OptedOut';

export type ThirdPartyTrackingConsent = typeof OptedIn | typeof OptedOut;

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

const getTrackingConsent = (): Promise<ThirdPartyTrackingConsent> => new Promise((resolve, reject) => {
  /**
   * Dynamically load @guardian/consent-management-platform
   * on condition we're not server side rendering (ssr) the page.
   * @guardian/consent-management-platform breaks ssr otherwise.
   */
  if (!getGlobal('ssr')) {
    import('@guardian/consent-management-platform').then(({
      onConsentChange,
    }) => {
      try {
        onConsentChange((state: ConsentState) => {
          const consentGranted = state.ccpa ?
            !state.ccpa.doNotSell : state.tcfv2 && Object.values(state.tcfv2.consents).every(Boolean);

          if (consentGranted) {
            resolve(OptedIn);
          } else {
            resolve(OptedOut);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  } else {
    resolve(OptedOut);
  }
}).catch((err) => {
  logException(`CCPA: ${err}`);
  // fallback to OptedOut if there's an issue getting consentState
  return Promise.resolve(OptedOut);
});

export { getTrackingConsent, OptedIn, OptedOut };
