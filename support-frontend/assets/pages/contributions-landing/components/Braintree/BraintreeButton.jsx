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


// ----- Component ----- //

function BraintreeButton(props: PropTypes) {
  console.log(props.braintreeHasLoaded);
  return (
    <button id="venmo-button">
      <div id="payment-form">
        <p>Pay $10</p>
      </div>
    </button>
  );
}


// ----- Default props----- //


export default BraintreeButton;
