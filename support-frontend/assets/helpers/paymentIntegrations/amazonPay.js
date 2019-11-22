// @flow

import {setAmazonPayLibrary} from "pages/contributions-landing/contributionsLandingActions";
import type {ContributionType} from "helpers/contributions";

function setupAmazonPay(contributionType: ContributionType, dispatch: Function) {
  window.setOnAmazonReady((amazonLoginObject, amazonPaymentsObject) => {
    console.log('ready!');
    amazonLoginObject.setClientId(window.guardian.amazonPayClientId.ONE_OFF.uat);

    dispatch(setAmazonPayLibrary({ amazonLoginObject, amazonPaymentsObject }));
  });
}

export {
  setupAmazonPay,
};
