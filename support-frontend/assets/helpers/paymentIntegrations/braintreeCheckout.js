// @flow

// ----- Imports ----- //
import { setBraintreeHasLoaded } from '../../pages/contributions-landing/contributionsLandingActions';



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

/* eslint-disable no-param-reassign */
function displayVenmoButton(venmoInstance, venmoButton, deviceData) {
  // Assumes that venmoButton is initially display: none.
  console.log(deviceData);
  if (venmoButton) {
    venmoButton.style.display = 'block';

    venmoButton.addEventListener('click', () => {
      venmoButton.disabled = true;

      venmoInstance.tokenize((tokenizeErr, payload) => {
        if (tokenizeErr) {
          venmoButton.style.display = 'block';
          venmoButton.style.cssText = 'color: red; border: 1px solid black';
          console.log(tokenizeErr);
          handleVenmoError(tokenizeErr);
        } else {
          venmoButton.style.display = 'block';
          venmoButton.style.cssText = 'color: blue; border: 1px solid black';
          venmoButton.innerHTML = JSON.stringify(payload);
          handleVenmoSuccess(payload);
        }
        // ...
      });
    });
  }
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


function setupVenmoButton(venmoInstance: Object, deviceData: string) {
  console.log(venmoInstance);
  if (!venmoInstance.isBrowserSupported()) {
    alert('Browser does not support Venmo');
    return;
  }
  const venmoButton = document.getElementById('venmo-button');
  if (venmoButton && venmoButton instanceof HTMLButtonElement) {
    console.log('about to display');
    displayVenmoButton(venmoInstance, venmoButton, deviceData);
  }
  console.log('supported:', venmoInstance.isBrowserSupported());
  // venmoInstance is ready to be used.
}

function setupBraintree(dispatch: Function) {
  loadBraintree().then(() => {
    getClientInstance().then((clientInstance) => {
      loadDataCollector().then(() => {
        getDeviceData(clientInstance).then((deviceData) => {
          loadVenmo().then(() => {
            getVenmoInstance(clientInstance).then((venmoInstance) => {
              setupVenmoButton(venmoInstance, JSON.stringify(deviceData));
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
