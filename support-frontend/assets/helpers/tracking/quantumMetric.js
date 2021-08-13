// @flow

import { onConsentChangeEvent } from './thirdPartyTrackingConsent';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

const quantumMetricVendorKey = 'quantum-metric';

const vendorIds: {
  [key: string]: string
} = {
  [quantumMetricVendorKey]: 'not-yet-defined', // This means it requires all consents to be true
};

function init() {
  if (isSwitchOn('enableQuantumMetric')) {
    onConsentChangeEvent((thirdPartyTrackingConsent: {
      [key: string]: boolean
    }) => {
      if (thirdPartyTrackingConsent[quantumMetricVendorKey]) {
        const qtm = document.createElement('script');
        qtm.type = 'text/javascript';
        qtm.async = true;
        qtm.src = 'https://cdn.quantummetric.com/qscripts/quantum-gnm.js';
        const d = document.getElementsByTagName('script')[0];
        if (!window.QuantumMetricAPI && d && d.parentNode) {
          d.parentNode.insertBefore(qtm, d);
        }
      }
    }, vendorIds);
  }
}

export {
  init,
};
