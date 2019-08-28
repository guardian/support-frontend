// @flow

// ----- Imports ----- //
import { setBraintreeHasLoaded } from '../../pages/contributions-landing/contributionsLandingActions';


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


function handleVenmoError(err) {
  if (err.code === 'VENMO_CANCELED') {
    console.log('App is not available or user aborted payment flow');
  } else if (err.code === 'VENMO_APP_CANCELED') {
    console.log('User canceled payment flow');
  } else {
    console.error('An error occurred:', err.message);
  }
}

function handleVenmoSuccess(payload) {

  // Send payload.nonce to your server.
  console.log('Got a payment method nonce:', payload.nonce);
  // Display the Venmo username in your checkout UI.
  console.log('Venmo user:', payload.details.username);
}


function displayVenmoButton(venmoInstance, venmoButton) {

  const test = true;

  console.log(venmoButton);
  // Assumes that venmoButton is initially display: none.
  venmoButton.style.display = 'block';

  venmoButton.addEventListener('click', function () {
    venmoButton.disabled = true;

    venmoInstance.tokenize(function (tokenizeErr, payload) {
      venmoButton.removeAttribute('disabled');
      if (tokenizeErr) {
        console.log(tokenizeErr);
        handleVenmoError(tokenizeErr);
      } else {
        console.log(payload);
        handleVenmoSuccess(payload);
      }
      // ...
    });
  });
}

const getClientInstance: Promise<Object> = () => {
  return new Promise((resolve, reject) => {
    window.braintree.client.create({
      authorization: clientToken
    }, function (clientErr, clientInstance) {
      // Stop if there was a problem creating the client.
      // This could happen if there is a network error or if the authorization
      // is invalid.
      if (clientErr) {
        return reject(clientErr);
      }
      return resolve(clientInstance);
    })
  })
};


const getDeviceData: Promise<Object> = (clientInstance) => {
  return new Promise((resolve, reject) => {
    window.braintree.dataCollector.create({
      client: clientInstance,
      paypal: true
    }, function (dataCollectorErr, dataCollectorInstance) {
      if (dataCollectorErr) {
        return reject(dataCollectorErr);
      }
      return resolve(dataCollectorInstance.deviceData)
    });
  })
};

const getVenmoInstance: Promise<Object> = (clientInstance) => {
  return new Promise((resolve, reject) => {
    window.braintree.venmo.create({
      client: clientInstance
    }, function (venmoInstanceErr, venmoInstance) {
      if (venmoInstanceErr) {
        return reject(venmoInstanceErr);
      }
      return resolve(venmoInstance)
    });
  })
};

const clientToken = 'sandbox_hcjm93t6_tfkv8f9d3sjvg8gy';

function setupVenmoButton(venmoInstance) {
  const venmoButton = document.getElementById('venmo-button');
  console.log(venmoInstance);
  if (!venmoInstance.isBrowserSupported()) {
    console.log('Browser does not support Venmo');
    return;
  }
  displayVenmoButton(venmoInstance, venmoButton);
  console.log('supported:', venmoInstance.isBrowserSupported())
  // venmoInstance is ready to be used.
}

function setupBraintree(dispatch: Function) {
  loadBraintree().then(() => {
    getClientInstance().then((clientInstance) => {
      loadDataCollector().then(() => {
        getDeviceData(clientInstance).then((deviceData) => {
          loadVenmo().then(() => {
            getVenmoInstance(clientInstance).then((venmoInstance) => {
              setupVenmoButton(venmoInstance);
            }).catch(function (createErr) {
              console.error('Error creating Venmo instance', createErr);
            });
            dispatch(setBraintreeHasLoaded());
          })
        }).catch(err => {
          console.log('error getting device collector data: ', err);
        });
      })
    }).catch(err => {
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
    getPayPalOptions,
    showBraintree,
    setupBraintree,
    payPalRequestData,
    setupSubscriptionPayPalPayment,
    setupRecurringPayPalPayment,
  };
