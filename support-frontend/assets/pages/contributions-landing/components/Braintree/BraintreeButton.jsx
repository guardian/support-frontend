// @flow

// Docs: https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement

// ----- Imports ----- //

import React from 'react';
// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  setBraintreeHasLoaded: () => void,
  braintreeHasLoaded: boolean,
|};


const setupBraintree = (setBraintreeHasLoaded: () => void) => {
  const htmlElement = document.getElementById('braintree-js');
  if (htmlElement !== null) {
    htmlElement.addEventListener(
      'load',
      setBraintreeHasLoaded,
    );
  }
};

// ----- Component ----- //

function BraintreeButton(props: PropTypes){
    if (props.braintreeHasLoaded === false && window.braintree === undefined) {
      setupBraintree(props.setBraintreeHasLoaded);
      return null;
    }
    return (
      <div >
        <form id="checkout" method="post" action="/checkout">
          <div id="payment-form"></div>
          <input type="submit" value="Pay $10" />
        </form>
      </div>
    );
  }


// ----- Default props----- //


export default BraintreeButton;
