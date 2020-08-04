// @flow
<<<<<<< HEAD
import { logException } from 'helpers/logger';
import { getGlobal } from 'helpers/globals';

type ConsentVector = {
    [key: string]: boolean;
}
=======

import { onConsentChange } from '@guardian/consent-management-platform';
import { logException } from 'helpers/logger';
>>>>>>> 9842386a2... implement tcfv2 banner

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
  (onConsentChangeCallback: (thirdPartyTrackingConsent: {
    [key: string]: boolean
  }) => void, vendorIds: {
    [key: string]: string
  }): Promise<void> => {
    let consentGranted = Object.keys(vendorIds).reduce((accumulator, vendorKey) => ({
      ...accumulator,
      [vendorKey]: false,
    }), {});

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
