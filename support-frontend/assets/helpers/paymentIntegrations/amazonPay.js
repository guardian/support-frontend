// @flow

import { setAmazonPayLibrary } from 'pages/contributions-landing/contributionsLandingActions';
import { isProd } from 'helpers/url';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { logException } from 'helpers/logger';

const getAmazonRegion = (countryGroupId: CountryGroupId, amazonLoginObject: Object): ?string => {
  switch (countryGroupId) {
    case 'UnitedStates':
      return amazonLoginObject.Region.NorthAmerica;
    default:
      // Currently only US is supported
      return undefined;
  }
};

const getAmazonPayClientId = (isTestUser: boolean): string => (isTestUser ?
  window.guardian.amazonPayClientId.uat :
  window.guardian.amazonPayClientId.default);

const setupAmazonPay = (countryGroupId: CountryGroupId, dispatch: Function, isTestUser: boolean): void => {
  const isSandbox = !isProd();

  window.setOnAmazonReady((amazonLoginObject, amazonPaymentsObject) => {
    const amazonRegion = getAmazonRegion(countryGroupId, amazonLoginObject);
    if (amazonRegion) {
      const clientId = getAmazonPayClientId(isTestUser);
      amazonLoginObject.setClientId(clientId);

      if (isTestUser || isSandbox) {
        amazonLoginObject.setSandboxMode(true);
      }

      amazonLoginObject.setRegion(amazonLoginObject.Region.NorthAmerica);

      dispatch(setAmazonPayLibrary({ amazonLoginObject, amazonPaymentsObject }));
    }
  });

  // Amazon pay requires us to use a different script for sandbox mode
  const widgetsUrl = isTestUser || isSandbox ?
    'https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js' :
    'https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js';

  new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.onerror = reject;
    script.src = widgetsUrl;

    if (document.head) {
      document.head.appendChild(script);
    }
  }).catch(error => {
    logException(`Error loading ${widgetsUrl}`, error)
  });
};

export {
  setupAmazonPay,
};
