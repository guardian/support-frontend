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
    <div id="venmo-button">
      <form id="checkout">
        <div id="payment-form" />
        <input type="submit" value="Pay $10" />
      </form>
    </div>
  );
}


// ----- Default props----- //


export default BraintreeButton;
