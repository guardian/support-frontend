// @flow

import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
// ----- Imports ----- //
import {
  setBraintreeHasLoaded,
} from '../../pages/contributions-landing/contributionsLandingActions';


const clientToken = 'sandbox_hcjm93t6_tfkv8f9d3sjvg8gy';

// ----- Functions ----- //

function loadBraintree(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.src = 'https://js.braintreegateway.com/web/3.50.1/js/client.min.js';
    if (document.head) {
      document.head.appendChild(script);
    }
  });
}

function loadVenmo(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.src = 'https://js.braintreegateway.com/web/3.50.1/js/venmo.min.js';
    if (document.head) {
      document.head.appendChild(script);
    }
  });
}

function loadDataCollector(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.src = 'https://js.braintreegateway.com/web/3.50.1/js/data-collector.min.js';
    if (document.head) {
      document.head.appendChild(script);
    }
  });
}

const getClientInstance: () => Promise<Object> = () => new Promise((resolve, reject) => {
  window.braintree.client.create({
    authorization: clientToken,
  }, (clientErr, clientInstance) => {
    // Stop if there was a problem creating the client.
    // This could happen if there is a network error or if the authorization
    // is invalid.
    if (clientErr) {
      return reject(clientErr);
    }
    return resolve(clientInstance);
  });
});


const getDeviceData: (Object) => Promise<Object> = clientInstance => new Promise((resolve, reject) => {
  window.braintree.dataCollector.create({
    client: clientInstance,
    paypal: true,
  }, (dataCollectorErr, dataCollectorInstance) => {
    if (dataCollectorErr) {
      return reject(dataCollectorErr);
    }
    return resolve(dataCollectorInstance.deviceData);
  });
});

const getVenmoInstance: (Object) => Promise<Object> = clientInstance => new Promise((resolve, reject) => {
  window.braintree.venmo.create({
    client: clientInstance,
  }, (venmoInstanceErr, venmoInstance) => {
    if (venmoInstanceErr) {
      return reject(venmoInstanceErr);
    }
    return resolve(venmoInstance);
  });
});


function setupVenmoButton(
  venmoInstance: Object,
  deviceData: string,
  onPaymentAuthorisation: (paymentAuthorisation: PaymentAuthorisation) => void,
) {

  window.venmoInstance = venmoInstance;
  window.venmoOnSuccess = onPaymentAuthorisation;
  console.log(venmoInstance);
  if (!venmoInstance.isBrowserSupported()) {
    console.log('Browser does not support Venmo');
    return;
  }

  // displayVenmoButton(venmoInstance, venmoButton, deviceData);
  console.log('supported:', venmoInstance.isBrowserSupported());
  // venmoInstance is ready to be used.
}


function handleVenmoError(dispatch: Function) {
  return (err) => {
    dispatch();
    if (err.code === 'VENMO_CANCELED') {
      console.log('App is not available or user aborted payment flow');
    } else if (err.code === 'VENMO_APP_CANCELED') {
      console.log('User canceled payment flow');
    } else {
      console.error('An error occurred:', err.message);
    }
  };
}

function setupBraintree(
  dispatch: Function,
  onPaymentAuthorisation: (paymentAuthorisation: PaymentAuthorisation) => void,
) {

  window.venmoOnError = handleVenmoError(dispatch);

  loadBraintree().then(() => {
    getClientInstance().then((clientInstance) => {
      loadDataCollector().then(() => {
        getDeviceData(clientInstance).then((deviceData) => {
          loadVenmo().then(() => {
            getVenmoInstance(clientInstance).then((venmoInstance) => {
              setupVenmoButton(venmoInstance, JSON.stringify(deviceData), onPaymentAuthorisation);
            }).catch((createErr) => {
              console.error('Error creating Venmo instance', createErr);
            });
            dispatch(setBraintreeHasLoaded());
          });
        }).catch((err) => {
          console.log('error getting device collector data: ', err);
        });
      });
    }).catch((err) => {
      console.log('error getting braintree client: ', err);
    });
  });
}

const showBraintree = (dispatch: Function) => {
  loadBraintree()
    .then(() => {
      dispatch(setBraintreeHasLoaded());
    });
};

// ----- Exports ----- //

export {
  showBraintree,
  setupBraintree,
};
