// @flow

import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';
import { getVariantsAsString } from 'helpers/abTests/abtest';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { getOphanIds } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import { createStripePaymentRequest } from 'helpers/paymentIntegrations/stripeCheckout';


// ----- Types ----- //
type EventType = 'DataLayerReady' | 'SuccessfulConversion' | 'CanUsePaymentRequestApi';

// ----- Functions ----- //

function getDataValue(name, generator) {
  let value = storage.getSession(name);
  if (value === null) {
    value = generator();
    storage.setSession(name, value);
  }
  return value;
}

function getCurrency() {
  return detectCurrency(detectCountryGroup()).iso;
}

function getContributionValue() {
  const param = getQueryParameter('contributionValue');
  if (param) {
    storage.setSession('contributionValue', String(parseInt(param, 10)));
  }
  return storage.getSession('contributionValue') || 0;
}

function pushToDataLayer(event: EventType, participations: Participations) {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];

  window.googleTagManagerDataLayer.push({
    event,
    // orderId anonymously identifies this user in this session.
    // We need this to prevent page refreshes on conversion pages being
    // treated as new conversions
    orderId: getDataValue('orderId', uuidv4),
    currency: getDataValue('currency', getCurrency),
    value: getContributionValue(),
    paymentMethod: storage.getSession('paymentMethod') || undefined,
    campaignCodeBusinessUnit: getQueryParameter('CMP_BUNIT') || undefined,
    campaignCodeTeam: getQueryParameter('CMP_TU') || undefined,
    experience: getVariantsAsString(participations),
    ophanBrowserID: getOphanIds().browserId,
  });
}

function trackWhetherBrowserCanUsePaymentRequestApi(participations: Participations) {
  const currency = getDataValue('currency', getCurrency) || 'GBP';

  const stripePaymentRequest = createStripePaymentRequest(
    currency,
    // TODO: pass real value for isTestUser... but how do I get it!?
    true,
    // dummy value for amount
    1,
  );

  stripePaymentRequest.canMakePayment().then((canUsePaymentRequestApi) => {
    if (canUsePaymentRequestApi) {
      pushToDataLayer('CanUsePaymentRequestApi', participations);
    }
  });
}

// ----- Exports ---//

function init(participations: Participations) {
  pushToDataLayer('DataLayerReady', participations);
  trackWhetherBrowserCanUsePaymentRequestApi(participations);
}

function successfulConversion(participations: Participations) {
  pushToDataLayer('SuccessfulConversion', participations);
}

export {
  init,
  successfulConversion,
};
