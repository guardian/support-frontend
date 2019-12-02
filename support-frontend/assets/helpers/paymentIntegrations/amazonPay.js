// @flow

import {setAmazonPayLibrary} from "pages/contributions-landing/contributionsLandingActions";
import type {ContributionType} from "helpers/contributions";

function setupAmazonPay(contributionType: ContributionType, dispatch: Function, isTestUser: boolean) {
  window.setOnAmazonReady((amazonLoginObject, amazonPaymentsObject) => {
    const clientId = isTestUser ?
      window.guardian.amazonPayClientId[contributionType].uat :
      window.guardian.amazonPayClientId[contributionType].default;
    amazonLoginObject.setClientId(clientId);

    dispatch(setAmazonPayLibrary({ amazonLoginObject, amazonPaymentsObject }));
  });
}

export {
  setupAmazonPay,
};
