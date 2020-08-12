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

const onConsentChangeEvent =
  (onConsentChangeCallback: (thirdPartyTrackingConsent: ThirdPartyTrackingConsent) => void): Promise<void> => {
    /**
     * Dynamically load @guardian/consent-management-platform
     * on condition we're not server side rendering (ssr) the page.
     * @guardian/consent-management-platform breaks ssr otherwise.
     */
    if (!getGlobal('ssr')) {
      // return async import for unit tests
      return import('@guardian/consent-management-platform').then(({
        onConsentChange,
      }) => {
        /**
          * @guardian/consent-management-platform exports a function
          * onConsentChange, this takes a callback, which is called
          * each time consent changes. EG. if a user consents via the CMP.
          * The callback will receive the user's consent as the parameter
          * "state". We take process the state and call onConsentChangeCallback
          * with the correct ThirdPartyTrackingConsent.
        */
        try {
          onConsentChange((state: ConsentState) => {
            const consentGranted = state.ccpa ?
              !state.ccpa.doNotSell : state.tcfv2 && Object.values(state.tcfv2.consents).every(Boolean);

            if (consentGranted) {
              onConsentChangeCallback(OptedIn);
            } else {
              onConsentChangeCallback(OptedOut);
            }
          });
        } catch (err) {
          logException(`CCPA: ${err}`);
          onConsentChangeCallback(OptedOut);
        }
      });
    }

    onConsentChangeCallback(OptedOut);

    // return Promise.resolve() for unit tests
    return Promise.resolve();
  };

export { onConsentChangeEvent, OptedIn, OptedOut };
