// @flow

import {setAmazonPayLibrary} from 'pages/contributions-landing/contributionsLandingActions';
import type {ContributionType} from 'helpers/contributions';
import { isProd } from 'helpers/url';

const setupAmazonPay = (contributionType: ContributionType, dispatch: Function, isTestUser: boolean): void => {
  window.setOnAmazonReady((amazonLoginObject, amazonPaymentsObject) => {
    const clientId = getAmazonPayClientId(contributionType, isTestUser);
    amazonLoginObject.setClientId(clientId);

    if (isTestUser || !isProd()) {
      amazonLoginObject.setSandboxMode(true);
    }

    dispatch(setAmazonPayLibrary({ amazonLoginObject, amazonPaymentsObject }));
  });
};

const getAmazonPayClientId = (contributionType: ContributionType, isTestUser: boolean): string => {
  return isTestUser ?
    window.guardian.amazonPayClientId[contributionType].uat :
    window.guardian.amazonPayClientId[contributionType].default;
};

export {
  setupAmazonPay,
  getAmazonPayClientId,
};
