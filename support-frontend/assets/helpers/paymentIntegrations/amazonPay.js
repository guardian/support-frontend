// @flow

import {setThirdPartyPaymentLibrary} from "pages/contributions-landing/contributionsLandingActions";
import type {ContributionType} from "helpers/contributions";

function setupAmazonPay(contributionType: ContributionType, dispatch: Function) {
  window.setOnAmazonReady((amazon, OffAmazonPayments) => {
    console.log('ready!');
    amazon.Login.setClientId(window.guardian.amazonPayClientId.ONE_OFF.uat);

    dispatch(setThirdPartyPaymentLibrary({
      [contributionType]: { AmazonPay: { amazon, OffAmazonPayments } }
    }))
  });
}

export {
  setupAmazonPay,
};
