// @flow

import {setThirdPartyPaymentLibrary} from "pages/contributions-landing/contributionsLandingActions";
import type {ContributionType} from "helpers/contributions";

function setupAmazonPay(contributionType: ContributionType, dispatch: Function) {
  window.setOnAmazonReady((amazonLoginObject, amazonPaymentsObject) => {
    console.log('ready!');
    amazonLoginObject.setClientId(window.guardian.amazonPayClientId.ONE_OFF.uat);

    dispatch(setThirdPartyPaymentLibrary({
      [contributionType]: { AmazonPay: { amazonLoginObject, amazonPaymentsObject } }
    }))
  });
}

export {
  setupAmazonPay,
};
