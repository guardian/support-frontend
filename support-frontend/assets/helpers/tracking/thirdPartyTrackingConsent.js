// @flow
import { logException } from 'helpers/logger';
import { getGlobal } from 'helpers/globals';

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
  (onConsentChangeCallback: (thirdPartyTrackingConsent: boolean | {
    [key: string]: boolean
  }) => void, sourcePointVendorIds: ?{
    [key: string]: string
  }): Promise<void> => {
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
            let consentGranted: boolean | {
              [key: string]: boolean
            } = false;

            if (state.ccpa) {
              consentGranted = !state.ccpa.doNotSell;
            } else if (state.tcfv2) {
              if (
                sourcePointVendorIds &&
                state.tcfv2.vendorConsents
              ) {
                /**
                 * Loop over sourcePointVendorIds and pull
                 * vendor specific consent from state.
                 */
                consentGranted = Object.keys(sourcePointVendorIds).reduce((accumulator, vendorKey) => {
                  if (sourcePointVendorIds) {
                    const vendorId = sourcePointVendorIds[vendorKey];

                    if (
                      state.tcfv2 &&
                      state.tcfv2.vendorConsents &&
                      state.tcfv2.vendorConsents[vendorId] !== undefined
                    ) {
                      return {
                        ...accumulator,
                        [vendorKey]: state.tcfv2.vendorConsents[vendorId],
                      };
                    }

                    return {
                      ...accumulator,
                      [vendorKey]: state.tcfv2 ? Object.values(state.tcfv2.consents).every(Boolean) : false,
                    };
                  }

                  return {
                    ...accumulator,
                  };
                }, {});
              } else {
                /**
                 * If sourcePointVendorIds is undefined fallback
                 * to all 10 purposes having to be true for consentGranted to be
                 * true
                 */
                consentGranted = Object.values(state.tcfv2.consents).every(Boolean);
              }
            }

            onConsentChangeCallback(consentGranted);
          });
        } catch (err) {
          logException(`CCPA: ${err}`);
          // fallback to consentGranted false in case of an error
          onConsentChangeCallback(false);
        }
      });
    }

    // fallback to consentGranted false if server side rendering
    onConsentChangeCallback(false);
    // return Promise.resolve() for unit tests
    return Promise.resolve();
  };

export { onConsentChangeEvent };
