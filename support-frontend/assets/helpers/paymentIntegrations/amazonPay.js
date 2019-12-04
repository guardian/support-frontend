// @flow

import {setAmazonPayLibrary} from 'pages/contributions-landing/contributionsLandingActions';
import { isProd } from 'helpers/url';
import type {CountryGroupId} from "helpers/internationalisation/countryGroup";

const getAmazonRegion = (countryGroupId: CountryGroupId, amazonLoginObject: Object): ?string => {
  switch(countryGroupId) {
    case 'UnitedStates':
      return amazonLoginObject.Region.NorthAmerica;
    default:
      // Currently only US is supported
      return undefined;
  }
};

const getAmazonPayClientId = (isTestUser: boolean): string => {
  return isTestUser ?
    window.guardian.amazonPayClientId.uat :
    window.guardian.amazonPayClientId.default;
};

const setupAmazonPay = (countryGroupId: CountryGroupId, dispatch: Function, isTestUser: boolean): void => {
  window.setOnAmazonReady((amazonLoginObject, amazonPaymentsObject) => {
    const amazonRegion = getAmazonRegion(countryGroupId, amazonLoginObject);
    if (amazonRegion) {
      const clientId = getAmazonPayClientId(isTestUser);
      amazonLoginObject.setClientId(clientId);

      if (isTestUser || !isProd()) {
        amazonLoginObject.setSandboxMode(true);
      }

      amazonLoginObject.setRegion(amazon.Login.Region.NorthAmerica);

      dispatch(setAmazonPayLibrary({amazonLoginObject, amazonPaymentsObject}));
    }
  });
};

export {
  setupAmazonPay,
};
