// @flow

import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';
import { getVariantsAsString } from 'helpers/abTests/abtest';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { getOphanIds } from 'helpers/tracking/acquisitions';
import { logException } from 'helpers/logger';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ----- Types ----- //
type EventType = 'DataLayerReady' | 'SuccessfulConversion';

type PaymentRequestAPIStatus =
  'PaymentRequestAPINotAvailable' |
  'CanMakePaymentNotAvailable' |
  'AvailableNotInUse' |
  'AvailableInUse' |
  'PaymentRequestAPIError' |
  'PromiseNotSupported' |
  'PromiseRejected' |
  'PaymentApiPromiseRejected';

// ----- Functions ----- //

function getDataValue(name, generator) {
  let value = storage.getSession(name);
  if (value === null) {
    value = generator();
    storage.setSession(name, value);
  }
  return value;
}

function getCurrency(): IsoCurrency {
  return detectCurrency(detectCountryGroup());
}

function getPaymentAPIStatus(): Promise<PaymentRequestAPIStatus> {
  return new Promise((resolve) => {
    try {

      const { PaymentRequest } = window;

      if (typeof PaymentRequest !== 'function') {
        resolve('PaymentRequestAPINotAvailable');
      }

      const supportedInstruments = [
        {
          supportedMethods: 'basic-card',
          data: {
            supportedNetworks: ['visa', 'mastercard', 'amex', 'jcb',
              'diners', 'discover', 'mir', 'unionpay'],
            supportedTypes: ['credit', 'debit'],
          },
        },
      ];

      const details = {
        total: {
          label: 'tracking',
          amount:
            {
              value: '1',
              currency: getCurrency(),
            },
        },
      };

      const request = new PaymentRequest(supportedInstruments, details);
      if (request && !request.canMakePayment) {
        resolve('CanMakePaymentNotAvailable');
      }

      request
        .canMakePayment()
        .then((result) => {
          if (result) {
            resolve('AvailableInUse');
          } else {
            resolve('AvailableNotInUse');
          }
        })
        .catch((e) => {
          logException(e.message);
          resolve('PaymentApiPromiseRejected');
        });
    } catch (e) {
      resolve('PaymentRequestAPIError');
    }
  });
}

function getContributionValue() {
  const param = getQueryParameter('contributionValue');
  if (param) {
    storage.setSession('contributionValue', String(parseInt(param, 10)));
  }
  return storage.getSession('contributionValue') || 0;
}

function sendData(event: EventType, participations: Participations, paymentRequestApiStatus: PaymentRequestAPIStatus) {
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
    paymentRequestApiStatus,
  });
}


function pushToDataLayer(event: EventType, participations: Participations) {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];

  try {
    getPaymentAPIStatus()
      .then((paymentRequestApiStatus) => {
        sendData(event, participations, paymentRequestApiStatus);
      })
      .catch((e) => {
        logException(e.message);
        sendData(event, participations, 'PromiseRejected');
      });
  } catch (e) {
    sendData(event, participations, 'PromiseNotSupported');
  }

}

function init(participations: Participations) {
  pushToDataLayer('DataLayerReady', participations);
}

function successfulConversion(participations: Participations) {
  pushToDataLayer('SuccessfulConversion', participations);
}

// ----- Exports ---//

export {
  init,
  successfulConversion,
};
